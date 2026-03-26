const state = {
  user: {
    name: "Nishant",
    role: "student",
  },
  lectures: {
    1: {
      title: "Lecture 1: Foundations",
      transcript: [
        { time: "03:12", text: "Machine learning begins with a model and a measurable objective.", status: "valid" },
        { time: "05:40", text: "We compare predictions against labels to compute loss.", status: "valid" },
        { time: "08:03", text: "Every model is supervised.", status: "warning" },
      ],
    },
    2: {
      title: "Lecture 2: Gradient Descent",
      transcript: [
        { time: "12:01", text: "Gradient descent minimizes loss.", status: "valid" },
        { time: "12:05", text: "It always finds global minimum.", status: "warning" },
        { time: "12:09", text: "It is used in neural networks.", status: "valid" },
      ],
    },
    3: {
      title: "Lecture 3: Learning Rate",
      transcript: [
        { time: "08:14", text: "Learning rate controls step size during optimization.", status: "valid" },
        { time: "10:02", text: "A high learning rate can overshoot the minimum.", status: "valid" },
        { time: "12:18", text: "Lower is always better.", status: "warning" },
      ],
    },
  },
};

const loginScreen = document.getElementById("login-screen");
const workspace = document.getElementById("workspace");
const loginForm = document.getElementById("login-form");
const profileName = document.getElementById("profile-name");
const profileRole = document.getElementById("profile-role");
const profileAvatar = document.getElementById("profile-avatar");
const lectureTitle = document.getElementById("lecture-title");
const transcriptList = document.getElementById("transcript-list");
const adminNav = document.querySelector(".admin-only");

function setActivePage(page) {
  document.querySelectorAll(".page").forEach((section) => {
    section.classList.toggle("active", section.id === `page-${page}`);
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.nav === page);
  });
}

function renderProfile() {
  profileName.textContent = state.user.name;
  profileRole.textContent = state.user.role === "admin" ? "Admin / Faculty" : "Student";
  profileAvatar.textContent = state.user.name.charAt(0).toUpperCase();
  adminNav.classList.toggle("hidden", state.user.role !== "admin");
}

function renderTranscript(lectureId) {
  const lecture = state.lectures[lectureId];
  lectureTitle.textContent = lecture.title;
  transcriptList.innerHTML = "";

  lecture.transcript.forEach((line) => {
    const row = document.createElement("div");
    row.className = `transcript-line ${line.status === "warning" ? "is-warning" : "is-valid"}`;
    row.innerHTML = `
      <time>[${line.time}]</time>
      <span>${line.text}</span>
      <button type="button">${line.status === "warning" ? "⚠️" : "✅"}</button>
    `;
    transcriptList.appendChild(row);
  });
}

function openLecture(lectureId) {
  renderTranscript(lectureId);
  setActivePage("lecture");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value;
  const fallbackName = email.split("@")[0] || "Learner";

  state.user = {
    name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
    role,
  };

  renderProfile();
  loginScreen.classList.add("hidden");
  workspace.classList.remove("hidden");
  setActivePage("dashboard");
  renderTranscript(2);
});

document.querySelectorAll("[data-nav]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.nav;
    if (target === "admin" && state.user.role !== "admin") {
      return;
    }
    setActivePage(target);
  });
});

document.querySelectorAll("[data-open-lecture]").forEach((button) => {
  button.addEventListener("click", () => {
    openLecture(button.dataset.openLecture);
  });
});

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;
    document.querySelectorAll(".tab-button").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll(".tab-content").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `tab-${target}`);
    });
  });
});

document.getElementById("submit-quiz").addEventListener("click", () => {
  document.getElementById("quiz-feedback").classList.remove("hidden");
});

document.getElementById("profile-button").addEventListener("click", () => {
  loginScreen.classList.remove("hidden");
  workspace.classList.add("hidden");
});

renderTranscript(2);
