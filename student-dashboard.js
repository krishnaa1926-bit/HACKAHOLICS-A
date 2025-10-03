// -------------------------
// Student Dashboard Script
// -------------------------

// ✅ Session Keys we care about
const SESSION_KEYS = [
    "studentLoggedIn",
    "hackaholics_student_session",
    "studentData",
    "hackaholics_profile",
    "quizAnswers"
];

// ✅ Helper: check if logged in
function hasActiveSession() {
    const loggedIn = localStorage.getItem("studentLoggedIn");
    const session = localStorage.getItem("hackaholics_student_session");

    return (loggedIn === "true" || (session && session.trim() !== ""));
}

// ✅ If not logged in → redirect
document.addEventListener("DOMContentLoaded", () => {
    console.log("[Dashboard] Checking session...");

    if (!hasActiveSession()) {
        console.warn("[Dashboard] No active session, redirecting...");
        window.location.replace("student-login.html");
        return;
    }

    console.log("[Dashboard] Session found, loading dashboard...");
    setupLogoutFunctionality();
    loadStudentProfile();
    loadSavedQuizAnswers();
});

// ✅ Logout functionality
function setupLogoutFunctionality() {
    const logoutBtn = document.getElementById("studentLogout");
    if (!logoutBtn) {
        console.error("[Dashboard] Logout button not found!");
        return;
    }

    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (!confirm("Are you sure you want to logout?")) return;

        console.log("[Dashboard] Logging out...");

        // Clear all session keys
        SESSION_KEYS.forEach((k) => localStorage.removeItem(k));

        // Redirect
        window.location.replace("student-login.html");
    });
}

// ✅ Load student profile from storage
function loadStudentProfile() {
    const studentData = localStorage.getItem("studentData");

    if (studentData) {
        try {
            const student = JSON.parse(studentData);
            document.getElementById("studentName").textContent =
                student.name || "Student";
            document.getElementById("studentEmail").textContent =
                student.email || "";
            console.log("[Dashboard] Student profile loaded.");
        } catch (err) {
            console.error("[Dashboard] Failed to parse studentData:", err);
        }
    } else {
        console.warn("[Dashboard] No studentData found in localStorage.");
    }
}

// ✅ Load saved quiz answers (if any)
function loadSavedQuizAnswers() {
    const quizAnswers = localStorage.getItem("quizAnswers");

    if (quizAnswers) {
        try {
            const answers = JSON.parse(quizAnswers);
            console.log("[Dashboard] Quiz answers loaded:", answers);
            // TODO: Render answers in dashboard if needed
        } catch (err) {
            console.error("[Dashboard] Failed to parse quizAnswers:", err);
        }
    }
}
