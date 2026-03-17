// Multi-Step Form Handler
let currentStep = 1;
const totalSteps = 5;

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
    loadFormData(); // Auto-load saved data
}

// Show specific step
function showStep(step) {
    formSteps.forEach((formStep, index) => {
        formStep.classList.remove('active');
        if (index === step - 1) {
            formStep.classList.add('active');
        }
    });
    
    // Update progress steps
    progressSteps.forEach((progressStep, index) => {
        progressStep.classList.remove('active', 'completed');
        if (index === step - 1) {
            progressStep.classList.add('active');
        } else if (index < step - 1) {
            progressStep.classList.add('completed');
        }
    });
    
    // Update buttons
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
        saveFormData(); // Auto-save
        currentStep++;
        showStep(currentStep);
    } else {
        alert('⚠️ Please fill in all required fields');
    }
});

// Previous button
prevBtn.addEventListener('click', () => {
    saveFormData(); // Auto-save
    currentStep--;
    showStep(currentStep);
});

// Auto-save form data to localStorage
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

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
        alert('⚠️ Please fill in all required fields');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'TRANSMITTING...';
    
    const formData = new FormData(form);
    
    // Prepare message for Telegram
    let message = '🚨 NEW MISSING PERSON REPORT\n\n';
    message += '━━━━━━━━━━━━━━━━━━━━\n';
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
    
    // Send to Telegram
    const botToken = '7875653036:AAGJlJCPQqGPbQJJPPKJJJJJJJJJJJJJJJJ'; // Replace with your bot token
    const chatId = '6969696969'; // Replace with your chat ID
    
    try {
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
        
        if (response.ok) {
            // Success
            document.getElementById('successMessage').style.display = 'block';
            form.style.display = 'none';
            localStorage.removeItem('n3xion_form_data'); // Clear saved data
        } else {
            throw new Error('Failed to send');
        }
    } catch (error) {
        // Error
        document.getElementById('errorMessage').style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'TRANSMIT ENCRYPTED REPORT';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
