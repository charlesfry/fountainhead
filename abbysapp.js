// Set default dates to today
const today = new Date().toISOString().split("T")[0];
document.getElementById("date-start").value = today;
document.getElementById("date-end").value = today;

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

document.getElementById("pto-form").addEventListener("submit", function (e) {
  e.preventDefault();
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
