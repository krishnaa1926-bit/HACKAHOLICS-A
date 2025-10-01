// Hackaholics Internship Portal JavaScript - Original Version
// Global variables
let currentUser = null;
let uploadedFiles = [];

// Sample internship data for AI matching simulation
const sampleInternships = [
    {
        id: 1,
        title: "Frontend Developer Intern",
        company: "TechStart Solutions",
        location: "Remote",
        duration: "3 months",
        stipend: "₹15,000/month",
        skills: ["JavaScript", "React", "CSS", "HTML"],
        description: "Work on modern web applications using React and JavaScript. Perfect for students looking to gain real-world frontend development experience.",
        requirements: "Basic knowledge of JavaScript and HTML/CSS",
        matchScore: 95
    },
    {
        id: 2,
        title: "Python Backend Developer",
        company: "DataFlow Systems",
        location: "Bangalore",
        duration: "6 months",
        stipend: "₹20,000/month",
        skills: ["Python", "Django", "PostgreSQL", "REST APIs"],
        description: "Build scalable backend systems and APIs. Great opportunity for students interested in server-side development and databases.",
        requirements: "Python programming knowledge, basic understanding of web development",
        matchScore: 92
    },
    {
        id: 3,
        title: "Full Stack Developer",
        company: "InnovateIT",
        location: "Hybrid",
        duration: "4 months",
        stipend: "₹18,000/month",
        skills: ["JavaScript", "Node.js", "React", "MongoDB", "Express"],
        description: "End-to-end development experience working on both frontend and backend technologies. Perfect for versatile developers.",
        requirements: "Knowledge of JavaScript and basic web development concepts",
        matchScore: 88
    },
    {
        id: 4,
        title: "Data Science Intern",
        company: "Analytics Pro",
        location: "Remote",
        duration: "3 months",
        stipend: "₹12,000/month",
        skills: ["Python", "Machine Learning", "Pandas", "NumPy", "Jupyter"],
        description: "Work with real datasets to build predictive models and data analysis solutions. Ideal for students interested in AI/ML.",
        requirements: "Python programming, basic statistics knowledge",
        matchScore: 85
    },
    {
        id: 5,
        title: "Mobile App Developer",
        company: "AppCrafters",
        location: "Mumbai",
        duration: "5 months",
        stipend: "₹16,000/month",
        skills: ["React Native", "JavaScript", "Mobile Development", "API Integration"],
        description: "Develop cross-platform mobile applications using React Native. Gain experience in modern mobile development practices.",
        requirements: "JavaScript knowledge, interest in mobile development",
        matchScore: 82
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Sign up and Log in functionality
    const signuplink = document.getElementById('signuplink');
    const loginlink = document.getElementById('loginlink');
    if (signuplink) {
        signuplink.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToProfile();
        });
    }
    if (loginlink) {
        loginlink.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToProfile();
        });
    }
});

// Main initialization function
function initializeApp() {
    setupNavigation();
    setupFileUpload();
    setupAccessibility();
    loadUserProfile();

    // Check page access control for protected pages
    checkPageAccess();

    // Auth logic
    const signuplink = document.getElementById('signuplink');
    const loginlink = document.getElementById('loginlink');
    const profileMenu = document.getElementById('profileMenu');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (signuplink && loginlink && profileMenu && usernameDisplay) {
        const profile = localStorage.getItem('hackaholics_profile');
        if (profile) {
            try {
                const user = JSON.parse(profile);
                profileMenu.style.display = 'flex';
                usernameDisplay.textContent = user.fullName || 'User';
                signuplink.style.display = 'none';
                loginlink.style.display = 'none';
            } catch (error) {
                console.error('Error parsing profile:', error);
                // Fallback to logged out state
                profileMenu.style.display = 'none';
                signuplink.style.display = 'flex';
                loginlink.style.display = 'flex';
            }
        } else {
            profileMenu.style.display = 'none';
            signuplink.style.display = 'flex';
            loginlink.style.display = 'flex';
        }
    }
}

// Navigation functionality
function setupNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Update ARIA attributes for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Handle admin navigation
    setupAdminNavigation();
}

function setupAdminNavigation() {
    const adminLinks = document.querySelectorAll('a[href="admin-dashboard.html"]');

    adminLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Check if user is already logged in as admin
            if (isAdminLoggedIn()) {
                // Redirect to admin dashboard
                window.location.href = 'admin-dashboard.html';
            } else {
                // Redirect to admin login
                window.location.href = 'admin-login.html';
            }
        });
    });
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

// File upload functionality
function setupFileUpload() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('certificates');
    const uploadedFilesContainer = document.getElementById('uploadedFiles');

    if (fileUploadArea && fileInput) {
        // Click to upload
        fileUploadArea.addEventListener('click', function() {
            fileInput.click();
        });

        // Drag and drop functionality
        fileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#3b82f6';
            fileUploadArea.style.background = '#eff6ff';
        });

        fileUploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#d1d5db';
            fileUploadArea.style.background = '#f9fafb';
        });

        fileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#d1d5db';
            fileUploadArea.style.background = '#f9fafb';

            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        });

        // File input change
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        });
    }

    function handleFiles(files) {
        files.forEach(file => {
            if (file.size <= 10 * 1024 * 1024) { // 10MB limit
                uploadedFiles.push(file);
                displayUploadedFile(file);
            } else {
                alert(`File ${file.name} is too large. Maximum size is 10MB.`);
            }
        });
        updateTrustScore();
    }

    function displayUploadedFile(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span class="file-name">${file.name}</span>
            <button type="button" class="remove-file" onclick="removeFile('${file.name}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        uploadedFilesContainer.appendChild(fileItem);
    }
}

// Profile form handling
function setupProfileForm() {
    // Removed: Form handling now conditional in loadProfileData and showEditForm
}

function handleProfileSubmission() {
    const formData = new FormData(document.getElementById('profileEditForm'));
    const profileData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        degree: formData.get('degree'),
        year: formData.get('year'),
        location: formData.get('location'),
        skills: formData.get('skills').split(',').map(skill => skill.trim()),
        interests: formData.get('interests'),
        certificates: uploadedFiles,
        timestamp: new Date().toISOString()
    };

    // Save profile
    saveUserProfile(profileData);

    // Update trust score
    updateTrustScore();

    // Generate matches
    generateMatches(profileData);

    // Show success message
    showNotification('Profile created successfully! Redirecting to your trust score...', 'success');

    // Redirect to trust score page after a short delay
    setTimeout(() => {
        window.location.href = 'trust-score.html';
    }, 1500);
}

// User profile management
function saveUserProfile(profileData) {
    currentUser = profileData;
    localStorage.setItem('hackaholics_profile', JSON.stringify(profileData));
    updateTrustScore();
}

function loadUserProfile() {
    const savedProfile = localStorage.getItem('hackaholics_profile');
    if (savedProfile) {
        currentUser = JSON.parse(savedProfile);
        populateProfileForm(currentUser);
        updateTrustScore();
        generateMatches(currentUser);
    }
}

function populateProfileForm(profile) {
    document.getElementById('fullName').value = profile.fullName || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('degree').value = profile.degree || '';
    document.getElementById('year').value = profile.year || '';
    document.getElementById('location').value = profile.location || '';
    document.getElementById('skills').value = profile.skills ? profile.skills.join(', ') : '';
    document.getElementById('interests').value = profile.interests || '';
}

// Trust score calculation
function updateTrustScore() {
    if (!currentUser) return;

    let profileScore = 0;
    let certScore = 0;
    let skillsScore = 0;
    let quizScore = 0;

    // Profile completeness (30% weight)
    const requiredFields = ['fullName', 'email', 'phone', 'degree', 'year', 'location', 'skills', 'interests'];
    const completedFields = requiredFields.filter(field => currentUser[field] && currentUser[field].toString().trim() !== '');
    profileScore = (completedFields.length / requiredFields.length) * 30;

    // Certificate verification (25% weight)
    if (currentUser.certificates && currentUser.certificates.length > 0) {
        certScore = Math.min(currentUser.certificates.length * 12, 25);
    }

    // Skills validation (20% weight)
    if (currentUser.skills && currentUser.skills.length > 0) {
        const skillCount = currentUser.skills.length;
        if (skillCount >= 5) skillsScore = 20;
        else if (skillCount >= 3) skillsScore = 15;
        else if (skillCount >= 1) skillsScore = 10;
    }

    // Quiz assessment (25% weight)
    if (currentUser.quizCompleted && currentUser.quizScore) {
        quizScore = (currentUser.quizScore / 100) * 25;
    }

    const totalScore = Math.round(profileScore + certScore + skillsScore + quizScore);

    // Update UI
    const scoreElement = document.getElementById('trustScore');
    const profileScoreElement = document.getElementById('profileScore');
    const certScoreElement = document.getElementById('certScore');
    const skillsScoreElement = document.getElementById('skillsScore');
    const quizScoreElement = document.getElementById('quizScore');

    if (scoreElement) scoreElement.textContent = totalScore;
    if (profileScoreElement) profileScoreElement.textContent = Math.round(profileScore) + '%';
    if (certScoreElement) certScoreElement.textContent = Math.round(certScore) + '%';
    if (skillsScoreElement) skillsScoreElement.textContent = Math.round(skillsScore) + '%';
    if (quizScoreElement) quizScoreElement.textContent = Math.round(quizScore) + '%';

    // Update progress circle
    updateProgressCircle(totalScore);
}

function updateProgressCircle(score) {
    const circle = document.querySelector('.score-circle');
    if (circle) {
        const percentage = (score / 100) * 360;
        circle.style.background = `conic-gradient(#3b82f6 0deg ${percentage}deg, #e5e7eb ${percentage}deg 360deg)`;
    }
}

// AI-powered matching simulation
function generateMatches(profile) {
    const matchesContainer = document.getElementById('matchesContainer');
    if (!matchesContainer) return;

    // Simulate AI matching algorithm
    const matches = sampleInternships.map(internship => {
        let matchScore = calculateMatchScore(profile, internship);
        return { ...internship, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);

    // Display matches
    displayMatches(matches);
}

function calculateMatchScore(profile, internship) {
    let score = 0;

    // Skills matching (40% weight)
    if (profile.skills) {
        const matchingSkills = profile.skills.filter(skill =>
            internship.skills.some(internshipSkill =>
                internshipSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(internshipSkill.toLowerCase())
            )
        );
        score += (matchingSkills.length / internship.skills.length) * 40;
    }

    // Location preference (20% weight)
    if (profile.location) {
        if (profile.location === 'remote' && internship.location === 'Remote') score += 20;
        else if (profile.location === 'flexible') score += 15;
        else if (profile.location === 'hybrid' && internship.location === 'Hybrid') score += 20;
        else score += 10; // Partial match
    }

    // Degree relevance (20% weight)
    if (profile.degree) {
        const relevantDegrees = ['btech', 'bca', 'bsc', 'mtech', 'mca', 'msc'];
        if (relevantDegrees.includes(profile.degree.toLowerCase())) {
            score += 15;
        } else {
            score += 10;
        }
    }

    // Year of study (10% weight)
    if (profile.year) {
        const yearNum = parseInt(profile.year);
        if (yearNum >= 3 || profile.year === 'graduated') {
            score += 10;
        } else if (yearNum >= 2) {
            score += 7;
        } else {
            score += 5;
        }
    }

    // Interests alignment (10% weight)
    if (profile.interests) {
        const interests = profile.interests.toLowerCase();
        const keywords = ['development', 'coding', 'programming', 'software', 'technology', 'computer'];
        const matchingKeywords = keywords.filter(keyword => interests.includes(keyword));
        score += (matchingKeywords.length / keywords.length) * 10;
    }

    return Math.min(Math.round(score), 100);
}

function displayMatches(matches) {
    const matchesContainer = document.getElementById('matchesContainer');

    if (matches.length === 0) {
        matchesContainer.innerHTML = `
            <div class="no-matches">
                <i class="fas fa-search"></i>
                <h3>No matches found</h3>
                <p>Complete your profile to get better matches!</p>
            </div>
        `;
        return;
    }

    const matchesHTML = matches.map(internship => `
        <div class="internship-card fade-in">
            <div class="internship-header">
                <div>
                    <h3 class="internship-title">${internship.title}</h3>
                    <p class="internship-company">${internship.company}</p>
                </div>
                <span class="internship-match">${internship.matchScore}% Match</span>
            </div>

            <div class="internship-details">
                <div class="internship-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${internship.location}</span>
                </div>
                <div class="internship-detail">
                    <i class="fas fa-clock"></i>
                    <span>${internship.duration}</span>
                </div>
                <div class="internship-detail">
                    <i class="fas fa-rupee-sign"></i>
                    <span>${internship.stipend}</span>
                </div>
            </div>

            <p class="internship-description">${internship.description}</p>

            <div class="internship-requirements">
                <h4>Required Skills:</h4>
                <div class="skills-tags">
                    ${internship.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>

            <div class="internship-footer">
                <small class="internship-requirements-text">${internship.requirements}</small>
                <button class="internship-apply" onclick="applyToInternship(${internship.id})">
                    Apply Now
                </button>
            </div>
        </div>
    `).join('');

    matchesContainer.innerHTML = matchesHTML;
}

// Utility functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('fade-in');

        // Update navigation active state
        updateActiveNav(sectionId);
    }
}

function updateActiveNav(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    const fileItem = document.querySelector(`.file-item:has(.file-name:contains("${fileName}"))`);
    if (fileItem) {
        fileItem.remove();
    }
    updateTrustScore();
}

function applyToInternship(internshipId) {
    if (!currentUser) {
        showNotification('Please create your profile first!', 'error');
        showSection('profile-setup');
        return;
    }

    showNotification('Application submitted successfully! You will be notified about the next steps.', 'success');
}

// Accessibility enhancements
function setupAccessibility() {
    // Add ARIA labels and roles
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    // Keyboard navigation for custom elements
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Focus management for file upload
    const fileUploadArea = document.getElementById('fileUploadArea');
    if (fileUploadArea) {
        fileUploadArea.setAttribute('tabindex', '0');
        fileUploadArea.setAttribute('role', 'button');
        fileUploadArea.setAttribute('aria-label', 'Upload certificates - click or drag and drop files');
    }
}

// Access Control Functions with Enhanced UX
function isProfileComplete() {
    const savedProfile = localStorage.getItem('hackaholics_profile');
    if (!savedProfile) return false;

    try {
        const profile = JSON.parse(savedProfile);
        const requiredFields = ['fullName', 'email', 'phone', 'degree', 'year', 'location', 'skills', 'interests'];
        const completedFields = requiredFields.filter(field =>
            profile[field] && profile[field].toString().trim() !== ''
        );
        return completedFields.length === requiredFields.length;
    } catch (error) {
        console.error('Error parsing profile data:', error);
        return false;
    }
}

function checkPageAccess() {
    const currentPage = window.location.pathname.split('/').pop();

    // Define protected pages
    const protectedPages = ['internships.html', 'trust-score.html'];

    if (protectedPages.includes(currentPage)) {
        if (!isProfileComplete()) {
            showAccessDeniedMessage();
            return false;
        }
    }

    // Update navigation based on profile completion
    updateNavigationAccess();
    return true;
}

function showAccessDeniedMessage() {
    // Create and show access denied overlay
    const overlay = document.createElement('div');
    overlay.className = 'access-denied-overlay';
    overlay.innerHTML = `
        <div class="access-denied-content">
            <div class="access-denied-icon">
                <i class="fas fa-lock"></i>
            </div>
            <h2>Profile Required</h2>
            <p>Complete your profile to access internships and trust score features.</p>
            <div class="access-denied-actions">
                <button class="btn btn-primary" onclick="redirectToProfile()">
                    Complete Profile
                </button>
                <button class="btn btn-secondary" onclick="closeAccessDenied()">
                    Maybe Later
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Auto redirect after 10 seconds
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            redirectToProfile();
        }
    }, 10000);
}

function closeAccessDenied() {
    const overlay = document.querySelector('.access-denied-overlay');
    if (overlay) {
        overlay.remove();
        document.body.style.overflow = '';
    }
}

function redirectToProfile() {
    closeAccessDenied();
    showNotification('Redirecting to profile setup...', 'info');
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1000);
}

function updateNavigationAccess() {
    const profileComplete = isProfileComplete();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Add visual indicators for protected pages
        if (href === 'internships.html' || href === 'trust-score.html') {
            if (!profileComplete) {
                link.classList.add('locked');
                link.title = 'Complete your profile to access this page';

                // Prevent navigation for locked links
                link.addEventListener('click', function(e) {
                    if (!profileComplete) {
                        e.preventDefault();
                        showAccessDeniedMessage();
                    }
                });
            } else {
                link.classList.remove('locked');
                link.title = '';
            }
        }
    });
}

// Enhanced loading states
function showLoadingState(elementId, message = 'Loading...') {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>${message}</p>
        </div>
    `;

    element.classList.add('loading');
}

function hideLoadingState(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.classList.remove('loading');
    element.innerHTML = element.dataset.originalContent || '';
}

function showProfileCheckLoading() {
    const navLinks = document.querySelectorAll('.nav-link[href="internships.html"], .nav-link[href="trust-score.html"]');

    navLinks.forEach(link => {
        const originalText = link.textContent;
        link.dataset.originalText = originalText;
        link.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
        link.classList.add('checking-access');
    });

    // Simulate profile check delay
    setTimeout(() => {
        updateNavigationAccess();
        navLinks.forEach(link => {
            if (link.dataset.originalText) {
                link.textContent = link.dataset.originalText;
                link.classList.remove('checking-access');
            }
        });
    }, 1500);
}

// Enhanced notification system
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

// Add CSS animations for notifications
function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .loading-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                color: #64748b;
            }
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #e2e8f0;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            }
            .access-denied-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(10px);
            }
            .access-denied-content {
                background: white;
                padding: 3rem;
                border-radius: 20px;
                text-align: center;
                max-width: 500px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: fadeInScale 0.3s ease;
            }
            .access-denied-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 2rem;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            }
            .access-denied-icon i {
                font-size: 2rem;
                color: white;
            }
            .access-denied-content h2 {
                color: #1a202c;
                margin-bottom: 1rem;
                font-size: 2rem;
                font-weight: 700;
            }
            .access-denied-content p {
                color: #4a5568;
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            .access-denied-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            @keyframes fadeInScale {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .nav-link.checking-access {
                pointer-events: none;
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
    }
}

// Profile Management Functions
function loadProfileData() {
    const savedProfile = localStorage.getItem('hackaholics_profile');
    if (!savedProfile) {
        // Show form for creation
        const profileDisplay = document.getElementById('profileDisplay');
        const editProfileForm = document.getElementById('editProfileForm');
        if (profileDisplay && editProfileForm) {
            profileDisplay.classList.add('hidden');
            editProfileForm.classList.remove('hidden');
            // Attach submit listener for creation
            editProfileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleProfileSubmission();
            });
            // Scroll to form
            editProfileForm.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }

    try {
        const profile = JSON.parse(savedProfile);
        displayProfileData(profile);
    } catch (error) {
        console.error('Error loading profile:', error);
        showNotification('Error loading profile data. Please try again.', 'error');
    }
}

function displayProfileData(profile) {
    // Update display elements
    document.getElementById('displayName').textContent = profile.fullName || 'Not set';
    document.getElementById('displayEmail').textContent = profile.email || 'Not set';
    document.getElementById('detailFullName').textContent = profile.fullName || 'Not set';
    document.getElementById('detailEmail').textContent = profile.email || 'Not set';
    document.getElementById('detailPhone').textContent = profile.phone || 'Not set';
    document.getElementById('detailDegree').textContent = profile.degree || 'Not set';
    document.getElementById('detailYear').textContent = profile.year || 'Not set';
    document.getElementById('detailLocation').textContent = profile.location || 'Not set';
    document.getElementById('detailInterests').textContent = profile.interests || 'Not set';

    // Display skills
    const skillsContainer = document.getElementById('detailSkills');
    if (profile.skills && profile.skills.length > 0) {
        skillsContainer.innerHTML = profile.skills.map(skill =>
            `<span class="skill-tag">${skill}</span>`
        ).join('');
    } else {
        skillsContainer.innerHTML = '<span class="no-data">No skills listed</span>';
    }

    // Display certificates
    const certContainer = document.getElementById('detailCertificates');
    if (profile.certificates && profile.certificates.length > 0) {
        certContainer.innerHTML = profile.certificates.map(cert =>
            `<div class="cert-item">
                <i class="fas fa-file-pdf"></i>
                <span>${cert.name}</span>
                <small>(${formatFileSize(cert.size)})</small>
            </div>`
        ).join('');
    } else {
        certContainer.innerHTML = '<p class="no-data">No certificates uploaded</p>';
    }

    // Display timestamps
    if (profile.timestamp) {
        const createdDate = new Date(profile.timestamp).toLocaleDateString();
        document.getElementById('profileCreated').textContent = createdDate;
        document.getElementById('lastUpdated').textContent = createdDate;
    }

    // Update profile status
    const isComplete = isProfileComplete();
    const statusElement = document.getElementById('profileStatus');
    if (isComplete) {
        statusElement.textContent = 'Complete';
        statusElement.className = 'status-badge complete';
    } else {
        statusElement.textContent = 'Incomplete';
        statusElement.className = 'status-badge incomplete';
    }

    // Update trust score
    updateTrustScore();
    const scoreElement = document.getElementById('currentTrustScore');
    if (scoreElement) {
        const score = calculateTrustScore(profile);
        scoreElement.textContent = `${score}%`;
    }
}


function showEditForm() {
    const savedProfile = localStorage.getItem('hackaholics_profile');
    if (!savedProfile) {
        showNotification('No profile found to edit!', 'error');
        return;
    }

    try {
        const profile = JSON.parse(savedProfile);

        // Populate form fields
        document.getElementById('editFullName').value = profile.fullName || '';
        document.getElementById('editEmail').value = profile.email || '';
        document.getElementById('editPhone').value = profile.phone || '';
        document.getElementById('editDegree').value = profile.degree || '';
        document.getElementById('editYear').value = profile.year || '';
        document.getElementById('editLocation').value = profile.location || '';
        document.getElementById('editSkills').value = profile.skills ? profile.skills.join(', ') : '';
        document.getElementById('editInterests').value = profile.interests || '';

        // Show edit form, hide display
        document.getElementById('profileDisplay').classList.add('hidden');
        document.getElementById('editProfileForm').classList.remove('hidden');

        // Attach submit listener for editing
        const editForm = document.getElementById('profileEditForm');
        editForm.addEventListener('submit', updateProfile);

        // Scroll to form
        document.getElementById('editProfileForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading profile for editing:', error);
        showNotification('Error loading profile for editing!', 'error');
    }
}

function hideEditForm() {
    document.getElementById('profileDisplay').classList.remove('hidden');
    document.getElementById('editProfileForm').classList.add('hidden');
    resetEditForm();
}

function resetEditForm() {
    document.getElementById('profileEditForm').reset();
}

function updateProfile(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('profileEditForm'));
    const updatedProfile = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        degree: formData.get('degree'),
        year: formData.get('year'),
        location: formData.get('location'),
        skills: formData.get('skills').split(',').map(skill => skill.trim()).filter(skill => skill),
        interests: formData.get('interests'),
        certificates: currentUser.certificates || [],
        timestamp: new Date().toISOString()
    };

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'degree', 'year', 'location', 'skills', 'interests'];
    const missingFields = requiredFields.filter(field => !updatedProfile[field] || updatedProfile[field].toString().trim() === '');

    if (missingFields.length > 0) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }

    // Save updated profile
    saveUserProfile(updatedProfile);

    // Update UI
    displayProfileData(updatedProfile);
    hideEditForm();

    showNotification('Profile updated successfully!', 'success');

    // Redirect to trust score after update
    setTimeout(() => {
        window.location.href = 'trust-score.html';
    }, 1500);
}

function deleteProfile() {
    if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
        localStorage.removeItem('hackaholics_profile');
        currentUser = null;
        uploadedFiles = [];

        showNotification('Profile deleted successfully. You will be redirected to create a new profile.', 'info');

        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function calculateTrustScore(profile) {
    if (!profile) return 0;

    let profileScore = 0;
    let certScore = 0;
    let skillsScore = 0;

    // Profile completeness (40% weight)
    const requiredFields = ['fullName', 'email', 'phone', 'degree', 'year', 'location', 'skills', 'interests'];
    const completedFields = requiredFields.filter(field => profile[field] && profile[field].toString().trim() !== '');
    profileScore = (completedFields.length / requiredFields.length) * 40;

    // Certificate verification (35% weight)
    if (profile.certificates && profile.certificates.length > 0) {
        certScore = Math.min(profile.certificates.length * 15, 35);
    }

    // Skills validation (25% weight)
    if (profile.skills && profile.skills.length > 0) {
        const skillCount = profile.skills.length;
        if (skillCount >= 5) skillsScore = 25;
        else if (skillCount >= 3) skillsScore = 20;
        else if (skillCount >= 1) skillsScore = 15;
    }

    return Math.round(profileScore + certScore + skillsScore);
}

// Event Listeners for Profile Management
document.addEventListener('DOMContentLoaded', function() {
    addNotificationStyles();
    showProfileCheckLoading();

    // Profile page specific initialization
    if (window.location.pathname.includes('profile.html')) {
        loadProfileData();

        // Edit profile button
        const editBtn = document.getElementById('editProfileBtn');
        if (editBtn) {
            editBtn.addEventListener('click', showEditForm);
        }

        // Cancel edit button
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', hideEditForm);
        }

        // Reset form button
        const resetBtn = document.getElementById('resetFormBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetEditForm);
        }

        // Delete profile button
        const deleteBtn = document.getElementById('deleteProfileBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                document.getElementById('deleteModal').classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        }

        // Modal close buttons
        const closeModalBtn = document.getElementById('closeModalBtn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                document.getElementById('deleteModal').classList.add('hidden');
                document.body.style.overflow = '';
            });
        }

        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', function() {
                document.getElementById('deleteModal').classList.add('hidden');
                document.body.style.overflow = '';
            });
        }

        // Confirm delete button
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', deleteProfile);
        }

        // Close modal on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.getElementById('deleteModal');
                if (modal && !modal.classList.contains('hidden')) {
                    modal.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            }
        });
    }
});

// Quiz Functionality
let currentQuestionIndex = 0;
let quizAnswers = [];
let quizStartTime = null;

const quizQuestions = [
    {
        question: "What is your primary goal for participating in internships?",
        options: [
            "Gain practical experience in my field",
            "Build my professional network",
            "Learn new technologies and skills",
            "Improve my resume for future job applications",
            "Explore different career paths"
        ]
    },
    {
        question: "How many programming languages are you proficient in?",
        options: [
            "None - I'm just starting out",
            "1-2 languages",
            "3-4 languages",
            "5 or more languages"
        ]
    },
    {
        question: "How would you rate your problem-solving skills?",
        options: [
            "Beginner - I need guidance for most problems",
            "Intermediate - I can solve problems with some help",
            "Advanced - I can solve complex problems independently",
            "Expert - I excel at solving challenging problems"
        ]
    },
    {
        question: "How comfortable are you with collaborative work environments?",
        options: [
            "Not comfortable - I prefer working alone",
            "Somewhat comfortable - I can work in teams when necessary",
            "Very comfortable - I enjoy team collaboration",
            "Extremely comfortable - I thrive in collaborative settings"
        ]
    },
    {
        question: "What is your experience level with version control systems like Git?",
        options: [
            "No experience",
            "Basic - I know the fundamentals",
            "Intermediate - I use it regularly for projects",
            "Advanced - I can handle complex branching and merging"
        ]
    },
    {
        question: "How do you typically approach learning new technologies?",
        options: [
            "I need structured courses or tutorials",
            "I learn by doing small projects",
            "I combine multiple learning methods",
            "I prefer self-directed learning and experimentation"
        ]
    },
    {
        question: "What type of work environment do you prefer?",
        options: [
            "Strict office hours with clear guidelines",
            "Flexible hours with some structure",
            "Mostly remote work",
            "Dynamic startup environment"
        ]
    },
    {
        question: "How important is work-life balance to you?",
        options: [
            "Not very important - I'm willing to work long hours",
            "Somewhat important - I need some balance",
            "Very important - I prioritize personal time",
            "Extremely important - It's a deal-breaker for me"
        ]
    }
];

function startQuiz() {
    currentQuestionIndex = 0;
    quizAnswers = [];
    quizStartTime = new Date();

    showQuizModal();
    displayCurrentQuestion();
}

function showQuizModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'quizModal';
    modal.innerHTML = `
        <div class="modal-content quiz-modal">
            <div class="modal-header">
                <h3>Trust Score Assessment Quiz</h3>
                <p>Answer these questions to improve your trust score</p>
            </div>
            <div class="modal-body">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="quizProgressFill"></div>
                    </div>
                    <div class="progress-text">
                        Question <span id="currentQuestionNum">1</span> of ${quizQuestions.length}
                    </div>
                </div>
                <div class="quiz-question" id="quizQuestion">
                    <!-- Question content will be inserted here -->
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="prevQuestionBtn" style="display: none;">Previous</button>
                <button class="btn btn-success" id="nextQuestionBtn">Next</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    document.getElementById('nextQuestionBtn').addEventListener('click', nextQuestion);
    document.getElementById('prevQuestionBtn').addEventListener('click', previousQuestion);

    // Close modal on escape
    document.addEventListener('keydown', handleQuizKeydown);
}

function displayCurrentQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const questionContainer = document.getElementById('quizQuestion');

    questionContainer.innerHTML = `
        <h4>${question.question}</h4>
        <div class="quiz-options">
            ${question.options.map((option, index) => `
                <div class="quiz-option" data-option-index="${index}">
                    <input type="radio" name="quiz-option" value="${index}" id="option-${index}">
                    <div class="radio-custom"></div>
                    <label for="option-${index}">${option}</label>
                </div>
            `).join('')}
        </div>
    `;

    // Update progress
    updateQuizProgress();

    // Add click handlers for options
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            selectQuizOption(this);
        });
    });

    // Pre-select if already answered
    if (quizAnswers[currentQuestionIndex] !== undefined) {
        const selectedOption = document.querySelector(`input[value="${quizAnswers[currentQuestionIndex]}"]`);
        if (selectedOption) {
            selectedOption.checked = true;
            selectedOption.closest('.quiz-option').classList.add('selected');
        }
    }

    // Update button states
    updateQuizButtons();
}

function selectQuizOption(optionElement) {
    const optionIndex = parseInt(optionElement.dataset.optionIndex);
    const radio = optionElement.querySelector('input[type="radio"]');

    // Unselect all options
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));

    // Select this option
    optionElement.classList.add('selected');
    radio.checked = true;

    // Store answer
    quizAnswers[currentQuestionIndex] = optionIndex;
}

function updateQuizProgress() {
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('quizProgressFill').style.width = `${progress}%`;
    document.getElementById('currentQuestionNum').textContent = currentQuestionIndex + 1;
}

function updateQuizButtons() {
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');

    prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';

    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextBtn.textContent = 'Finish Quiz';
    } else {
        nextBtn.textContent = 'Next';
    }
}

function nextQuestion() {
    if (quizAnswers[currentQuestionIndex] === undefined) {
        showNotification('Please select an answer before proceeding.', 'error');
        return;
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion();
    } else {
        finishQuiz();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayCurrentQuestion();
    }
}

function finishQuiz() {
    const quizTime = Math.round((new Date() - quizStartTime) / 1000); // Time in seconds

    // Calculate quiz score based on answers
    const quizScore = calculateQuizScore();

    // Update user profile with quiz results
    updateProfileWithQuizResults(quizScore, quizTime);

    // Close modal
    closeQuizModal();

    // Show results
    showQuizResults(quizScore);
}

function calculateQuizScore() {
    // Simple scoring based on answer patterns
    // This is a basic implementation - could be made more sophisticated
    let score = 0;

    quizAnswers.forEach((answer, index) => {
        // Weight answers based on question importance
        const weights = [1, 1.2, 1.5, 1, 1.3, 1.2, 1, 1.1];
        score += (answer + 1) * weights[index]; // +1 because answers are 0-indexed
    });

    // Normalize to 0-100 scale
    const maxPossibleScore = quizQuestions.reduce((sum, _, index) => {
        const weights = [1, 1.2, 1.5, 1, 1.3, 1.2, 1, 1.1];
        return sum + 4 * weights[index]; // Max answer index is 3 (4 options)
    }, 0);

    return Math.round((score / maxPossibleScore) * 100);
}

function updateProfileWithQuizResults(quizScore, quizTime) {
    const savedProfile = localStorage.getItem('hackaholics_profile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        profile.quizScore = quizScore;
        profile.quizTime = quizTime;
        profile.quizCompleted = true;
        profile.lastUpdated = new Date().toISOString();

        localStorage.setItem('hackaholics_profile', JSON.stringify(profile));
        currentUser = profile;

        // Update trust score
        updateTrustScore();
    }
}

function showQuizResults(quizScore) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content quiz-modal">
            <div class="modal-header">
                <h3>Quiz Completed!</h3>
                <p>Your assessment results</p>
            </div>
            <div class="modal-body">
                <div class="quiz-results">
                    <div class="score-circle" style="width: 150px; height: 150px; margin: 0 auto 2rem;">
                        <div style="position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; height: 100%;">
                            <span style="font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${quizScore}%</span>
                        </div>
                    </div>
                    <h4 style="text-align: center; margin-bottom: 1rem; color: #1a202c;">Assessment Score</h4>
                    <p style="text-align: center; color: #64748b; margin-bottom: 2rem;">
                        ${getQuizFeedback(quizScore)}
                    </p>
                    <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0;">
                        <h5 style="margin-bottom: 1rem; color: #1a202c;">What this means:</h5>
                        <ul style="color: #4a5568; line-height: 1.6;">
                            <li>Your trust score has been updated with your assessment results</li>
                            <li>Internship matches will be more accurate based on your responses</li>
                            <li>You can retake the quiz anytime to improve your score</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-success" onclick="closeQuizResults()">Continue</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function getQuizFeedback(score) {
    if (score >= 90) return "Excellent! You demonstrate strong readiness for internships.";
    if (score >= 80) return "Great job! You're well-prepared for internship opportunities.";
    if (score >= 70) return "Good work! You have solid foundations for success.";
    if (score >= 60) return "Not bad! Consider building on your strengths.";
    return "Keep learning! Focus on developing your skills further.";
}

function closeQuizModal() {
    const modal = document.getElementById('quizModal');
    if (modal) {
        modal.remove();
    }
    document.removeEventListener('keydown', handleQuizKeydown);
}

function closeQuizResults() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }

    // Refresh the page to show updated trust score
    location.reload();
}

function handleQuizKeydown(e) {
    if (e.key === 'Escape') {
        closeQuizModal();
    }
}

// Logout functionality
function logout() {
    localStorage.removeItem('hackaholics_profile');
    currentUser = null;
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Add quiz button event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const quizBtn = document.getElementById('takeQuizBtn');
    if (quizBtn) {
        quizBtn.addEventListener('click', startQuiz);
    }
});

