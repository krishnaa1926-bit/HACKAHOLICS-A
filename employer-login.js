// Employer Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('employerLoginForm');
    const signupForm = document.getElementById('employerSignupForm');
    const loginMessage = document.getElementById('loginMessage');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');

    // Tab switching
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        clearMessage();
    });

    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        clearMessage();
    });

    // Check if employer is already logged in
    if (isEmployerLoggedIn()) {
        window.location.href = 'employer-dashboard.html';
        return;
    }

    // Login form submit
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearMessage();

        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        const submitBtn = loginForm.querySelector('.btn-login');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Authenticating...';

        setTimeout(() => {
            if (authenticateEmployer(email, password)) {
                setEmployerSession(email);
                showMessage('success', 'Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'employer-dashboard.html';
                }, 1500);
            } else {
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Dashboard';
                showMessage('error', 'Invalid email or password.');
            }
        }, 1000);
    });

    // Signup form submit
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearMessage();

        const company = document.getElementById('signupCompany').value.trim();
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
            if (registerEmployer(company, email, password)) {
                setEmployerSession(email);
                showMessage('success', 'Account created successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'employer-dashboard.html';
                }, 1500);
            } else {
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
                showMessage('error', 'Email already exists. Please use a different email.');
            }
        }, 1000);
    });

    function authenticateEmployer(email, password) {
        const users = getEmployerUsers();
        const user = users.find(u => u.email === email && u.password === password);
        return !!user;
    }

    function registerEmployer(company, email, password) {
        const users = getEmployerUsers();
        if (users.find(u => u.email === email)) {
            return false; // Email already exists
        }
        users.push({ company, email, password });
        localStorage.setItem('hackaholics_employer_users', JSON.stringify(users));
        return true;
    }

    function getEmployerUsers() {
        const users = localStorage.getItem('hackaholics_employer_users');
        return users ? JSON.parse(users) : [];
    }

    function setEmployerSession(email) {
        const sessionData = {
            email: email,
            loginTime: new Date().toISOString(),
            isEmployer: true
        };
        localStorage.setItem('hackaholics_employer_session', JSON.stringify(sessionData));
    }

    function showMessage(type, message) {
        loginMessage.className = `login-message ${type}`;
        loginMessage.textContent = message;
        loginMessage.classList.remove('hidden');
        if (type === 'success') {
            setTimeout(() => {
                loginMessage.classList.add('hidden');
            }, 2000);
        }
    }

    function clearMessage() {
        loginMessage.classList.add('hidden');
    }
});

// Utility function to check if employer is logged in
function isEmployerLoggedIn() {
    const session = localStorage.getItem('hackaholics_employer_session');
    if (!session) return false;

    try {
        const sessionData = JSON.parse(session);
        const loginTime = new Date(sessionData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        if (hoursDiff > 24) {
            localStorage.removeItem('hackaholics_employer_session');
            return false;
        }
        return sessionData.isEmployer === true;
    } catch (e) {
        localStorage.removeItem('hackaholics_employer_session');
        return false;
    }
}

// Function to logout employer
function logoutEmployer() {
    localStorage.removeItem('hackaholics_employer_session');
    window.location.href = 'employer-login.html';
}
