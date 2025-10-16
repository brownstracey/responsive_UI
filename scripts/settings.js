const $ = id => document.getElementById(id);
const LS_SETTINGS = "appSettings";
const LS_RECORDS = "recordsData";

// --- Load Saved Settings ---
function loadSettings() {
  const s = JSON.parse(localStorage.getItem(LS_SETTINGS) || "{}");
  $("theme").value = s.theme || detectSystemTheme();
  applyTheme(s.theme || detectSystemTheme());
}

// --- Save Settings ---
function saveSettings(e) {
  e.preventDefault();
  const s = { theme: $("theme").value };
  localStorage.setItem(LS_SETTINGS, JSON.stringify(s));
  applyTheme(s.theme);
  announce("Settings saved!");
}

// --- Reset ---
function resetSettings() {
  if (!confirm("Reset to default settings?")) return;
  localStorage.removeItem(LS_SETTINGS);
  $("settingsForm").reset();
  applyTheme("light");
  announce("Settings reset.");
}

// --- Data ---
function clearRecords() {
  if (!confirm("Clear all saved records?")) return;
  localStorage.removeItem(LS_RECORDS);
  announce("All records cleared!");
}

// --- Account Actions ---
function editProfile() {
  alert("Edit Profile page coming soon!");
}
function logout() {
  if (confirm("Log out now?")) {
    alert("You’ve been logged out.");
    // window.location.href = "login.html";
  }
}
function deleteAccount() {
  if (confirm("Delete your account permanently? This cannot be undone.")) {
    localStorage.clear();
    alert("Account deleted. Returning to sign-up.");
    // window.location.href = "signup.html";
  }
}
function help() {
  alert("Help & FAQ coming soon!");
}
function privacy() {
  alert("Privacy Policy page coming soon!");
}

// --- Theme ---
function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
}
function detectSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// --- Status Announcer ---
function announce(msg) {
  let el = $("status");
  if (!el) {
    el = document.createElement("div");
    el.id = "status";
    el.setAttribute("role", "status");
    el.style.marginTop = "12px";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  setTimeout(() => el.textContent = "", 2500);
}

// --- Event Listeners ---
$("settingsForm").onsubmit = saveSettings;
$("resetBtn").onclick = resetSettings;
$("clearRecordsBtn").onclick = clearRecords;

$("editProfileBtn").onclick = editProfile;
$("logoutBtn").onclick = logout;
$("deleteAccountBtn").onclick = deleteAccount;
$("helpBtn").onclick = help;
$("privacyBtn").onclick = privacy;
$("theme").onchange = e => applyTheme(e.target.value);

// --- Init ---
loadSettings();
render();