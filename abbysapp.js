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
  ["Going a-Trenting",                                                                                         "Submit. Bad Excuse."],
  ["Dying (of AIDS or Whatever)",                                                                              "Submit. I Think Chicken Soup Fixes That."],
  ["I Just Sat Down",                                                                                          "Submit. Get Up."],
  ["Trent and/or Ollie is Here",                                                                               "Submit. Ignore Them."],
  ["Need More Milk",                                                                                           "Submit. Drink Water."],
  ["Soren Ate a Battery",                                                                                      "Submit. Technically that Counts as 5-Hour Energy."],
  ["Ollie Ate a Battery",                                                                                      "Submit. Dammit, Ollie."],
  ["Getting Drunk at Bowser's with my Aunt",                                                                   "Submit. Get me a Long-Island Iced Tea."],
  ["Explosive Diarrhea",                                                                                       "Submit. Please Don't."],
  ["Piercing Someone's Weiner Today",                                                                          "Submit. Don't Miss."],
  ["Drawing a Mushroom",                                                                                       "Submit. Is it a tracing?"],
  ["I've Committed Some Light Treason",                                                                        "Submit. Legal fees not included."],
  ["Go Fuck Yourself, John (insert giggle here)",                                                              "Submit. Tell him he's not your real dad."],
  ["I Made Plans to be Somewhere in, Like, 3 Weeks and I Feel Overwhelmed by the Responsibility",              "Submit. Absolutely no sympathy."],
  ["I Turned Myself into a Pickle",                                                                            "That's the Funniest Shit I've Ever Seen."],
  ["I'm on my period. Ha Ha Joke About Girl Parts This Site's Developer is so Clever",                         "Submit. Ensure That You Make it Literally Everyone Else's Problem."],
  ["I'm waiting for the Epstein Files",                                                                        "Submit. It's Not Happening."],
  ["In the Middle of a Highlander-Type Situation with all the other Abbys",                                    "Submit. Beware Pirates."],
  ["Mothman Threatened to Leak our Chat History",                                                              "Submit. Zoomer Sexuality is a Horrifying Thing."],
  ["In a Fistfight with Gage (Currently Winning)",                                                             "Submit. Do It You Won't No Balls."],
  ["In a Drinking Competition with Tyler (Everyone's Winning)",                                                "Submit. When Everyone Gets Drunk, Everyone Wins."],
  ["I'm Afraid of Americans",                                                                                  "Submit. I'm Afraid of the World."],
  ["Angel consumed Tylenol when she was pregnant. A lot of Tylenol. Like, an Unreasonable Amount of Tylenol.", "Submit. Stay away from Sonic the Hedgehog."],
  ["Other (probably stupid reason)",                                                                           "Submit. Did All the Other Reasons Really Not Apply?"],
];

const submitBtn   = document.getElementById("submit-btn");
const agreeBox    = document.getElementById("agree");
const buttonLabelMap = Object.fromEntries(LEAVE_TYPES);

let selectedLeaveType = "";

function updateSubmitState() {
  submitBtn.disabled = !(selectedLeaveType && agreeBox.checked);
}

agreeBox.addEventListener("change", () => {
  if (agreeBox.checked) document.getElementById("agree-badge").style.visibility = "hidden";
  updateSubmitState();
});

// ── Custom select ──
const csWrapper  = document.getElementById("leave-type-wrapper");
const csDisplay  = document.getElementById("leave-type-display");
const csList     = document.getElementById("leave-type-options");
let csFocusedIdx = -1;

LEAVE_TYPES.forEach(([label], i) => {
  const li = document.createElement("li");
  li.textContent = label;
  li.setAttribute("role", "option");
  li.addEventListener("mousedown", (e) => {
    e.preventDefault(); // keep focus on wrapper
    csSelect(label, i);
    csClose();
  });
  csList.appendChild(li);
});

function csOpen() {
  csWrapper.setAttribute("aria-expanded", "true");
  csWrapper.classList.add("open");
  if (csFocusedIdx >= 0) csList.children[csFocusedIdx].scrollIntoView({ block: "nearest" });
}
function csClose() {
  csWrapper.setAttribute("aria-expanded", "false");
  csWrapper.classList.remove("open");
}
function csFocus(idx) {
  Array.from(csList.children).forEach(li => li.classList.remove("focused"));
  csFocusedIdx = idx;
  if (idx >= 0 && idx < csList.children.length) {
    csList.children[idx].classList.add("focused");
    csList.children[idx].scrollIntoView({ block: "nearest" });
  }
}
function csSelect(label, idx) {
  selectedLeaveType = label;
  csDisplay.textContent = label;
  csDisplay.classList.remove("placeholder");
  document.querySelector("#leave-type-wrapper").closest(".form-group").querySelector(".required-badge").style.display = "none";
  Array.from(csList.children).forEach(li => li.classList.remove("selected"));
  csList.children[idx].classList.add("selected");
  csFocusedIdx = idx;
  submitBtn.textContent = buttonLabelMap[label] || "Submit Request";
  updateSubmitState();
}

csWrapper.addEventListener("click", () => {
  csWrapper.classList.contains("open") ? csClose() : csOpen();
});
csWrapper.addEventListener("blur", csClose);
csWrapper.addEventListener("keydown", (e) => {
  const isOpen = csWrapper.classList.contains("open");
  const count  = csList.children.length;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (!isOpen) csOpen();
    csFocus(Math.min(csFocusedIdx + 1, count - 1));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!isOpen) csOpen();
    csFocus(Math.max(csFocusedIdx - 1, 0));
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (!isOpen) { csOpen(); }
    else if (csFocusedIdx >= 0) { csSelect(LEAVE_TYPES[csFocusedIdx][0], csFocusedIdx); csClose(); }
  } else if (e.key === "Escape") {
    csClose();
  }
});

// ── Reason/Notes character countdown ──
const reasonField = document.getElementById("reason");
const charCounter = document.getElementById("char-counter");
const CHAR_LIMIT = 500;

const tldrMsg = "Too long; didn't read. Denied.";

reasonField.addEventListener("input", () => {
  const remaining = CHAR_LIMIT - reasonField.value.length;
  charCounter.textContent = remaining >= 0
    ? `${remaining} characters remaining`
    : "";

  if (remaining <= 490) {
    reasonField.value = tldrMsg;
    reasonField.readOnly = true;
    charCounter.textContent = "We've heard enough.";
    charCounter.classList.add("counter-maxed");
  }
});

// Reset readonly if user clears the field externally (edge case)
reasonField.addEventListener("focus", () => {
  if (reasonField.value === tldrMsg) {
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
  const type     = selectedLeaveType || "—";
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
  withSpinner(() => {
    addToHistory();
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
