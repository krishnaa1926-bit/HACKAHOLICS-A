// Admin Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (isAdminLoggedIn()) {
        // Redirect to admin dashboard if already logged in
        window.location.href = 'admin-dashboard.html';
        return;
    }

    const loginForm = document.getElementById('adminLoginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Show loading state
        const submitBtn = loginForm.querySelector('.btn-login');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Authenticating...';

        // Simulate authentication delay
        setTimeout(() => {
            if (authenticateAdmin(username, password)) {
                // Successful login
                setAdminLoginSession(username);
                showMessage('success', 'Login successful! Redirecting to dashboard...');

                // Redirect to admin dashboard after short delay
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1500);
            } else {
                // Failed login
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Admin Dashboard';
                showMessage('error', 'Invalid credentials. Access denied.');
            }
        }, 1000);
    });

    function authenticateAdmin(username, password) {
        // Predefined admin credentials (in a real app, this would be server-side)
        const adminCredentials = {
            'hackaholics_admin': 'admin2024!',
            'admin': 'password123',
            'team_lead': 'hack2024'
        };

        return adminCredentials[username] === password;
    }

    function setAdminLoginSession(username) {
        // Store admin session (in a real app, use secure tokens)
        const sessionData = {
            username: username,
            loginTime: new Date().toISOString(),
            isAdmin: true
        };

        localStorage.setItem('hackaholics_admin_session', JSON.stringify(sessionData));
    }

    function showMessage(type, message) {
        loginMessage.className = `login-message ${type}`;
        loginMessage.textContent = message;
        loginMessage.classList.remove('hidden');

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                loginMessage.classList.add('hidden');
            }, 2000);
        }
    }
});

// Utility function to check if admin is logged in
function isAdminLoggedIn() {
    const session = localStorage.getItem('hackaholics_admin_session');
    if (!session) return false;

    try {
        const sessionData = JSON.parse(session);
        // Check if session is still valid (24 hours)
        const loginTime = new Date(sessionData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

        if (hoursDiff > 24) {
            // Session expired
            localStorage.removeItem('hackaholics_admin_session');
            return false;
        }

        return sessionData.isAdmin === true;
    } catch (e) {
        // Invalid session data
        localStorage.removeItem('hackaholics_admin_session');
        return false;
    }
}

// Function to logout admin
function logoutAdmin() {
    localStorage.removeItem('hackaholics_admin_session');
    window.location.href = 'admin-login.html';
}
