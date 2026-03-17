// API Configuration
const API_URL = 'https://trackmissingprofile-api-production.up.railway.app/api/missing-persons';

let allCases = [];
let filteredCases = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCases();
    setupEventListeners();
});

// Load cases from API
async function loadCases() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        allCases = data.missing_persons || [];
        filteredCases = allCases;
        
        updateStats();
        displayCases(filteredCases);
    } catch (error) {
        console.error('Error loading cases:', error);
        document.getElementById('casesGrid').innerHTML = 
            '<div class="no-results">⚠️ ERROR LOADING CASES. PLEASE TRY AGAIN LATER.</div>';
    }
}

// Display cases in grid
function displayCases(cases) {
    const grid = document.getElementById('casesGrid');
    
    if (cases.length === 0) {
        grid.innerHTML = '<div class="no-results">NO CASES FOUND</div>';
        return;
    }
    
    grid.innerHTML = cases.map(caseData => {
        const age = calculateAge(caseData.date_of_birth);
        const daysAgo = calculateDaysAgo(caseData.last_seen_date);
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(caseData.last_seen_location)}`;
        
        return `
            <div class="case-card" data-id="${caseData.id}">
                <div class="case-id">#${caseData.id}</div>
                
                <div class="case-photo">
                    ${caseData.photo_url 
                        ? `<img src="${caseData.photo_url}" alt="${caseData.first_name} ${caseData.last_name}">` 
                        : '<div class="no-photo">NO PHOTO AVAILABLE</div>'
                    }
                </div>
                
                <div class="case-name">
                    ${caseData.first_name} ${caseData.last_name}
                </div>
                
                <div class="case-details">
                    <strong>Age:</strong> ${age} years old<br>
                    <strong>Gender:</strong> ${caseData.gender || 'Unknown'}<br>
                    ${caseData.height ? `<strong>Height:</strong> ${caseData.height}<br>` : ''}
                    ${caseData.weight ? `<strong>Weight:</strong> ${caseData.weight}<br>` : ''}
                    ${caseData.distinguishing_features ? `<strong>Features:</strong> ${caseData.distinguishing_features}<br>` : ''}
                    
                    <div class="case-location">
                        <strong>Last Seen:</strong> ${formatDate(caseData.last_seen_date)} (${daysAgo} days ago)<br>
                        <strong>Location:</strong> ${caseData.last_seen_location}<br>
                        ${caseData.last_seen_clothing ? `<strong>Clothing:</strong> ${caseData.last_seen_clothing}<br>` : ''}
                        
                        <a href="${mapUrl}" target="_blank" class="view-map-btn">
                            📍 VIEW ON MAP
                        </a>
                    </div>
                </div>
                
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0, 255, 0, 0.3);">
                    <strong>Contact:</strong> ${caseData.contact_person}<br>
                    <strong>Phone:</strong> ${caseData.contact_phone}
                </div>
            </div>
        `;
    }).join('');
}

// Update statistics
function updateStats() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisWeek = allCases.filter(c => new Date(c.created_at) >= oneWeekAgo).length;
    const thisMonth = allCases.filter(c => new Date(c.created_at) >= oneMonthAgo).length;
    
    document.getElementById('totalCases').textContent = allCases.length;
    document.getElementById('thisMonth').textContent = thisMonth;
    document.getElementById('thisWeek').textContent = thisWeek;
}

// Setup event listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filteredCases = allCases.filter(c => 
            c.first_name.toLowerCase().includes(query) ||
            c.last_name.toLowerCase().includes(query) ||
            c.last_seen_location.toLowerCase().includes(query) ||
            c.id.toString().includes(query)
        );
        displayCases(filteredCases);
    });
    
    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            applyFilter(filter);
        });
    });
}

// Apply filter
function applyFilter(filter) {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    switch(filter) {
        case 'all':
            filteredCases = allCases;
            break;
        case 'male':
            filteredCases = allCases.filter(c => c.gender && c.gender.toLowerCase() === 'male');
            break;
        case 'female':
            filteredCases = allCases.filter(c => c.gender && c.gender.toLowerCase() === 'female');
            break;
        case 'recent':
            filteredCases = allCases.filter(c => new Date(c.last_seen_date) >= sevenDaysAgo);
            break;
        case 'children':
            filteredCases = allCases.filter(c => calculateAge(c.date_of_birth) < 18);
            break;
        default:
            filteredCases = allCases;
    }
    
    displayCases(filteredCases);
}

// Calculate age from birth date
function calculateAge(birthDate) {
    if (!birthDate) return 'Unknown';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Calculate days ago
function calculateDaysAgo(date) {
    const then = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - then);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}
