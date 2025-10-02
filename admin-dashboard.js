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
        approvedCertificates: 134, // Total approved certificates
        totalStudents: 1250, // Total registered students
        totalInternships: 200, // Total internships posted
        fillRates: '78%', // Internship fill rate
        averageTrustScore: 85, // Average TrustScore across students
        ruralParticipants: 320 // Number of rural/aspirational area participants
    };

    // Update the dashboard with the data
    updateDashboard(adminData);
    renderCharts();
    loadModerationData();
}

function updateDashboard(data) {
    // Update each metric on the dashboard
    document.getElementById('internshipProgress').textContent = data.internshipProgress;
    document.getElementById('certVerificationPending').textContent = data.certVerificationPending;
    document.getElementById('fakeCertificates').textContent = data.fakeCertificates;
    document.getElementById('internshipApplicationsPending').textContent = data.internshipApplicationsPending;
    document.getElementById('approvedInternships').textContent = data.approvedInternships;
    document.getElementById('approvedCertificates').textContent = data.approvedCertificates;
    document.getElementById('totalStudents').textContent = data.totalStudents;
    document.getElementById('totalInternships').textContent = data.totalInternships;
    document.getElementById('fillRates').textContent = data.fillRates;
    document.getElementById('averageTrustScore').textContent = data.averageTrustScore;
    document.getElementById('ruralParticipants').textContent = data.ruralParticipants;
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

function renderCharts() {
    // Mock data for charts
    const placementsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'North Region',
                data: [12, 19, 15, 22, 30, 25, 28, 35, 40, 38, 45, 50],
                borderColor: '#5a6fd0',
                backgroundColor: 'rgba(90, 111, 208, 0.2)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'South Region',
                data: [10, 14, 18, 20, 25, 22, 26, 30, 33, 35, 40, 42],
                borderColor: '#6a4190',
                backgroundColor: 'rgba(106, 65, 144, 0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const sectorData = {
        labels: ['IT', 'Finance', 'Healthcare', 'Education', 'Manufacturing'],
        datasets: [
            {
                label: 'Demand',
                data: [120, 90, 70, 50, 40],
                backgroundColor: '#5a6fd0'
            },
            {
                label: 'Supply',
                data: [100, 80, 60, 45, 35],
                backgroundColor: '#6a4190'
            }
        ]
    };

    // Render placements chart
    const placementsCtx = document.getElementById('placementsChart').getContext('2d');
    new Chart(placementsCtx, {
        type: 'line',
        data: placementsData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false,
                }
            }
        }
    });

    // Render sector demand vs supply chart
    const sectorCtx = document.getElementById('sectorChart').getContext('2d');
    new Chart(sectorCtx, {
        type: 'bar',
        data: sectorData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false,
                }
            }
        }
    });
}

function loadModerationData() {
    // Mock data for pending employers
    const pendingEmployers = [
        { id: 1, name: 'TechCorp Solutions', industry: 'IT', status: 'Pending' },
        { id: 2, name: 'FinanceHub Ltd', industry: 'Finance', status: 'Pending' },
        { id: 3, name: 'HealthCare Plus', industry: 'Healthcare', status: 'Pending' }
    ];

    // Mock data for pending internships
    const pendingInternships = [
        { id: 1, title: 'Software Developer Intern', company: 'TechCorp Solutions', status: 'Pending' },
        { id: 2, title: 'Data Analyst Intern', company: 'FinanceHub Ltd', status: 'Pending' },
        { id: 3, title: 'Marketing Intern', company: 'HealthCare Plus', status: 'Pending' }
    ];

    // Populate employers table
    const employersBody = document.getElementById('pendingEmployersBody');
    employersBody.innerHTML = '';
    pendingEmployers.forEach(employer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employer.name}</td>
            <td>${employer.industry}</td>
            <td>${employer.status}</td>
            <td>
                <button class="btn-approve" onclick="approveEmployer(${employer.id})">Approve</button>
                <button class="btn-reject" onclick="rejectEmployer(${employer.id})">Reject</button>
            </td>
        `;
        employersBody.appendChild(row);
    });

    // Populate internships table
    const internshipsBody = document.getElementById('pendingInternshipsBody');
    internshipsBody.innerHTML = '';
    pendingInternships.forEach(internship => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${internship.title}</td>
            <td>${internship.company}</td>
            <td>${internship.status}</td>
            <td>
                <button class="btn-approve" onclick="approveInternship(${internship.id})">Approve</button>
                <button class="btn-reject" onclick="rejectInternship(${internship.id})">Reject</button>
            </td>
        `;
        internshipsBody.appendChild(row);
    });
}

function approveEmployer(id) {
    if (confirm('Are you sure you want to approve this employer?')) {
        // In a real app, make API call
        alert(`Employer ${id} approved!`);
        loadModerationData(); // Refresh data
    }
}

function rejectEmployer(id) {
    if (confirm('Are you sure you want to reject this employer?')) {
        // In a real app, make API call
        alert(`Employer ${id} rejected!`);
        loadModerationData(); // Refresh data
    }
}

function approveInternship(id) {
    if (confirm('Are you sure you want to approve this internship?')) {
        // In a real app, make API call
        alert(`Internship ${id} approved!`);
        loadModerationData(); // Refresh data
    }
}

function rejectInternship(id) {
    if (confirm('Are you sure you want to reject this internship?')) {
        // In a real app, make API call
        alert(`Internship ${id} rejected!`);
        loadModerationData(); // Refresh data
    }
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
