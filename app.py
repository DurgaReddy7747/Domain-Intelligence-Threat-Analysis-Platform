
from flask import Flask, render_template, request, jsonify
import socket
import ssl
import dns.resolver
import ipaddress
import re
import requests
import whois
from datetime import datetime, timezone

app = Flask(__name__)


def validate_domain(domain):
    domain = domain.strip().lower()

    if domain.startswith(("http://", "https://")):
        domain = domain.split("://", 1)[1]

    domain = domain.split("/")[0].split(":")[0].rstrip(".")

    if len(domain) > 253 or not re.fullmatch(
        r"(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}",
        domain
    ):
        raise ValueError("Enter a valid domain name.")

    return domain


def get_dns_records(domain):
    result = {"A": [], "NS": []}

    for record_type in ("A", "NS"):
        try:
            answers = dns.resolver.resolve(domain, record_type, lifetime=4)
            result[record_type] = sorted(
                {str(answer).rstrip(".") for answer in answers}
            )
        except Exception:
            result[record_type] = []

    return result


def get_ip_address(domain):
    try:
        addresses = socket.getaddrinfo(
            domain, 443, type=socket.SOCK_STREAM
        )

        for item in addresses:
            address = item[4][0]
            if ipaddress.ip_address(address).version == 4:
                return address

        return addresses[0][4][0] if addresses else None

    except Exception:
        return None


def check_ssl(domain):
    try:
        context = ssl.create_default_context()

        with socket.create_connection((domain, 443), timeout=5) as connection:
            with context.wrap_socket(
                connection, server_hostname=domain
            ) as secure_socket:
                certificate = secure_socket.getpeercert()

        expiry = datetime.strptime(
            certificate["notAfter"],
            "%b %d %H:%M:%S %Y %Z"
        ).replace(tzinfo=timezone.utc)

        days_left = (expiry - datetime.now(timezone.utc)).days

        return {
            "enabled": True,
            "valid": days_left >= 0,
            "expires": expiry.strftime("%Y-%m-%d"),
            "days_left": days_left
        }

    except Exception:
        return {
            "enabled": False,
            "valid": False,
            "expires": None,
            "days_left": None
        }


# =================================
# WHOIS INTELLIGENCE
# =================================

def get_whois_info(domain):
    try:
        details = whois.whois(domain)

        def get_date(value):
            if isinstance(value, list):
                value = next((item for item in value if item), None)

            if not value:
                return None

            if isinstance(value, datetime):
                date_value = value
            else:
                return None

            if date_value.tzinfo is None:
                date_value = date_value.replace(tzinfo=timezone.utc)

            return date_value

        creation = get_date(details.creation_date)
        expiration = get_date(details.expiration_date)
        updated = get_date(details.updated_date)

        now = datetime.now(timezone.utc)

        domain_age = (
            (now - creation).days if creation else None
        )

        return {
            "available": True,
            "registrar": details.registrar or "Unavailable",
            "creation_date": creation.strftime("%Y-%m-%d") if creation else None,
            "expiration_date": expiration.strftime("%Y-%m-%d") if expiration else None,
            "updated_date": updated.strftime("%Y-%m-%d") if updated else None,
            "domain_age_days": domain_age,
            "status": details.status if details.status else []
        }

    except Exception:
        return {
            "available": False,
            "registrar": None,
            "creation_date": None,
            "expiration_date": None,
            "updated_date": None,
            "domain_age_days": None,
            "status": [],
            "message": "WHOIS information unavailable."
        }


# =================================
# SECURITY HEADERS ANALYSIS
# =================================

def check_security_headers(domain):
    security_headers = {
        "Strict-Transport-Security": "HSTS",
        "Content-Security-Policy": "CSP",
        "X-Frame-Options": "X-Frame-Options",
        "X-Content-Type-Options": "X-Content-Type-Options",
        "Referrer-Policy": "Referrer-Policy"
    }

    result = {
        "available": False,
        "url": None,
        "present": [],
        "missing": [],
        "headers": {}
    }

    try:
        response = requests.get(
            "https://" + domain,
            timeout=8,
            allow_redirects=True,
            headers={"User-Agent": "PHANTOM-Security-Analyzer/1.0"}
        )

        result["available"] = True
        result["url"] = response.url

        for header, label in security_headers.items():
            value = response.headers.get(header)

            if value:
                result["present"].append(label)
                result["headers"][header] = value
            else:
                result["missing"].append(label)

    except requests.RequestException:
        result["message"] = "Unable to retrieve website security headers."

    return result


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/scan", methods=["POST"])
def scan_domain():
    try:
        data = request.get_json(silent=True) or {}
        domain = validate_domain(data.get("domain", ""))

        ip_address = get_ip_address(domain)
        dns_records = get_dns_records(domain)
        ssl_info = check_ssl(domain)

        whois_info = get_whois_info(domain)
        headers_info = check_security_headers(domain)

        risk_score = 0
        findings = []

        if not ip_address:
            risk_score += 35
            findings.append("Domain IP address could not be resolved.")

        if not dns_records["NS"]:
            risk_score += 15
            findings.append("Nameserver records were not found.")

        if not ssl_info["valid"]:
            risk_score += 25
            findings.append("Valid HTTPS certificate was not confirmed.")

        if ssl_info["valid"] and ssl_info["days_left"] < 30:
            risk_score += 10
            findings.append("SSL certificate expires within 30 days.")

        # Missing security headers are informational findings.
        if headers_info["available"]:
            for header in headers_info["missing"]:
                findings.append("Missing security header: " + header)

        risk_score = min(risk_score, 100)

        if not findings:
            findings.append(
                "No issues found in the basic checks performed."
            )

        return jsonify({
            "success": True,
            "domain": domain,
            "ip_address": ip_address,
            "dns": dns_records,
            "ssl": ssl_info,
            "whois": whois_info,
            "security_headers": headers_info,
            "risk_score": risk_score,
            "findings": findings,
            "note": (
                "Technical checks only. "
                "This is not a complete security or malware verdict."
            )
        })

    except ValueError as error:
        return jsonify({
            "success": False,
            "error": str(error)
        }), 400

    except Exception as error:
        app.logger.exception("Scan failed")
        return jsonify({
            "success": False,
            "error": "Scan failed. Please try again."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)
