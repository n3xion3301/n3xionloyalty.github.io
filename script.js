document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Collect all form data
    const formData = {
        // Reporter Info
        reporterName: document.getElementById('reporterName').value,
        reporterEmail: document.getElementById('reporterEmail').value,
        reporterPhone: document.getElementById('reporterPhone').value,
        relationship: document.getElementById('relationship').value,
        
        // Missing Person Details
        missingName: document.getElementById('missingName').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        hairColor: document.getElementById('hairColor').value,
        eyeColor: document.getElementById('eyeColor').value,
        race: document.getElementById('race').value,
        distinguishingFeatures: document.getElementById('distinguishingFeatures').value,
        
        // Last Seen
        lastSeenDate: document.getElementById('lastSeenDate').value,
        lastSeenTime: document.getElementById('lastSeenTime').value,
        lastSeenLocation: document.getElementById('lastSeenLocation').value,
        lastSeenClothing: document.getElementById('lastSeenClothing').value,
        
        // Circumstances
        circumstances: document.getElementById('circumstances').value,
        medicalConditions: document.getElementById('medicalConditions').value,
        vehicleInfo: document.getElementById('vehicleInfo').value,
        
        // Law Enforcement
        policeReported: document.getElementById('policeReported').value,
        caseNumber: document.getElementById('caseNumber').value,
        policeDepartment: document.getElementById('policeDepartment').value,
        
        // Additional
        additionalInfo: document.getElementById('additionalInfo').value
    };

    const files = document.getElementById('files').files;

    // Your Telegram credentials - REPLACE THESE
    const botToken = '8730957980:AAHhIK5kkPMUtpN23sIPW84pKfLWYCuQ63E';
    const chatId = '8744522702';

    // Show uploading status
    const submitBtn = document.querySelector('.btn-send');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'ENCRYPTING...';
    submitBtn.disabled = true;

    try {
        // Format comprehensive message with Anonymous theme
        const message = `
🎭 ANONYMOUS MISSING PERSON REPORT 🎭

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ WE ARE LEGION - WE DO NOT FORGET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 REPORTER CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Identity: ${formData.reporterName}
📧 Secure Channel: ${formData.reporterEmail}
📱 Contact Line: ${formData.reporterPhone}
🔗 Relationship: ${formData.relationship}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 TARGET PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Full Name: ${formData.missingName}
🎂 Age: ${formData.age}
⚧ Gender: ${formData.gender}
📏 Height: ${formData.height || 'Not provided'}
⚖️ Weight: ${formData.weight || 'Not provided'}
💇 Hair Color: ${formData.hairColor || 'Not provided'}
👁 Eye Color: ${formData.eyeColor || 'Not provided'}
🌍 Race/Ethnicity: ${formData.race || 'Not provided'}
✨ Identifying Marks: ${formData.distinguishingFeatures || 'None reported'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 LAST KNOWN LOCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Date Last Seen: ${formData.lastSeenDate}
🕐 Time: ${formData.lastSeenTime || 'Unknown'}
📌 Location: ${formData.lastSeenLocation}
👕 Clothing: ${formData.lastSeenClothing || 'Not described'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ INCIDENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.circumstances}

💊 Medical Conditions: ${formData.medicalConditions || 'None reported'}
🚗 Vehicle Info: ${formData.vehicleInfo || 'None'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👮 OFFICIAL STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚔 Reported to Authorities: ${formData.policeReported}
📋 Case Number: ${formData.caseNumber || 'Not available'}
🏛 Department: ${formData.policeDepartment || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📎 ENCRYPTED ATTACHMENTS: ${files.length} file(s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ️ Additional Intel:
${formData.additionalInfo || 'None'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Transmission Time: ${new Date().toLocaleString()}
🔐 Status: ENCRYPTED & DISTRIBUTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WE ARE ANONYMOUS
WE ARE LEGION
WE DO NOT FORGIVE
WE DO NOT FORGET
EXPECT US
        `.trim();

        // Update status
        submitBtn.textContent = 'TRANSMITTING...';

        // Send main report
        const textResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!textResponse.ok) {
            throw new Error('Transmission failed');
        }

        // Upload files if any
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                // Check file size (10MB limit for Telegram)
                if (file.size > 10 * 1024 * 1024) {
                    console.warn(`Skipping ${file.name} - file too large (max 10MB)`);
                    continue;
                }

                // Update progress
                submitBtn.textContent = `UPLOADING ${i + 1}/${files.length}...`;

                const fileFormData = new FormData();
                fileFormData.append('chat_id', chatId);
                fileFormData.append('document', file);
                fileFormData.append('caption', `🎭 ANONYMOUS EVIDENCE\n📎 ${file.name}\n👤 Target: ${formData.missingName}\n📧 Reporter: ${formData.reporterEmail}`);

                await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
                    method: 'POST',
                    body: fileFormData
                });
            }
        }

        // Success
        submitBtn.textContent = '✓ TRANSMISSION COMPLETE';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('contactForm').reset();

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            window.open('https://t.me/n3xion3301', '_blank');
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        submitBtn.textContent = '✗ TRANSMISSION FAILED';
        submitBtn.disabled = false;
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
        }, 3000);
    }
});

// Add typing effect on page load
window.addEventListener('load', function() {
    const typingElements = document.querySelectorAll('.typing-effect');
    typingElements.forEach(element => {
        element.style.animation = 'typing 3s steps(60, end)';
    });
});
