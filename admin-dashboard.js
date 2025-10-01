// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!isAdminLoggedIn()) {
        // Redirect to login if not authenticated
        window.location.href = 'admin-login.html';
        return;
    }

    // Initialize admin dashboard
    loadAdminData();
    displayAdminInfo();
});

function loadAdminData() {
    // Simulate API calls to get admin data
    // In a real application, these would be actual API calls

    // Mock data for demonstration
    const adminData = {
        internshipProgress: 47, // Active internships in progress
        certVerificationPending: 23, // Certificates awaiting verification
        fakeCertificates: 5, // Fake certificates detected
        internshipApplicationsPending: 89, // Pending internship applications
        approvedInternships: 156, // Total approved internships
        approvedCertificates: 134 // Total approved certificates
    };

    // Update the dashboard with the data
    updateDashboard(adminData);
}

function updateDashboard(data) {
    // Update each metric on the dashboard
    document.getElementById('internshipProgress').textContent = data.internshipProgress;
    document.getElementById('certVerificationPending').textContent = data.certVerificationPending;
    document.getElementById('fakeCertificates').textContent = data.fakeCertificates;
    document.getElementById('internshipApplicationsPending').textContent = data.internshipApplicationsPending;
    document.getElementById('approvedInternships').textContent = data.approvedInternships;
    document.getElementById('approvedCertificates').textContent = data.approvedCertificates;
}

// Function to refresh data (could be called periodically or on button click)
function refreshAdminData() {
    // Add loading state
    const cards = document.querySelectorAll('.dashboard-card p');
    cards.forEach(card => {
        if (!card.textContent.includes('Loading')) {
            card.textContent = 'Loading...';
        }
    });

    // Simulate API delay
    setTimeout(() => {
        loadAdminData();
    }, 1000);
}

// Function to export admin data (for reporting purposes)
function exportAdminData() {
    const data = {
        timestamp: new Date().toISOString(),
        internshipProgress: document.getElementById('internshipProgress').textContent,
        certVerificationPending: document.getElementById('certVerificationPending').textContent,
        fakeCertificates: document.getElementById('fakeCertificates').textContent,
        internshipApplicationsPending: document.getElementById('internshipApplicationsPending').textContent,
        approvedInternships: document.getElementById('approvedInternships').textContent,
        approvedCertificates: document.getElementById('approvedCertificates').textContent
    };

    // In a real application, this would send data to a server or generate a report
    console.log('Admin Data Export:', data);
    alert('Admin data exported to console. Check browser developer tools.');
}

// Function to display admin information
function displayAdminInfo() {
    const session = localStorage.getItem('hackaholics_admin_session');
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            const welcomeElement = document.getElementById('adminWelcome');
            if (welcomeElement) {
                welcomeElement.textContent = `Welcome, ${sessionData.username}`;
            }
        } catch (e) {
            console.error('Error parsing admin session:', e);
        }
    }

    // Add logout functionality
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                logoutAdmin();
            }
        });
    }
}

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

// Add event listeners for potential admin actions
document.addEventListener('DOMContentLoaded', function() {
    // Add refresh button functionality if needed
    // const refreshBtn = document.getElementById('refreshBtn');
    // if (refreshBtn) {
    //     refreshBtn.addEventListener('click', refreshAdminData);
    // }

    // Add export button functionality if needed
    // const exportBtn = document.getElementById('exportBtn');
    // if (exportBtn) {
    //     exportBtn.addEventListener('click', exportAdminData);
    // }
});
