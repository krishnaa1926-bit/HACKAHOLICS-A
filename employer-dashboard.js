// Mock data for internships and candidate applications
const internships = [
    {
        id: 1,
        title: "Frontend Developer Intern",
        description: "Work on building responsive UI components.",
        requiredSkills: ["JavaScript", "React", "CSS"],
        location: "Bangalore",
        duration: "3 months",
        stipend: "15,000 INR/month",
        capacity: 3,
        sector: "IT",
        geographyRestriction: "Urban",
        candidates: [
            {
                id: 101,
                fullName: "Alice Johnson",
                email: "alice.johnson@example.com",
                phone: "+91-9876543210",
                skills: ["JavaScript", "React", "Node.js"],
                trustScore: 85,
                matchPercentage: 92,
                location: "Bangalore",
                degree: "B.Tech",
                year: "3rd Year",
                interests: "Frontend development, UI/UX design",
                certificates: ["React Basics Certificate", "JavaScript Advanced"],
                status: "Pending",
                ruralCandidate: false,
                pastInternship: false,
                fairnessScore: 0.8
            },
            {
                id: 102,
                fullName: "Rahul Sharma",
                email: "rahul.sharma@example.com",
                phone: "+91-9123456780",
                skills: ["Python", "Django", "Machine Learning"],
                trustScore: 90,
                matchPercentage: 88,
                location: "Mysore",
                degree: "M.Tech",
                year: "Graduated",
                interests: "Backend development, AI/ML",
                certificates: ["Python Developer Certificate", "ML Specialist"],
                status: "Pending",
                ruralCandidate: true,
                pastInternship: true,
                fairnessScore: 0.7
            },
            {
                id: 103,
                fullName: "Sneha Patel",
                email: "sneha.patel@example.com",
                phone: "+91-9988776655",
                skills: ["Java", "Spring Boot", "Microservices"],
                trustScore: 78,
                matchPercentage: 80,
                location: "Bangalore",
                degree: "BCA",
                year: "4th Year",
                interests: "Backend development, Cloud computing",
                certificates: ["Java Fundamentals", "Spring Boot Mastery"],
                status: "Pending",
                ruralCandidate: false,
                pastInternship: false,
                fairnessScore: 0.6
            }
        ]
    },
    {
        id: 2,
        title: "Marketing Intern",
        description: "Assist in digital marketing campaigns.",
        requiredSkills: ["SEO", "Content Writing", "Social Media"],
        location: "Remote",
        duration: "6 months",
        stipend: "10,000 INR/month",
        capacity: 2,
        sector: "Marketing",
        geographyRestriction: "Remote",
        candidates: [
            {
                id: 201,
                fullName: "Kavita Singh",
                email: "kavita.singh@example.com",
                phone: "+91-9876543211",
                skills: ["SEO", "Content Writing"],
                trustScore: 82,
                matchPercentage: 85,
                location: "Delhi",
                degree: "MBA",
                year: "2nd Year",
                interests: "Digital marketing, Content creation",
                certificates: ["SEO Basics", "Content Marketing"],
                status: "Pending",
                ruralCandidate: false,
                pastInternship: false,
                fairnessScore: 0.75
            },
            {
                id: 202,
                fullName: "Ramesh Kumar",
                email: "ramesh.kumar@example.com",
                phone: "+91-9123456781",
                skills: ["Social Media", "Content Writing"],
                trustScore: 88,
                matchPercentage: 90,
                location: "Rural Haryana",
                degree: "BBA",
                year: "3rd Year",
                interests: "Social media marketing",
                certificates: ["Social Media Marketing"],
                status: "Pending",
                ruralCandidate: true,
                pastInternship: true,
                fairnessScore: 0.85
            }
        ]
    }
];

// Initialize the employer dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadInternships();
    updateDashboardOverview();

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

    // Filter functionality
    const trustScoreFilter = document.getElementById('trustScoreFilter');
    const trustScoreValue = document.getElementById('trustScoreValue');
    const sectorFilter = document.getElementById('sectorFilter');
    const internshipTypeFilter = document.getElementById('internshipTypeFilter');
    const durationFilter = document.getElementById('durationFilter');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');

    if (trustScoreFilter && trustScoreValue) {
        trustScoreFilter.addEventListener('input', function() {
            trustScoreValue.textContent = this.value + '%';
        });
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    // Post internship form
    const postInternshipForm = document.getElementById('postInternshipForm');
    const cancelPostBtn = document.getElementById('cancelPost');

    if (postInternshipForm) {
        postInternshipForm.addEventListener('submit', handlePostInternship);
    }

    if (cancelPostBtn) {
        cancelPostBtn.addEventListener('click', function(e) {
            e.preventDefault();
            postInternshipForm.reset();
        });
    }

    // Add logout button event listener same as admin page
    const logoutBtn = document.getElementById('employerLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                logoutEmployer();
            }
        });
    }
});

// Function to logout employer, same as admin logout function
function logoutEmployer() {
    localStorage.removeItem('hackaholics_employer_session');
    localStorage.removeItem('hackaholics_user_role');
    window.location.href = 'employer-login.html';
}

function loadInternships() {
    const container = document.getElementById('applicationsContainer');
    const noAppsMessage = document.getElementById('noApplicationsMessage');

    if (internships.length === 0) {
        container.classList.add('hidden');
        noAppsMessage.classList.remove('hidden');
        return;
    }

    noAppsMessage.classList.add('hidden');
    container.classList.remove('hidden');

    container.innerHTML = internships.map(internship => `
        <div class="internship-section">
            <div class="internship-header">
                <h2>${internship.title}</h2>
                <div class="internship-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${internship.location}</span>
                    <span><i class="fas fa-clock"></i> ${internship.duration}</span>
                    <span><i class="fas fa-rupee-sign"></i> ${internship.stipend}</span>
                </div>
            </div>
            <div class="candidates-table-container">
                <table class="candidates-table">
                    <thead>
                        <tr>
                            <th>Candidate Name</th>
                            <th>Skills</th>
                            <th>Trust Score</th>
                            <th>Match %</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${internship.candidates.map(candidate => `
                            <tr data-id="${candidate.id}" data-internship-id="${internship.id}">
                                <td>
                                    <a href="#" class="candidate-name-link" onclick="viewApplicationDetails(${candidate.id}, ${internship.id})">
                                        ${candidate.fullName}
                                    </a>
                                </td>
                                <td>
                                    <div class="student-skills">
                                        ${candidate.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                    </div>
                                </td>
                                <td>
                                    <span class="trust-score-badge ${getTrustScoreClass(candidate.trustScore)}">
                                        ${candidate.trustScore}%
                                    </span>
                                </td>
                                <td>${candidate.matchPercentage}%</td>
                                <td>${candidate.location}</td>
                                <td><span class="status-badge status-${candidate.status.toLowerCase()}">${candidate.status}</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-shortlist" onclick="shortlistCandidate(${candidate.id}, ${internship.id})">Shortlist</button>
                                        <button class="btn-reject" onclick="rejectCandidate(${candidate.id}, ${internship.id})">Reject</button>
                                        <button class="btn-contact" onclick="contactCandidate(${candidate.id}, ${internship.id})">Contact</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
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

function getTrustScoreClass(score) {
    if (score >= 80) return 'trust-high';
    if (score >= 60) return 'trust-medium';
    return 'trust-low';
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, options);
}

let currentApplicationId = null;
let currentInternshipId = null;

function viewApplicationDetails(id, internshipId) {
    currentApplicationId = id;
    currentInternshipId = internshipId;

    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return;

    const candidate = internship.candidates.find(c => c.id === id);
    if (!candidate) return;

    const modal = document.getElementById('applicationModal');
    const detailsContainer = document.getElementById('applicationDetails');

    detailsContainer.innerHTML = `
        <div class="application-details-grid">
            <div class="detail-section">
                <h4>Personal Information</h4>
                <div class="detail-item"><span class="detail-label">Full Name:</span> <span class="detail-value">${candidate.fullName}</span></div>
                <div class="detail-item"><span class="detail-label">Email:</span> <span class="detail-value">${candidate.email}</span></div>
                <div class="detail-item"><span class="detail-label">Phone:</span> <span class="detail-value">${candidate.phone}</span></div>
                <div class="detail-item"><span class="detail-label">Location:</span> <span class="detail-value">${candidate.location}</span></div>
                <div class="detail-item"><span class="detail-label">Degree:</span> <span class="detail-value">${candidate.degree}</span></div>
                <div class="detail-item"><span class="detail-label">Year:</span> <span class="detail-value">${candidate.year}</span></div>
                <div class="detail-item"><span class="detail-label">Interests:</span> <span class="detail-value">${candidate.interests}</span></div>
                <div class="detail-item"><span class="detail-label">Trust Score:</span> <span class="detail-value">${candidate.trustScore}%</span></div>
                <div class="detail-item"><span class="detail-label">Match Percentage:</span> <span class="detail-value">${candidate.matchPercentage}%</span></div>
            </div>
            <div class="detail-section certificates-section">
                <h4>Certificates</h4>
                <div class="certificates-list">
                    ${candidate.certificates.length > 0 ? candidate.certificates.map(cert => `
                        <div class="certificate-item">
                            <i class="fas fa-file-alt"></i>
                            <span>${cert}</span>
                        </div>
                    `).join('') : '<p>No certificates uploaded</p>'}
                </div>
            </div>
            <div class="detail-section">
                <h4>Skills</h4>
                <div class="student-skills">
                    ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
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
    currentInternshipId = null;
}

function updateApplicationStatus(newStatus) {
    if (currentApplicationId === null || currentInternshipId === null) return;

    const internship = internships.find(i => i.id === currentInternshipId);
    if (!internship) return;

    const candidateIndex = internship.candidates.findIndex(c => c.id === currentApplicationId);
    if (candidateIndex === -1) return;

    internship.candidates[candidateIndex].status = newStatus;

    // Update UI
    loadInternships();
    closeApplicationModal();

    showNotification(`Application ${newStatus.toLowerCase()} successfully!`, 'success');
}

function shortlistCandidate(id, internshipId) {
    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return;

    const candidate = internship.candidates.find(c => c.id === id);
    if (!candidate) return;

    candidate.status = 'Shortlisted';
    loadInternships();
    showNotification(`${candidate.fullName} has been shortlisted!`, 'success');
}

function rejectCandidate(id, internshipId) {
    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return;

    const candidate = internship.candidates.find(c => c.id === id);
    if (!candidate) return;

    candidate.status = 'Rejected';
    loadInternships();
    showNotification(`${candidate.fullName} has been rejected.`, 'info');
}

function contactCandidate(id, internshipId) {
    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return;

    const candidate = internship.candidates.find(c => c.id === id);
    if (!candidate) return;

    // Simulate contact action
    showNotification(`Contact request sent to ${candidate.fullName}!`, 'success');
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

// Dashboard Overview Functions
function updateDashboardOverview() {
    const totalInternships = internships.length;
    const totalCandidates = internships.reduce((sum, internship) => sum + internship.candidates.length, 0);
    const shortlistedCandidates = internships.reduce((sum, internship) =>
        sum + internship.candidates.filter(c => c.status === 'Shortlisted').length, 0);
    const avgTrustScore = Math.round(
        internships.reduce((sum, internship) =>
            sum + internship.candidates.reduce((candidateSum, candidate) => candidateSum + candidate.trustScore, 0), 0
        ) / totalCandidates
    );

    document.getElementById('totalInternships').textContent = totalInternships;
    document.getElementById('totalCandidates').textContent = totalCandidates;
    document.getElementById('shortlistedCandidates').textContent = shortlistedCandidates;
    document.getElementById('avgTrustScore').textContent = avgTrustScore + '%';
}

// Filter Functions
function applyFilters() {
    const trustScoreFilter = parseInt(document.getElementById('trustScoreFilter').value);
    const locationFilter = document.getElementById('locationFilter').value;
    const ruralFilter = document.getElementById('ruralFilter').checked;
    const pastParticipationFilter = document.getElementById('pastParticipationFilter').checked;
    const sectorFilter = document.getElementById('sectorFilter').value;
    const internshipTypeFilter = document.getElementById('internshipTypeFilter').value;
    const durationFilter = document.getElementById('durationFilter').value;

    const filteredInternships = internships.map(internship => ({
        ...internship,
        candidates: internship.candidates.filter(candidate => {
            const meetsTrustScore = candidate.trustScore >= trustScoreFilter;
            const meetsLocation = !locationFilter ||
                (locationFilter === 'Rural' && candidate.location.toLowerCase().includes('rural')) ||
                (locationFilter === 'Urban' && !candidate.location.toLowerCase().includes('rural')) ||
                candidate.location.includes(locationFilter);
            const meetsRural = !ruralFilter || candidate.ruralCandidate;
            const meetsPastParticipation = !pastParticipationFilter || !candidate.pastInternship;

            return meetsTrustScore && meetsLocation && meetsRural && meetsPastParticipation;
        })
    })).filter(internship => {
        // Filter internships based on sector, type, and duration
        const meetsSector = !sectorFilter || internship.sector === sectorFilter;
        const meetsType = !internshipTypeFilter || internship.location.toLowerCase().includes(internshipTypeFilter.toLowerCase());
        const meetsDuration = !durationFilter || checkDurationMatch(internship.duration, durationFilter);

        return internship.candidates.length > 0 && meetsSector && meetsType && meetsDuration;
    });

    loadFilteredInternships(filteredInternships);
    showNotification('Filters applied successfully!', 'success');
}

function checkDurationMatch(internshipDuration, filterDuration) {
    const duration = internshipDuration.toLowerCase();
    switch(filterDuration) {
        case '1-3 months':
            return duration.includes('1') || duration.includes('2') || duration.includes('3');
        case '3-6 months':
            return duration.includes('3') || duration.includes('4') || duration.includes('5') || duration.includes('6');
        case '6+ months':
            return duration.includes('6') || duration.includes('12') || duration.includes('year');
        default:
            return true;
    }
}

function clearFilters() {
    document.getElementById('trustScoreFilter').value = 0;
    document.getElementById('trustScoreValue').textContent = '0%';
    document.getElementById('locationFilter').value = '';
    document.getElementById('ruralFilter').checked = false;
    document.getElementById('pastParticipationFilter').checked = false;
    document.getElementById('sectorFilter').value = '';
    document.getElementById('internshipTypeFilter').value = '';
    document.getElementById('durationFilter').value = '';

    loadInternships();
    showNotification('Filters cleared!', 'info');
}

function loadFilteredInternships(filteredInternships) {
    const container = document.getElementById('applicationsContainer');
    const noAppsMessage = document.getElementById('noApplicationsMessage');

    if (filteredInternships.length === 0) {
        container.classList.add('hidden');
        noAppsMessage.classList.remove('hidden');
        return;
    }

    noAppsMessage.classList.add('hidden');
    container.classList.remove('hidden');

    container.innerHTML = filteredInternships.map(internship => `
        <div class="internship-section">
            <div class="internship-header">
                <h2>${internship.title}</h2>
                <div class="internship-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${internship.location}</span>
                    <span><i class="fas fa-clock"></i> ${internship.duration}</span>
                    <span><i class="fas fa-rupee-sign"></i> ${internship.stipend}</span>
                </div>
            </div>
            <div class="candidates-table-container">
                <table class="candidates-table">
                    <thead>
                        <tr>
                            <th>Candidate Name</th>
                            <th>Skills</th>
                            <th>Trust Score</th>
                            <th>Match %</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${internship.candidates.map(candidate => `
                            <tr data-id="${candidate.id}" data-internship-id="${internship.id}">
                                <td>
                                    <a href="#" class="candidate-name-link" onclick="viewApplicationDetails(${candidate.id}, ${internship.id})">
                                        ${candidate.fullName}
                                    </a>
                                </td>
                                <td>
                                    <div class="student-skills">
                                        ${candidate.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                    </div>
                                </td>
                                <td>
                                    <span class="trust-score-badge ${getTrustScoreClass(candidate.trustScore)}">
                                        ${candidate.trustScore}%
                                    </span>
                                </td>
                                <td>${candidate.matchPercentage}%</td>
                                <td>${candidate.location}</td>
                                <td><span class="status-badge status-${candidate.status.toLowerCase()}">${candidate.status}</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-shortlist" onclick="shortlistCandidate(${candidate.id}, ${internship.id})">Shortlist</button>
                                        <button class="btn-reject" onclick="rejectCandidate(${candidate.id}, ${internship.id})">Reject</button>
                                        <button class="btn-contact" onclick="contactCandidate(${candidate.id}, ${internship.id})">Contact</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `).join('');
}

// Post Internship Functions
function handlePostInternship(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newInternship = {
        id: internships.length + 1,
        title: formData.get('internshipTitle'),
        description: formData.get('internshipDescription'),
        requiredSkills: formData.get('requiredSkills').split(',').map(skill => skill.trim()),
        location: formData.get('internshipLocation'),
        duration: formData.get('internshipDuration'),
        stipend: formData.get('stipend') + ' INR/month',
        capacity: parseInt(formData.get('capacity')),
        sector: formData.get('internshipSector'),
        geographyRestriction: formData.get('geographyRestriction'),
        candidates: []
    };

    internships.push(newInternship);
    e.target.reset();

    updateDashboardOverview();
    loadInternships();

    showNotification('Internship posted successfully!', 'success');
}
