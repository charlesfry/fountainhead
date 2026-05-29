// Sync employee ID field from header
const empId = document.getElementById("header-emp-id").textContent;
document.getElementById("emp-id").value = empId;

// Set default dates to today
const today = new Date().toISOString().split("T")[0];
document.getElementById("date-start").value = today;
document.getElementById("date-end").value = today;

// Enable submit only when a Leave Type is selected
const leaveTypeSelect = document.getElementById("leave-type");
const submitBtn = document.getElementById("submit-btn");
leaveTypeSelect.addEventListener("change", () => {
  submitBtn.disabled = leaveTypeSelect.value === "";
});

// Cycle through error responses on each submit
const ERRORS = [
  cannotProcess,
  showBSOD,
  showMaintenance,
  show404,
  confirmationEmail,
  businessDays,
];

let errorIndex = 0;

const DENIAL_LABELS = [
  "Denied",
  "Rejected",
  "Absolutely Not",
  "Fuck Off",
  "Nice Try",
  "LOL No",
  "Dream On",
  "Not a Chance",
  "Hard Pass",
];

const requestHistory = [];

function formatDate(isoStr) {
  if (!isoStr) return "—";
  const [y, m, d] = isoStr.split("-");
  return `${m}/${d}/${y}`;
}

function randomDenialLabel() {
  return DENIAL_LABELS[Math.floor(Math.random() * DENIAL_LABELS.length)];
}

function addToHistory() {
  const startVal = document.getElementById("date-start").value;
  const endVal   = document.getElementById("date-end").value;
  const type     = document.getElementById("leave-type").value || "—";
  const now      = new Date();
  const submitted = `${String(now.getMonth()+1).padStart(2,"0")}/${String(now.getDate()).padStart(2,"0")}/${now.getFullYear()}`;

  requestHistory.unshift({
    submitted,
    dates: `${formatDate(startVal)} – ${formatDate(endVal)}`,
    type,
    label: randomDenialLabel(),
  });

  if (requestHistory.length > 3) requestHistory.length = 3;
  renderHistory();
}

function renderHistory() {
  const tbody = document.getElementById("history-body");
  const empty = document.getElementById("history-empty");

  // remove all rows except the empty placeholder
  Array.from(tbody.querySelectorAll("tr:not(#history-empty)")).forEach(r => r.remove());

  if (requestHistory.length === 0) {
    empty.style.display = "";
    return;
  }
  empty.style.display = "none";

  requestHistory.forEach(req => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${req.submitted}</td>
      <td>${req.dates}</td>
      <td>${req.type}</td>
      <td><span class="status denied">${req.label}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("pto-form").addEventListener("submit", function (e) {
  e.preventDefault();
  addToHistory();
  ERRORS[errorIndex % ERRORS.length]();
  errorIndex++;
});

// Footer links also trigger errors for fun
document.getElementById("footer-help").addEventListener("click", function (e) {
  e.preventDefault();
  show404();
});
document.getElementById("footer-contact").addEventListener("click", function (e) {
  e.preventDefault();
  cannotProcess();
});

/* ── Error handlers ── */

function cannotProcess() {
  showToast("We cannot process your request at this time. Please try again later.");
}

function showBSOD() {
  const bsod = document.getElementById("bsod");
  const pct = document.getElementById("bsod-pct");
  bsod.classList.remove("hidden");

  let n = 0;
  const interval = setInterval(() => {
    n += Math.floor(Math.random() * 7) + 1;
    if (n >= 100) { n = 100; clearInterval(interval); }
    pct.textContent = n;
  }, 120);

  document.getElementById("bsod-dismiss").onclick = () => {
    bsod.classList.add("hidden");
    pct.textContent = "0";
  };
}

function showMaintenance() {
  const el = document.getElementById("maintenance");
  el.classList.remove("hidden");
  document.getElementById("maintenance-dismiss").onclick = () => el.classList.add("hidden");
}

function show404() {
  const el = document.getElementById("error404");
  el.classList.remove("hidden");
  document.getElementById("error404-dismiss").onclick = () => el.classList.add("hidden");
}

function confirmationEmail() {
  showToast("Your request has been received. Please check your email for confirmation.");
  // (no email is sent)
}

function businessDays() {
  showToast("Thank you for submitting your request. We will get back to you in 3–5 business days.");

  // After a random delay between 3–5 "business days" (mapped to 8–14 seconds for demo),
  // show the denial popup. In production you'd use a real timer/notification.
  const delay = (Math.floor(Math.random() * 3) + 3) * 1000; // 3–5 seconds as a stand-in
  setTimeout(() => {
    const popup = document.getElementById("denial-popup");
    popup.classList.remove("hidden");
    document.getElementById("denial-dismiss").onclick = () => popup.classList.add("hidden");
  }, delay);
}

/* ── Toast helper ── */
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  toast.style.opacity = "1";

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.classList.add("hidden"), 400);
  }, 4000);
}
