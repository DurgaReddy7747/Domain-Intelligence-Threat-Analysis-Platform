/* ==========================================
   PHANTOM SECURITY INTELLIGENCE
   DURGA REDDY | JAVASCRIPT ENGINE
========================================== */

/* ==========================================
   1. MATRIX RAIN ENGINE
========================================== */

const canvas = document.getElementById("matrix");
const ctx = canvas ? canvas.getContext("2d") : null;

const fontSize = 15;
const matrixCharacters = "010101010101010101010101";

let columns = 0;
let drops = [];

function resizeMatrix() {
  if (!canvas || !ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  columns = Math.floor(window.innerWidth / fontSize);
  drops = Array.from({ length: columns }, () => Math.random() * -100);
}

function drawMatrix() {
  if (!canvas || !ctx) return;

  ctx.fillStyle = "rgba(2, 5, 4, 0.09)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const character =
      matrixCharacters[Math.floor(Math.random() * matrixCharacters.length)];

    const x = i * fontSize;
    const y = drops[i] * fontSize;

    ctx.fillStyle = Math.random() > 0.97 ? "#d8ffe9" : "#00ff66";
    ctx.fillText(character, x, y);

    if (y > window.innerHeight && Math.random() > 0.975) {
      drops[i] = Math.random() * -40;
    }

    drops[i] += 0.8 + Math.random() * 0.8;
  }
}

resizeMatrix();
window.addEventListener("resize", resizeMatrix);

if (ctx) {
  setInterval(drawMatrix, 40);
}

/* ==========================================
   2. TYPEWRITER ANIMATION
========================================== */

function typeText(element, text, speed, callback) {
  if (!element) return;

  let index = 0;
  element.textContent = "";

  function write() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(write, speed);
    } else if (callback) {
      callback();
    }
  }

  write();
}

window.addEventListener("load", () => {
  const brand = document.getElementById("brandText");
  const heading = document.getElementById("typedText");

  typeText(brand, "DURGA REDDY", 120, () => {
    setTimeout(() => {
      typeText(heading, "See Beyond the Surface.", 95);
    }, 500);
  });
});

/* ==========================================
   3. UI HELPER FUNCTIONS
========================================== */

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined && text !== null) {
    element.textContent = text;
  }

  return element;
}

function createSection(title, className = "intel-panel") {
  const section = createElement("section", className);
  const heading = createElement("h3", "", title);

  section.appendChild(heading);

  return section;
}

function createInfoCard(label, value) {
  const card = createElement("div", "intel-card");

  card.appendChild(createElement("span", "intel-label", label));
  card.appendChild(
    createElement("strong", "intel-value", value || "Unavailable"),
  );

  return card;
}

function createStatusCard(name, status, available) {
  const card = createElement("div", "header-card");

  card.appendChild(createElement("span", "", name));

  const statusClass = available ? "header-present" : "header-missing";
  const statusText = available ? "✓ PRESENT" : "⚠ MISSING";

  card.appendChild(createElement("strong", statusClass, statusText));

  return card;
}

/* ==========================================
   4. DNS AND SSL RESULTS
========================================== */

function renderBasicResults(data, output) {
  const section = createSection("NETWORK INTELLIGENCE");

  const grid = createElement("div", "intel-grid");

  const dnsRecords = data.dns || {};
  const ssl = data.ssl || {};

  const records = [
    ["DOMAIN", data.domain],
    ["IP ADDRESS", data.ip_address],
    ["DNS A RECORDS", dnsRecords.A?.join(", ") || "None"],
    ["NAME SERVERS", dnsRecords.NS?.join(", ") || "None"],
    ["SSL STATUS", ssl.valid ? "VALID" : "NOT CONFIRMED"],
    ["SSL EXPIRY", ssl.expires || "Unavailable"],
    [
      "SSL DAYS REMAINING",
      ssl.days_left !== null && ssl.days_left !== undefined
        ? ssl.days_left + " days"
        : "Unknown",
    ],
  ];

  records.forEach(([label, value]) => {
    grid.appendChild(createInfoCard(label, String(value ?? "Unavailable")));
  });

  section.appendChild(grid);
  output.appendChild(section);
}

/* ==========================================
   5. WHOIS INTELLIGENCE
========================================== */

function renderWhois(data, output) {
  const whois = data.whois || {};

  const section = createSection("WHOIS INTELLIGENCE");

  if (!whois.available) {
    section.appendChild(
      createElement(
        "p",
        "intel-message",
        whois.message || "WHOIS information unavailable.",
      ),
    );

    output.appendChild(section);
    return;
  }

  const grid = createElement("div", "intel-grid");

  const fields = [
    ["REGISTRAR", whois.registrar],
    [
      "DOMAIN AGE",
      whois.domain_age_days !== null && whois.domain_age_days !== undefined
        ? Number(whois.domain_age_days).toLocaleString() + " days"
        : "Unavailable",
    ],
    ["CREATION DATE", whois.creation_date],
    ["EXPIRATION DATE", whois.expiration_date],
    ["LAST UPDATED", whois.updated_date],
  ];

  fields.forEach(([label, value]) => {
    grid.appendChild(createInfoCard(label, value));
  });

  section.appendChild(grid);

  const statuses = Array.isArray(whois.status)
    ? whois.status
    : whois.status
      ? [whois.status]
      : [];

  if (statuses.length) {
    const statusArea = createElement("div", "whois-status-area");
    statusArea.appendChild(
      createElement("span", "intel-label", "REGISTRATION STATUS"),
    );

    const statusList = createElement("div", "whois-status-list");

    statuses.forEach((status) => {
      statusList.appendChild(
        createElement("span", "whois-status", String(status)),
      );
    });

    statusArea.appendChild(statusList);
    section.appendChild(statusArea);
  }

  output.appendChild(section);
}

/* ==========================================
   6. SECURITY HEADERS ANALYSIS
========================================== */

function renderSecurityHeaders(data, output) {
  const headers = data.security_headers || {};

  const section = createSection("SECURITY HEADERS ANALYSIS");

  if (!headers.available) {
    section.appendChild(
      createElement(
        "p",
        "intel-message",
        headers.message || "Security header analysis unavailable.",
      ),
    );

    output.appendChild(section);
    return;
  }

  const present = headers.present || [];
  const missing = headers.missing || [];

  const summary = createElement(
    "div",
    "intel-summary",
    `${present.length} PRESENT / ${missing.length} MISSING`,
  );

  section.appendChild(summary);

  const allHeaders = [
    "HSTS",
    "CSP",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Referrer-Policy",
  ];

  const grid = createElement("div", "header-grid");

  allHeaders.forEach((name) => {
    grid.appendChild(createStatusCard(name, "", present.includes(name)));
  });

  section.appendChild(grid);

  if (headers.url) {
    section.appendChild(
      createElement("p", "intel-source", "Analyzed URL: " + headers.url),
    );
  }

  output.appendChild(section);
}

/* ==========================================
   7. SECURITY FINDINGS
========================================== */

function renderFindings(data, output) {
  const findings = data.findings || [];

  const section = createSection("SECURITY OBSERVATIONS", "observation-panel");

  if (findings.length === 0) {
    section.appendChild(
      createElement("p", "observation-text", "No findings reported."),
    );
  } else {
    const list = createElement("div", "finding-list");

    findings.forEach((finding) => {
      const item = createElement("div", "finding-item");

      item.appendChild(createElement("span", "finding-marker", "!"));

      item.appendChild(createElement("p", "finding-text", finding));

      list.appendChild(item);
    });

    section.appendChild(list);
  }

  section.appendChild(
    createElement(
      "p",
      "intel-disclaimer",
      data.note ||
        "Technical checks only. This is not a complete security verdict.",
    ),
  );

  output.appendChild(section);
}

/* ==========================================
   8. RENDER COMPLETE SCAN
========================================== */

function renderScanResults(data, output) {
  output.innerHTML = "";

  output.appendChild(createElement("h3", "scan-result-title", "SCAN REPORT"));

  renderBasicResults(data, output);
  renderWhois(data, output);
  renderSecurityHeaders(data, output);
  renderFindings(data, output);
}

/* ==========================================
   9. DOMAIN SCAN ENGINE
========================================== */

async function startScan() {
  const domainInput = document.getElementById("domainInput");
  const output = document.getElementById("scanOutput");
  const button = document.getElementById("scanButton");

  const domain = domainInput.value.trim();

  if (!domain) {
    alert("Please enter a domain.");
    return;
  }

  output.innerHTML = "";

  button.disabled = true;
  button.textContent = "SCANNING...";

  document.getElementById("targetStatus").textContent = "INITIALIZING";
  document.getElementById("domainStatus").textContent = "PENDING";
  document.getElementById("ipAddress").textContent = "--";
  document.getElementById("sslStatus").textContent = "--";
  document.getElementById("riskScore").textContent = "--";

  const loading = createElement(
    "div",
    "scan-loading",
    "INITIALIZING PHANTOM INTELLIGENCE ENGINE...",
  );

  output.appendChild(loading);

  try {
    const response = await fetch("/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Scan request failed.");
    }

    document.getElementById("targetStatus").textContent = "COMPLETED";

    document.getElementById("domainStatus").textContent = data.ip_address
      ? "RESOLVED"
      : "UNRESOLVED";

    document.getElementById("ipAddress").textContent =
      data.ip_address || "NOT FOUND";

    document.getElementById("sslStatus").textContent = data.ssl?.valid
      ? "VALID"
      : data.ssl?.enabled
        ? "INVALID"
        : "NOT AVAILABLE";

    document.getElementById("riskScore").textContent = data.risk_score + "/100";

    renderScanResults(data, output);
  } catch (error) {
    console.error("PHANTOM scan error:", error);

    document.getElementById("targetStatus").textContent = "FAILED";

    output.innerHTML = "";

    const errorPanel = createElement("section", "observation-panel");

    errorPanel.appendChild(createElement("h3", "", "SCAN ERROR"));

    errorPanel.appendChild(
      createElement("p", "observation-text", error.message),
    );

    output.appendChild(errorPanel);
  } finally {
    button.disabled = false;
    button.textContent = "INITIATE SCAN";
  }
}

/* ==========================================
   PHANTOM DARK / LIGHT THEME
========================================== */

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

function applyTheme(theme) {
  document.body.classList.toggle("light-theme", theme === "light");

  if (themeIcon) {
    themeIcon.textContent = theme === "light" ? "☾" : "☀";
  }

  if (themeLabel) {
    themeLabel.textContent = theme === "light" ? "DARK MODE" : "LIGHT MODE";
  }

  localStorage.setItem("phantom-theme", theme);
}

const savedTheme = localStorage.getItem("phantom-theme") || "dark";
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-theme");
    applyTheme(isLight ? "dark" : "light");
  });
}
