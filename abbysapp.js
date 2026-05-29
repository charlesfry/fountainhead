// Sync employee ID field from header
const empId = document.getElementById("header-emp-id").textContent;
document.getElementById("emp-id").value = empId;

// Set default dates to today
const today = new Date().toISOString().split("T")[0];
document.getElementById("date-start").value = today;
document.getElementById("date-end").value = today;

// ── Leave types: single source of truth ──
// Each entry: [label, button text]
const LEAVE_TYPES = [
  ["Going a-Trenting",                                                                             "Submit. Answer is No."],
  ["Dying (of AIDS or Whatever)",                                                                  "Submit. Still No"],
  ["I Just Sat Down",                                                                              "Submit. Get Up"],
  ["Trent and/or Ollie is Here",                                                                   "Submit. Ignore Them"],
  ["Need More Milk",                                                                               "Submit. Drink Water"],
  ["Soren Ate a Battery",                                                                          "Submit. Technically that Counts as 5-Hour Energy"],
  ["Ollie Ate a Battery",                                                                          "Submit. Dammit, Ollie"],
  ["Getting Drunk at Bowser's with my Aunt",                                                       "Submit. Get me a Long-Island Iced Tea"],
  ["Explosive Diarrhea",                                                                           "Submit. Please Don't"],
  ["Piercing Someone's Weiner Today",                                                              "Submit. Don't Miss"],
  ["Drawing a Mushroom",                                                                           "Submit. Is it a tracing?"],
  ["I've Committed Some Light Treason",                                                            "Submit. Legal fees not included"],
  ["Go Fuck Yourself, John (insert giggle here)",                                                  "Submit. Tell him he's not your real dad."],
  ["I Made Plans to be Somewhere in, Like, 3 Weeks and I Feel Overwhelmed by the Responsibility",  "Submit. Absolutely no sympathy"],
  ["I Turned Myself into a Pickle",                                                                "That's the Funniest Shit I've Ever Seen"],
  ["I'm on my period. Ha Ha Joke About Girl Parts This Site's Developer is so Clever",             "Submit. Ensure That You Make it Literally Everyone Else's Problem."],
  ["I'm waiting for the Epstein Files",                                                            "Submit. It's Not Happening"],
  ["In the Middle of a Highlander-Type Situation with all the other Abbys",                        "Submit. Beware Pirates"],
  ["Mothman Threatened to Leak our Chat History",                                                  "Submit. Zoomer Sexuality is a Horrifying Thing."],
  ["Fistfight with Gage (Currently Winning)",                                                      "Submit. Do It You Won't No Balls"],
  ["Drinking Competition with Tyler (Everyone's Winning)",                                         "Submit. When Everyone Gets Drunk, Everyone Wins"],
  ["Angel consumed Tylenol when she was pregnant. Like, a lot of it",                              "Submit. Stay away from Sonic the Hedgehog"],
  ["Other (probably stupid reason)",                                                               "Submit. Did All the Other Reasons Really Not Apply?"],
];

const leaveTypeSelect = document.getElementById("leave-type");
const submitBtn = document.getElementById("submit-btn");

// Populate the select from LEAVE_TYPES
LEAVE_TYPES.forEach(([label]) => {
  const opt = document.createElement("option");
  opt.value = label;
  opt.textContent = label;
  leaveTypeSelect.appendChild(opt);
});

const buttonLabelMap = Object.fromEntries(LEAVE_TYPES);

leaveTypeSelect.addEventListener("change", () => {
  const val = leaveTypeSelect.value;
  submitBtn.disabled = val === "";
  submitBtn.textContent = buttonLabelMap[val] || "Submit Request";
});

// ── Reason/Notes character countdown ──
const reasonField = document.getElementById("reason");
const charCounter = document.getElementById("char-counter");
const CHAR_LIMIT = 500;

reasonField.addEventListener("input", () => {
  const remaining = CHAR_LIMIT - reasonField.value.length;
  charCounter.textContent = remaining >= 0
    ? `${remaining} characters remaining`
    : "";

  if (remaining <= 0) {
    reasonField.value = "We stopped reading at 500 characters. Denied.";
    reasonField.readOnly = true;
    charCounter.textContent = "We've heard enough.";
    charCounter.classList.add("counter-maxed");
  }
});

// Reset readonly if user clears the field externally (edge case)
reasonField.addEventListener("focus", () => {
  if (reasonField.value === "We stopped reading at 500 characters. Denied.") {
    reasonField.readOnly = false;
    reasonField.value = "";
    charCounter.textContent = `${CHAR_LIMIT} characters remaining`;
    charCounter.classList.remove("counter-maxed");
  }
});

// ── Spinner setup ──
const SPINNER_MSGS = [
  "Consulting the oracle…",
  "Pretending to care…",
  "Forwarding to /dev/null…",
  "Asking someone more important…",
  "Generating plausible excuses…",
  "Checking if anyone is watching…",
  "Performing mandatory eye-roll…",
  "Escalating to someone who also won't help…",
  "Searching for a reason to say no…",
  "Filing this under 'Not My Problem'…",
];

function withSpinner(fn) {
  const overlay = document.getElementById("spinner-overlay");
  const msg = document.getElementById("spinner-msg");
  msg.textContent = SPINNER_MSGS[Math.floor(Math.random() * SPINNER_MSGS.length)];
  overlay.classList.remove("hidden");
  setTimeout(() => {
    overlay.classList.add("hidden");
    fn();
  }, 1400 + Math.random() * 800);
}

// ── Error cycling ──
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
  const type     = leaveTypeSelect.value || "—";
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
  withSpinner(() => {
    ERRORS[errorIndex % ERRORS.length]();
    errorIndex++;
  });
});

// Footer links
document.getElementById("footer-help").addEventListener("click", function (e) {
  e.preventDefault();
  withSpinner(show404);
});
document.getElementById("footer-contact").addEventListener("click", function (e) {
  e.preventDefault();
  withSpinner(cannotProcess);
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
}

function businessDays() {
  showToast("Thank you for submitting your request. We will get back to you in 3–5 business days.");

  const delay = (Math.floor(Math.random() * 3) + 3) * 1000;
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
