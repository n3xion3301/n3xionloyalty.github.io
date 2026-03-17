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
    submitBtn.textContent = 'SUBMITTING...';
    submitBtn.disabled = true;

    try {
        // Format comprehensive message
        const message = `
🚨 MISSING PERSON REPORT 🚨

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 REPORTER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${formData.reporterName}
📧 Email: ${formData.reporterEmail}
📱 Phone: ${formData.reporterPhone}
🔗 Relationship: ${formData.relationship}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 MISSING PERSON DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${formData.missingName}
🎂 Age: ${formData.age}
⚧ Gender: ${formData.gender}
📏 Height: ${formData.height || 'Not provided'}
⚖️ Weight: ${formData.weight || 'Not provided'}
💇 Hair: ${formData.hairColor || 'Not provided'}
👁 Eyes: ${formData.eyeColor || 'Not provided'}
🌍 Race/Ethnicity: ${formData.race || 'Not provided'}
✨ Distinguishing Features: ${formData.distinguishingFeatures || 'None reported'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 LAST SEEN INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Date: ${formData.lastSeenDate}
🕐 Time: ${formData.lastSeenTime || 'Unknown'}
📌 Location: ${formData.lastSeenLocation}
👕 Clothing: ${formData.lastSeenClothing || 'Not described'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CIRCUMSTANCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.circumstances}

💊 Medical Info: ${formData.medicalConditions || 'None reported'}
🚗 Vehicle: ${formData.vehicleInfo || 'None'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👮 LAW ENFORCEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚔 Reported to Police: ${formData.policeReported}
📋 Case Number: ${formData.caseNumber || 'Not available'}
🏛 Department: ${formData.policeDepartment || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📎 ATTACHMENTS: ${files.length} file(s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ️ Additional Information:
${formData.additionalInfo || 'None'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Submitted: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

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
            throw new Error('Failed to send report');
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
                fileFormData.append('caption', `📎 ${file.name}\n👤 Missing: ${formData.missingName}\n📧 Reporter: ${formData.reporterEmail}`);

                await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
                    method: 'POST',
                    body: fileFormData
                });
            }
        }

        // Success
        submitBtn.textContent = '✓ REPORT SUBMITTED';
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
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
    }
});
