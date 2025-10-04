// Student Login JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('studentLoginForm');
    const signupForm = document.getElementById('studentSignupForm');
    const loginMessage = document.getElementById('loginMessage');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');

    // ----- Tab Switching -----
    loginTab.addEventListener('click', () => switchTab('login'));
    signupTab.addEventListener('click', () => switchTab('signup'));

    function switchTab(tab) {
        if (tab === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
        clearMessage();
    }

    // ----- Auto-redirect if already logged in -----
    if (isStudentLoggedIn()) {
        window.location.href = 'student-dashboard.html';
        return;
    }

    // ----- Login Form Submit -----
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearMessage();

        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        const submitBtn = loginForm.querySelector('.btn-login');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Authenticating...';

        setTimeout(() => {
            if (authenticateStudent(email, password)) {
                setStudentSession(email);
                showMessage('success', 'Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'student-dashboard.html';
                }, 1500);
            } else {
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Dashboard';
                showMessage('error', 'Invalid email or password.');
            }
        }, 1000);
    });

    // ----- Signup Form Submit -----
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearMessage();

        const fullName = document.getElementById('signupFullName').value.trim();
        const email = document.getElementById('signupEmail').value.trim().toLowerCase();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (password !== confirmPassword) {
            showMessage('error', 'Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            showMessage('error', 'Password must be at least 6 characters long.');
            return;
        }

        const submitBtn = signupForm.querySelector('.btn-login');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Creating Account...';

        setTimeout(() => {
            if (registerStudent(fullName, email, password)) {
                setStudentSession(email);
                showMessage('success', 'Account created successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'student-dashboard.html';
                }, 1500);
            } else {
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
                showMessage('error', 'Email already exists. Please use a different email.');
            }
        }, 1000);
    });

    // ----- Utility Functions -----

    function authenticateStudent(email, password) {
        const users = getStudentUsers();
        return users.some(u => u.email === email && u.password === password);
    }

    function registerStudent(fullName, email, password) {
        const users = getStudentUsers();
        if (users.find(u => u.email === email)) return false;
        users.push({ fullName, email, password });
        localStorage.setItem('hackaholics_student_users', JSON.stringify(users));
        return true;
    }

    function getStudentUsers() {
        const users = localStorage.getItem('hackaholics_student_users');
        return users ? JSON.parse(users) : [];
    }

function setStudentSession(email) {
    const users = getStudentUsers();
    const user = users.find(u => u.email === email);

    const sessionData = {
        email: email,
        loginTime: new Date().toISOString(),
        isStudent: true
    };

    localStorage.setItem('hackaholics_student_session', JSON.stringify(sessionData));
    localStorage.setItem('studentLoggedIn', "true");
    if (user) localStorage.setItem('studentData', JSON.stringify(user));
    localStorage.setItem('hackaholics_role', 'student');
}

    function showMessage(type, message) {
        loginMessage.className = `login-message ${type}`;
        loginMessage.textContent = message;
        loginMessage.classList.remove('hidden');
        if (type === 'success') {
            setTimeout(() => loginMessage.classList.add('hidden'), 2000);
        }
    }

    function clearMessage() {
        loginMessage.classList.add('hidden');
    }
});

// ----- Check if student is logged in -----
function isStudentLoggedIn() {
    const session = localStorage.getItem('hackaholics_student_session');
    if (!session) return false;

    try {
        const sessionData = JSON.parse(session);
        const loginTime = new Date(sessionData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        if (hoursDiff > 24) {
            localStorage.removeItem('hackaholics_student_session');
            localStorage.removeItem('studentLoggedIn');
            localStorage.removeItem('studentData');
            return false;
        }
        return sessionData.isStudent === true;
    } catch (e) {
        localStorage.removeItem('hackaholics_student_session');
        localStorage.removeItem('studentLoggedIn');
        localStorage.removeItem('studentData');
        return false;
    }
}

// ----- Logout Function -----
function logoutStudent() {
    localStorage.removeItem('hackaholics_student_session');
    localStorage.removeItem('studentLoggedIn');
    localStorage.removeItem('studentData');
    localStorage.removeItem('hackaholics_role');
    window.location.href = 'student-login.html';
}
