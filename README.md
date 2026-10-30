# 🛡️ PHANTOM
### Domain Intelligence & Threat Analysis Platform

<p align="center">
  <strong>See Beyond the Surface.</strong>
</p>

<p align="center">
  A web-based domain intelligence platform that collects technical domain information and highlights potential security misconfigurations through an easy-to-understand analysis interface.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-blue?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/Flask-Web%20Framework-black?logo=flask" alt="Flask">
  <img src="https://img.shields.io/badge/Nginx-Reverse%20Proxy-009639?logo=nginx" alt="Nginx">
  <img src="https://img.shields.io/badge/Gunicorn-WSGI-green" alt="Gunicorn">
  <img src="https://img.shields.io/badge/AWS-EC2-orange?logo=amazonaws" alt="AWS EC2">
</p>

---

## 📌 Overview

**PHANTOM** is a domain intelligence and threat analysis web application designed to help users understand the technical security posture of a domain.

It gathers publicly accessible domain information, performs basic security checks, and presents the findings in a centralized dashboard.

Instead of manually checking DNS records, TLS certificates, WHOIS information, and HTTP security headers across different tools, PHANTOM brings these checks together in one interface.

The platform is designed for learning, security awareness, and preliminary domain assessment.

## ✨ Key Features

- **DNS Intelligence:** Retrieves domain IP addresses and nameserver information.
- **IP Resolution:** Identifies the IP address associated with a domain.
- **TLS/SSL Analysis:** Checks certificate availability, validity, and expiration information.
- **WHOIS & Domain Age:** Retrieves available registration information and estimates domain age.
- **Security Header Analysis:** Checks for important HTTP security headers and highlights missing configurations.
- **Risk Assessment:** Generates a basic technical risk score based on implemented checks.
- **Security Findings:** Displays detected issues and observations in a readable format.
- **Interactive Interface:** Cybersecurity-inspired dashboard with dark/light theme support.
- **Centralized Analysis:** Brings multiple domain checks together in a single workflow.

## 🖥️ Application Preview

<!-- Add your actual application screenshots to docs/images/ -->

<p align="center">
  <img src="docs/images/phantom-dashboard.png" alt="PHANTOM Dashboard Preview" width="90%">
</p>

<p align="center">
  <em>PHANTOM dashboard — replace this placeholder with an actual application screenshot.</em>
</p>

### Suggested screenshots

| Screenshot | Description |
|---|---|
| `phantom-dashboard.png` | Main application interface |
| `phantom-analysis.png` | Domain analysis results |
| `phantom-findings.png` | Security findings and risk score |
| `phantom-mobile.png` | Responsive/mobile interface |

## ⚙️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Flask | Web application framework and API |
| HTML5 | Application structure |
| CSS3 | Styling and responsive interface |
| JavaScript | Frontend interactions |
| DNS / Socket utilities | Domain and IP information |
| SSL certificate utilities | TLS certificate checks |
| WHOIS | Domain registration information |
| Gunicorn | Python WSGI application server |
| Nginx | Reverse proxy and HTTP traffic handling |
| AWS EC2 | Cloud deployment environment |
| Ubuntu | Server operating system |

## 🏗️ Architecture

```text
              USER / WEB BROWSER
                      |
                      v
                 NGINX :80
                Reverse Proxy
                      |
                      v
              GUNICORN :8000
                Flask App
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
        DNS         TLS/SSL      WHOIS
       Lookup       Checks      Lookup
          |           |           |
          +-----------+-----------+
                      |
                      v
              ANALYSIS ENGINE
                      |
                      v
             RISK & FINDINGS
                      |
                      v
              WEB DASHBOARD
```

### Request Flow

1. User enters a domain in the PHANTOM interface.
2. Frontend sends the domain to the Flask `/scan` endpoint.
3. Backend performs the implemented domain intelligence checks.
4. Results are processed into findings and a basic technical risk score.
5. The frontend displays the analysis results.

## 📂 Project Structure

```text
phantom-security/
│
├── app.py
├── requirements.txt
├── README.md
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   └── script.js
│
├── docs/
│   └── images/
│       ├── phantom-dashboard.png
│       ├── phantom-analysis.png
│       ├── phantom-findings.png
│       └── phantom-mobile.png
│
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Python 3.x
- pip
- Git

### 1. Clone the repository

```bash
git clone https://github.com/DurgaReddy7747/Domain-Intelligence-Threat-Analysis-Platform.git
cd Domain-Intelligence-Threat-Analysis-Platform
```

### 2. Create a virtual environment

```bash
python3 -m venv venv
```

### 3. Activate the environment

**Linux / macOS**

```bash
source venv/bin/activate
```

**Windows**

```bash
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Start the application

```bash
python app.py
```

Open your browser:

```text
http://127.0.0.1:5000
```

> The application may require additional configuration depending on the installed dependencies and environment.

## 🔌 API Reference

### Scan a Domain

**Endpoint**

```http
POST /scan
```

**Request Example**

```json
{
  "domain": "example.com"
}
```

The endpoint processes the supplied domain and returns the analysis results generated by the backend.

> Refer to `app.py` for the exact request format, response structure, and supported checks.

## ☁️ Deployment

PHANTOM was deployed on an Ubuntu-based AWS EC2 environment.

The deployment architecture uses:

- **AWS EC2:** Hosts the application.
- **Ubuntu:** Server operating system.
- **Gunicorn:** Runs the Flask application.
- **Nginx:** Receives HTTP requests and forwards them to Gunicorn.
- **systemd:** Manages the Gunicorn service.

### Deployment Request Flow

```text
Internet
   |
   v
AWS EC2 Instance
   |
   v
Nginx (Port 80)
   |
   v
Gunicorn (127.0.0.1:8000)
   |
   v
Flask Application
```

## 🔐 Security & Responsible Use

PHANTOM is intended for defensive security learning and preliminary domain analysis.

- Analyze domains that you own or have permission to assess.
- Only publicly accessible technical information is used by the implemented checks.
- Do not treat the generated risk score as a definitive security verdict.
- The current implementation does not provide a complete malware detection or reputation verdict.
- The application does not currently integrate Google Safe Browsing or VirusTotal.
- Always validate findings with additional security tools before making security decisions.

## 🛣️ Future Enhancements

- [ ] Integrate Google Safe Browsing API.
- [ ] Integrate VirusTotal domain reputation checks.
- [ ] Add detailed historical scan reports.
- [ ] Export analysis reports as PDF.
- [ ] Improve risk scoring and severity classification.
- [ ] Add domain monitoring and change notifications.
- [ ] Add automated testing and CI/CD pipeline.
- [ ] Improve dashboard analytics and visualizations.

## 🎯 Project Objective

The objective of PHANTOM is to simplify preliminary domain intelligence by combining multiple technical checks into one accessible web application.

This project also provides practical experience in:

- Python backend development
- REST API development
- DNS and TLS fundamentals
- Linux server administration
- Reverse proxy configuration
- AWS EC2 deployment
- Application process management

## 👨‍💻 Author

**Ganapathi Reddy Padala**

- GitHub: [@ganapathireddy12](https://github.com/ganapathireddy12)
- LinkedIn: [Padala Ganapathi Reddy](https://linkedin.com/in/padala-ganapathi-reddy/)

---

<p align="center">
  <strong>PHANTOM — See Beyond the Surface.</strong>
  <br>
  Built for learning. Designed for domain intelligence.
</p>
