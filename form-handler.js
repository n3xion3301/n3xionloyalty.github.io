// Multi-Step Form Handler
let currentStep = 1;
const totalSteps = 5;

// API Configuration
const API_URL = 'https://trackmissingprofile-api-production.up.railway.app';

// Get elements
const formSteps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');
const progressLine = document.getElementById('progressLine');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('contactForm');

// Initialize
function init() {
    showStep(currentStep);
    updateProgressBar();
    loadFormData();
}

// Show specific step
function showStep(step) {
    formSteps.forEach((formStep, index) => {
        formStep.classList.remove('active');
        if (index === step - 1) {
            formStep.classList.add('active');
        }
    });

    progressSteps.forEach((progressStep, index) => {
        progressStep.classList.remove('active', 'completed');
        if (index === step - 1) {
            progressStep.classList.add('active');
        } else if (index < step - 1) {
            progressStep.classList.add('completed');
        }
    });

    prevBtn.disabled = (step === 1);

    if (step === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }

    updateProgressBar();
}

// Update progress bar width
function updateProgressBar() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressLine.style.width = progress + '%';
}

// Validate current step
function validateStep(step) {
    const currentFormStep = formSteps[step - 1];
    const inputs = currentFormStep.querySelectorAll('input[required], select[required], textarea[required]');

    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff0000';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }
    });

    return isValid;
}

// Next button
nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
        saveFormData();
        currentStep++;
        showStep(currentStep);
    } else {
        alert('⚠️ Please fill in all required fields');
    }
});

// Previous button
prevBtn.addEventListener('click', () => {
    saveFormData();
    currentStep--;
    showStep(currentStep);
});

// Auto-save form data
function saveFormData() {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    localStorage.setItem('n3xion_form_data', JSON.stringify(data));
}

// Load saved form data
function loadFormData() {
    const savedData = localStorage.getItem('n3xion_form_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
    }
}

// Split full name into first and last
function splitName(fullName) {
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || parts[0]; // Use first name as last if only one word
    return { firstName, lastName };
}

// Calculate approximate birth year from age
function calculateBirthDate(age) {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - parseInt(age);
    return `${birthYear}-01-01`; // Approximate to January 1st
}

// Send to Railway API
async function sendToAPI(formData) {
    const missingName = splitName(formData.get('missingName'));
    
    const apiData = {
        first_name: missingName.firstName,
        last_name: missingName.lastName,
        date_of_birth: calculateBirthDate(formData.get('age')),
        gender: formData.get('gender'),
        height: formData.get('height') || null,
        weight: formData.get('weight') || null,
        distinguishing_features: formData.get('distinguishingFeatures') || null,
        last_seen_location: formData.get('lastSeenLocation'),
        last_seen_date: formData.get('lastSeenDate'),
        last_seen_clothing: formData.get('lastSeenClothing') || null,
        medical_conditions: formData.get('medicalConditions') || null,
        contact_person: formData.get('reporterName'),
        contact_phone: formData.get('reporterPhone'),
        contact_email: formData.get('reporterEmail')
    };

    const response = await fetch(`${API_URL}/api/missing-persons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    return await response.json();
}

// Send to Telegram
async function sendToTelegram(formData, apiResponse) {
    let message = '🚨 NEW MISSING PERSON REPORT\n\n';
    message += '━━━━━━━━━━━━━━━━━━━━\n';
    message += `🆔 CASE ID: #${apiResponse.id}\n\n`;
    
    message += '👤 REPORTER INFO:\n';
    message += `Name: ${formData.get('reporterName')}\n`;
    message += `Email: ${formData.get('reporterEmail')}\n`;
    message += `Phone: ${formData.get('reporterPhone')}\n`;
    message += `Relationship: ${formData.get('relationship')}\n\n`;

    message += '━━━━━━━━━━━━━━━━━━━━\n';
    message += '🎯 MISSING PERSON:\n';
    message += `Name: ${formData.get('missingName')}\n`;
    message += `Age: ${formData.get('age')}\n`;
    message += `Gender: ${formData.get('gender')}\n`;
    message += `Height: ${formData.get('height') || 'N/A'}\n`;
    message += `Weight: ${formData.get('weight') || 'N/A'}\n`;
    message += `Hair: ${formData.get('hairColor') || 'N/A'}\n`;
    message += `Eyes: ${formData.get('eyeColor') || 'N/A'}\n`;
    message += `Race: ${formData.get('race') || 'N/A'}\n`;
    message += `Marks: ${formData.get('distinguishingFeatures') || 'N/A'}\n\n`;

    message += '━━━━━━━━━━━━━━━━━━━━\n';
    message += '📍 LAST SEEN:\n';
    message += `Date: ${formData.get('lastSeenDate')}\n`;
    message += `Time: ${formData.get('lastSeenTime') || 'N/A'}\n`;
    message += `Location: ${formData.get('lastSeenLocation')}\n`;
    message += `Clothing: ${formData.get('lastSeenClothing') || 'N/A'}\n\n`;

    message += '━━━━━━━━━━━━━━━━━━━━\n';
    message += '📋 DETAILS:\n';
    message += `Circumstances: ${formData.get('circumstances')}\n`;
    message += `Medical: ${formData.get('medicalConditions') || 'N/A'}\n`;
    message += `Vehicle: ${formData.get('vehicleInfo') || 'N/A'}\n\n`;

    message += '━━━━━━━━━━━━━━━━━━━━\n';
    message += '🚔 POLICE STATUS:\n';
    message += `Reported: ${formData.get('policeReported')}\n`;
    message += `Case #: ${formData.get('caseNumber') || 'N/A'}\n`;
    message += `Department: ${formData.get('policeDepartment') || 'N/A'}\n\n`;

    if (formData.get('additionalInfo')) {
        message += '━━━━━━━━━━━━━━━━━━━━\n';
        message += `ℹ️ Additional: ${formData.get('additionalInfo')}\n\n`;
    }

    message += '━━━━━━━━━━━━━━━━━━━━\n';
    message += `⏰ Submitted: ${new Date().toLocaleString()}\n`;
    message += `🔗 View: ${API_URL}/api/missing-persons/${apiResponse.id}\n`;

    const botToken = '7875653036:AAGJlJCPQqGPbQJJPPKJJJJJJJJJJJJJJJJ';
    const chatId = '6969696969';

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    });

    if (!response.ok) {
        throw new Error('Telegram send failed');
    }
}

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
        alert('⚠️ Please fill in all required fields');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'TRANSMITTING...';

    const formData = new FormData(form);

    try {
        // Send to Railway API first
        const apiResponse = await sendToAPI(formData);
        
        // Then send to Telegram with case ID
        await sendToTelegram(formData, apiResponse);

        // Success
        const successMsg = document.getElementById('successMessage');
        if (successMsg) {
            successMsg.innerHTML = `
                <h3>✅ REPORT TRANSMITTED SUCCESSFULLY</h3>
                <p>Case ID: <strong>#${apiResponse.id}</strong></p>
                <p>Your report has been encrypted and transmitted to our network.</p>
                <p>We will begin investigation immediately.</p>
            `;
            successMsg.style.display = 'block';
        }
        form.style.display = 'none';
        localStorage.removeItem('n3xion_form_data');

    } catch (error) {
        console.error('Submission error:', error);
        const errorMsg = document.getElementById('errorMessage');
        if (errorMsg) {
            errorMsg.style.display = 'block';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'TRANSMIT ENCRYPTED REPORT';
        alert('⚠️ Transmission failed. Please try again or contact us directly.');
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
