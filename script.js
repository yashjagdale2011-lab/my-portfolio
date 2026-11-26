document.documentElement.classList.add("js");

/* ---------- Mobile menu ---------- */
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

function setMenu(open) {
  siteNav.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "Close" : "Menu";
}

navToggle.addEventListener("click", () => {
  setMenu(!siteNav.classList.contains("open"));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav.classList.contains("open")) {
    setMenu(false);
    navToggle.focus();
  }
});

/* ---------- Query console ----------
   Edit the data below to update the tables in the hero section. */
const tables = {
  profile: {
    sql: "SELECT * FROM profile;",
    columns: ["field", "value"],
    rows: [
      ["name", "Yash Nitin Jagdale"],
      ["location", "Pune, Maharashtra"],
      ["status", "Fresher"],
      ["studying", "M.Sc. Computer Science"]
    ]
  },
  skills: {
    sql: "SELECT category, names FROM skills;",
    columns: ["category", "names"],
    rows: [
      ["Programming", "Python, JavaScript, PHP"],
      ["Web", "HTML5, CSS3, jQuery"],
      ["Databases", "PostgreSQL, MySQL, MongoDB"],
      ["Concepts", "DBMS, Data Structures and Algorithms, Software Engineering"]
    ]
  },
  education: {
    sql: "SELECT degree, college, year\nFROM education ORDER BY year DESC;",
    columns: ["degree", "college", "year"],
    rows: [
      ["M.Sc. Computer Science", "MIT ACSC, Alandi, Pune", "2028 (expected)"],
      ["Bachelor's Degree", "RJSPM ACS College, Landewadi, Pune", "2026"]
    ]
  },
  project: {
    sql: "SELECT * FROM project\nWHERE name = 'E-Commerce Website';",
    columns: ["field", "value"],
    rows: [
      ["type", "Academic project"],
      ["features", "Registration, login, shopping cart"],
      ["frontend", "HTML, CSS, JavaScript"],
      ["backend", "PHP"],
      ["database", "PostgreSQL"]
    ]
  }
};

const sqlBox = document.getElementById("sql");
const resultBox = document.getElementById("result");
const queryButtons = document.querySelectorAll("[data-query]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let typingTimer;

function makeCell(tag, text) {
  const cell = document.createElement(tag);
  cell.textContent = text;
  if (tag === "th") cell.scope = "col";
  return cell;
}

function showResult({ columns, rows }) {
  const table = document.createElement("table");
  const headRow = table.createTHead().insertRow();
  columns.forEach((name) => headRow.appendChild(makeCell("th", name)));

  const body = table.createTBody();
  rows.forEach((values, index) => {
    const row = body.insertRow();
    row.className = "enter";
    row.style.animationDelay = `${index * 70}ms`;
    values.forEach((value) => row.appendChild(makeCell("td", value)));
  });

  const count = document.createElement("p");
  count.className = "row-count";
  count.textContent = `${rows.length} rows`;

  resultBox.replaceChildren(table, count);
}

function runQuery(name) {
  const query = tables[name];
  clearTimeout(typingTimer);

  queryButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.query === name));
  });

  if (reducedMotion.matches) {
    sqlBox.textContent = query.sql;
    showResult(query);
    return;
  }

  resultBox.replaceChildren();
  let length = 0;

  (function type() {
    length += 1;
    sqlBox.textContent = query.sql.slice(0, length);
    if (length < query.sql.length) {
      typingTimer = setTimeout(type, 16);
    } else {
      showResult(query);
    }
  })();
}

queryButtons.forEach((button) => {
  button.addEventListener("click", () => runQuery(button.dataset.query));
});

runQuery("profile");

/* ---------- Highlight the current section in the menu ---------- */
const navLinks = [...siteNav.querySelectorAll("a")];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href")));
let scrollQueued = false;

function markCurrentSection() {
  const marker = window.innerHeight * 0.35;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  let current = -1;

  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= marker) current = index;
  });
  if (atBottom) current = sections.length - 1;

  navLinks.forEach((link, index) => {
    if (index === current) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
  scrollQueued = false;
}

window.addEventListener("scroll", () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(markCurrentSection);
  }
}, { passive: true });

markCurrentSection();

/* ---------- Copy email ---------- */
const copyButton = document.getElementById("copy-email");
const copyStatus = document.getElementById("copy-status");
const email = "yashjagdale011@gmail.com";

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = "Email copied.";
  } catch {
    copyStatus.textContent = "Could not copy. Select the email address above and copy it.";
  }
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
