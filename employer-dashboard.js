// Mock data for student applications
const studentApplications = [
    {
        id: 1,
        fullName: "Alice Johnson",
        email: "alice.johnson@example.com",
        phone: "+91-9876543210",
        skills: ["JavaScript", "React", "Node.js"],
        trustScore: 85,
        applicationDate: "2024-04-15",
        degree: "B.Tech",
        year: "3rd Year",
        interests: "Frontend development, UI/UX design",
        certificates: ["React Basics Certificate", "JavaScript Advanced"],
        status: "Pending"
    },
    {
        id: 2,
        fullName: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        phone: "+91-9123456780",
        skills: ["Python", "Django", "Machine Learning"],
        trustScore: 90,
        applicationDate: "2024-04-18",
        degree: "M.Tech",
        year: "Graduated",
        interests: "Backend development, AI/ML",
        certificates: ["Python Developer Certificate", "ML Specialist"],
        status: "Pending"
    },
    {
        id: 3,
        fullName: "Sneha Patel",
        email: "sneha.patel@example.com",
        phone: "+91-9988776655",
        skills: ["Java", "Spring Boot", "Microservices"],
        trustScore: 78,
        applicationDate: "2024-04-20",
        degree: "BCA",
        year: "4th Year",
        interests: "Backend development, Cloud computing",
        certificates: ["Java Fundamentals", "Spring Boot Mastery"],
        status: "Pending"
    }
];

// Initialize the employer dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadApplications();

    // Modal close button
    const closeModalBtn = document.getElementById('closeApplicationModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeApplicationModal);
    }

    // Accept and Reject buttons
    const acceptBtn = document.getElementById('acceptApplicationBtn');
    const rejectBtn = document.getElementById('rejectApplicationBtn');

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => updateApplicationStatus('Accepted'));
    }
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => updateApplicationStatus('Rejected'));
    }
});

function loadApplications() {
    const container = document.getElementById('applicationsContainer');
    const noAppsMessage = document.getElementById('noApplicationsMessage');

    if (studentApplications.length === 0) {
        container.classList.add('hidden');
        noAppsMessage.classList.remove('hidden');
        return;
    }

    noAppsMessage.classList.add('hidden');
    container.classList.remove('hidden');

    container.innerHTML = studentApplications.map(app => `
        <div class="application-card" data-id="${app.id}">
            <div class="application-header">
                <div class="application-student-info">
                    <div class="student-avatar">${getInitials(app.fullName)}</div>
                    <div class="student-details">
                        <h3>${app.fullName}</h3>
                        <p>${app.email}</p>
                        <p>${app.degree} - ${app.year}</p>
                    </div>
                </div>
                <span class="application-status">${app.status}</span>
            </div>
            <div class="application-details">
                <div class="application-detail"><i class="fas fa-phone"></i> ${app.phone}</div>
                <div class="application-detail"><i class="fas fa-calendar-alt"></i> Applied on: ${formatDate(app.applicationDate)}</div>
                <div class="application-detail">
                    <i class="fas fa-star"></i> Trust Score: <strong>${app.trustScore}%</strong>
                </div>
                <div class="application-detail">
                    <i class="fas fa-tools"></i> Skills:
                    <div class="student-skills">
                        ${app.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="application-footer">
                <div class="application-date">Applied: ${formatDate(app.applicationDate)}</div>
                <div class="application-actions">
                    <button class="btn-view-profile" onclick="viewApplicationDetails(${app.id})">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

function getInitials(name) {
    const names = name.split(' ');
    let initials = names[0].charAt(0);
    if (names.length > 1) {
        initials += names[names.length - 1].charAt(0);
    }
    return initials.toUpperCase();
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, options);
}

let currentApplicationId = null;

function viewApplicationDetails(id) {
    currentApplicationId = id;
    const app = studentApplications.find(a => a.id === id);
    if (!app) return;

    const modal = document.getElementById('applicationModal');
    const detailsContainer = document.getElementById('applicationDetails');

    detailsContainer.innerHTML = `
        <div class="application-details-grid">
            <div class="detail-section">
                <h4>Personal Information</h4>
                <div class="detail-item"><span class="detail-label">Full Name:</span> <span class="detail-value">${app.fullName}</span></div>
                <div class="detail-item"><span class="detail-label">Email:</span> <span class="detail-value">${app.email}</span></div>
                <div class="detail-item"><span class="detail-label">Phone:</span> <span class="detail-value">${app.phone}</span></div>
                <div class="detail-item"><span class="detail-label">Degree:</span> <span class="detail-value">${app.degree}</span></div>
                <div class="detail-item"><span class="detail-label">Year:</span> <span class="detail-value">${app.year}</span></div>
                <div class="detail-item"><span class="detail-label">Interests:</span> <span class="detail-value">${app.interests}</span></div>
            </div>
            <div class="detail-section certificates-section">
                <h4>Certificates</h4>
                <div class="certificates-list">
                    ${app.certificates.length > 0 ? app.certificates.map(cert => `
                        <div class="certificate-item">
                            <i class="fas fa-file-alt"></i>
                            <span>${cert}</span>
                        </div>
                    `).join('') : '<p>No certificates uploaded</p>'}
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    currentApplicationId = null;
}

function updateApplicationStatus(newStatus) {
    if (currentApplicationId === null) return;

    const appIndex = studentApplications.findIndex(a => a.id === currentApplicationId);
    if (appIndex === -1) return;

    studentApplications[appIndex].status = newStatus;

    // Update UI
    loadApplications();
    closeApplicationModal();

    showNotification(`Application ${newStatus.toLowerCase()} successfully!`, 'success');
}

// Notification function reused from script.js
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Auto remove after specified duration
    setTimeout(() => {
        if (notification.parentElement) {
            closeNotification(notification);
        }
    }, duration);
}

function closeNotification(element) {
    if (element.classList.contains('notification-close')) {
        element = element.closest('.notification');
    }
    if (element && element.parentElement) {
        element.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (element.parentElement) {
                element.remove();
            }
        }, 300);
    }
}
