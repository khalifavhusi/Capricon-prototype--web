/* Capricorn Registration Portal - shared application state */
const STORAGE_KEY = "capricornPortalState";
const COURSE_DATA = {
  "Information Technology": { math: "Mathematics", subjects: ["Computer Programming", "Web Development", "Database Systems", "Mathematics", "Communication", "Information Systems"] },
  "Computer Science": { math: "Mathematics", subjects: ["Programming", "Data Structures", "Algorithms", "Mathematics", "Database Systems", "Computer Systems"] },
  "Mechanical Engineering": { math: "Mathematics", subjects: ["Engineering Mathematics", "Engineering Science", "Mechanical Drawing", "Fitting and Machining", "Industrial Electronics", "Communication"] },
  "Office Administration": { math: "Mathematical Literacy", subjects: ["Business Practice", "Office Data Processing", "Mathematical Literacy", "Communication", "Information Processing", "Administrative Practice"] },
  "Business Management": { math: "Mathematical Literacy", subjects: ["Business Management", "Marketing", "Financial Management", "Mathematical Literacy", "Communication", "Entrepreneurship"] }
};

function blankState() {
  return {
    account: { idType: "South African ID", studentNumber: "", password: "" },
    draft: {},
    student: null,
    loggedIn: false
  };
}

function getState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return saved ? { ...blankState(), ...saved, account: { ...blankState().account, ...(saved.account || {}) }, draft: saved.draft || {}, student: saved.student || null } : blankState();
  } catch (_) { return blankState(); }
}

function saveState(state) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function getStudent() { return getState().student || { ...(getState().draft || {}) }; }
function saveStudent(data) { const state = getState(); state.student = { ...(state.student || {}), ...data }; saveState(state); }
function getDraft() { return getState().draft || {}; }
function saveDraft(data) { const state = getState(); state.draft = { ...state.draft, ...data }; saveState(state); }
function clearPortal() { localStorage.removeItem(STORAGE_KEY); }
function courseSubjects(c) { return COURSE_DATA[c]?.subjects || []; }

function isAuthenticated() { const s = getState(); return !!(s.loggedIn && s.student); }
function protectPage() {
  const page = location.pathname.split("/").pop().toLowerCase();
  const protectedPages = ["dashboard.html", "profile.html", "currentapplication.html", "results.html"];
  if (protectedPages.includes(page) && !isAuthenticated()) {
    location.replace("index.html");
    return false;
  }
  return true;
}

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0]).join("").toUpperCase() || "?";
}

function setText(selector, value, fallback = "Not supplied") {
  document.querySelectorAll(selector).forEach(e => e.textContent = value || fallback);
}

function initGlobal() {
  if (!protectPage()) return;
  const state = getState();
  const s = state.student || state.draft || {};
  const logged = isAuthenticated();
  const fullName = `${s.name || ""} ${s.surname || ""}`.trim();

  setText("[data-student-name]", logged && fullName ? fullName : "No Profile Available", "No Profile Available");
  setText("[data-student-number]", logged ? s.studentNumber : "", "Not available");
  setText("[data-course]", logged ? s.course : "", "Not selected");
  setText("[data-mode]", logged ? s.mode : "", "Not selected");
  setText("[data-level]", logged ? s.level : "", "Not selected");
  setText("[data-qualification]", logged ? s.qualification : "", "Not selected");
  setText("[data-application]", logged ? s.applicationNumber : "", "Not generated");

  document.querySelectorAll("[data-student-photo]").forEach(img => {
    img.src = logged && s.photo ? s.photo : "../IMAGES/logo.png";
    img.alt = logged ? `${fullName || "Student"} profile photo` : "No profile available";
  });

  updateDrawer(logged, s, fullName);
  setupDrawer();
}

function updateDrawer(logged, s, fullName) {
  const top = document.querySelector(".drawer-top");
  if (!top) return;
  const name = top.querySelector(".drawer-name");
  const logout = top.querySelector(".logout");
  const img = top.querySelector("[data-student-photo]");
  if (name) name.textContent = logged ? (fullName || "Student") : "No Profile Available";
  if (img) img.src = logged && s.photo ? s.photo : "../IMAGES/logo.png";
  if (logout) {
    logout.textContent = logged ? "LOGOUT" : "LOGIN";
    logout.href = logged ? "index.html" : "index.html";
    logout.onclick = (e) => {
      if (logged) {
        e.preventDefault();
        const state = getState(); state.loggedIn = false; saveState(state); location.href = "index.html";
      }
    };
  }
  document.querySelectorAll(".drawer-link").forEach(link => {
    if (!logged && !["faq.html", "index.html"].includes((link.getAttribute("href") || "").split("#")[0])) {
      link.addEventListener("click", e => { e.preventDefault(); location.href = "index.html"; });
      link.classList.add("drawer-disabled");
    }
  });
}

function setupDrawer() {
  const d = document.getElementById("sideDrawer"), o = document.getElementById("drawerOverlay");
  if (!d) return;
  const close = () => { d.classList.remove("open"); if (o) o.classList.remove("open"); document.body.style.overflow = ""; };
  document.querySelectorAll("[data-open-drawer]").forEach(b => b.onclick = () => { d.classList.add("open"); if (o) o.classList.add("open"); document.body.style.overflow = "hidden"; });
  document.querySelectorAll("[data-close-drawer]").forEach(b => b.onclick = close);
  if (o) o.onclick = close;
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); }, { once: true });
}

function updateCourseSubjects(c, id, selected = []) {
  const box = document.getElementById(id); if (!box) return;
  const chosen = new Set(selected);
  box.innerHTML = courseSubjects(c).map(s => `<label class="subject"><input type="checkbox" value="${escapeHtml(s)}" ${chosen.has(s) ? "checked" : ""}>${escapeHtml(s)}</label>`).join("");
}

function escapeHtml(v) { return String(v).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c])); }
function makeApplicationNumber() { return `APP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`; }


const EDIT_WINDOW_MS = 48 * 60 * 60 * 1000;
const SA_LANGUAGES = ["English","Afrikaans","isiNdebele","isiXhosa","isiZulu","Sepedi","Sesotho","Setswana","siSwati","Tshivenda","itsonga","South African Sign Language"];
const SA_PROVINCES = ["Limpopo","Gauteng","Mpumalanga","North West","KwaZulu-Natal","Eastern Cape","Western Cape","Free State","Northern Cape"];
const DISABILITY_TYPES = ["Physical Disability","Visual Impairment","Hearing Impairment","Intellectual Disability","Learning Disability","Psychosocial Disability","Speech / Communication Disability","Multiple Disabilities","Other"];
const SA_BANKS = ["Absa Bank", "African Bank", "Albaraka Bank", "Access Bank South Africa", "Bank Zero", "Bidvest Bank", "Capitec Bank", "Discovery Bank", "First National Bank (FNB)", "Grindrod Bank", "Habib Overseas Bank", "Investec Bank", "Ithala Development Finance Corporation", "Nedbank", "Sasfin Bank", "Standard Bank", "TymeBank", "Ubank", "Other / Not Listed"];

function getEditDeadline(student = getStudent()) {
  const t = student && student.registeredAt ? new Date(student.registeredAt).getTime() : NaN;
  return Number.isFinite(t) ? t + EDIT_WINDOW_MS : null;
}
function isEditWindowOpen(student = getStudent()) {
  const deadline = getEditDeadline(student);
  return !!deadline && Date.now() < deadline;
}
function editTimeRemaining(student = getStudent()) {
  const deadline = getEditDeadline(student);
  return deadline ? Math.max(0, deadline - Date.now()) : 0;
}
function formatCountdown(ms) {
  if (!ms) return "Editing closed";
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400), h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60), s = total % 60;
  return `${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
}
function startEditCountdown(selector = "[data-edit-countdown]") {
  const update = () => {
    const s = getStudent();
    document.querySelectorAll(selector).forEach(el => {
      el.textContent = isEditWindowOpen(s) ? formatCountdown(editTimeRemaining(s)) : "Editing closed";
      el.classList.toggle("countdown-expired", !isEditWindowOpen(s));
    });
    document.querySelectorAll("[data-edit-only]").forEach(el => {
      const enabled = isEditWindowOpen(s);
      el.disabled = !enabled;
      el.classList.toggle("disabled", !enabled);
      if (el.tagName === "A" && !enabled) el.setAttribute("aria-disabled","true");
    });
  };
  update();
  return setInterval(update, 1000);
}
function requireEditWindow() {
  if (!isAuthenticated()) { location.href = "index.html"; return false; }
  if (!isEditWindowOpen()) { alert("The 48-hour information editing window has closed."); return false; }
  return true;
}
function saveEditedStudent(data) {
  if (!requireEditWindow()) return false;
  const state = getState();
  state.student = { ...(state.student || {}), ...data };
  state.draft = { ...(state.draft || {}), ...data };
  saveState(state);
  return true;
}
window.SA_LANGUAGES = SA_LANGUAGES;
window.SA_PROVINCES = SA_PROVINCES;
window.DISABILITY_TYPES = DISABILITY_TYPES;
window.SA_BANKS = SA_BANKS;
window.getEditDeadline = getEditDeadline;
window.isEditWindowOpen = isEditWindowOpen;
window.editTimeRemaining = editTimeRemaining;
window.formatCountdown = formatCountdown;
window.startEditCountdown = startEditCountdown;
window.requireEditWindow = requireEditWindow;
window.saveEditedStudent = saveEditedStudent;

window.COURSE_DATA = COURSE_DATA;
window.getState = getState; window.saveState = saveState; window.getStudent = getStudent; window.saveStudent = saveStudent;
window.getDraft = getDraft; window.saveDraft = saveDraft; window.clearPortal = clearPortal; window.courseSubjects = courseSubjects;
window.updateCourseSubjects = updateCourseSubjects; window.makeApplicationNumber = makeApplicationNumber; window.isAuthenticated = isAuthenticated;

document.addEventListener("DOMContentLoaded", initGlobal);
