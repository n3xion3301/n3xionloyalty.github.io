document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const files = document.getElementById('files').files;

    // Your Telegram Bot Token and Chat ID - REPLACE THESE
    const botToken = '8730957980:AAHhIK5kkPMUtpN23sIPW84pKfLWYCuQ63E'; // Replace with your bot token
    const chatId = '8744522702'; // Replace with your chat ID

    // Show uploading status
    const submitBtn = document.querySelector('.btn-send');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'UPLOADING...';
    submitBtn.disabled = true;

    try {
        // Format and send text message
        const textMessage = `🚨 New Missing Person Report\n\n👤 Name: ${name}\n📧 Email: ${email}\n\n📝 Details:\n${message}\n\n📎 Attachments: ${files.length} file(s)`;
        
        const textResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: textMessage,
                parse_mode: 'HTML'
            })
        });

        if (!textResponse.ok) {
            throw new Error('Failed to send message');
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

                const formData = new FormData();
                formData.append('chat_id', chatId);
                formData.append('document', file);
                formData.append('caption', `📎 ${file.name}\nFrom: ${name} (${email})`);

                await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
                    method: 'POST',
                    body: formData
                });
            }
        }

        // Success
        submitBtn.textContent = '✓ TRANSMITTED';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('contactForm').reset();

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            window.open('https://t.me/n3xion3301', '_blank');
        }, 1500);

    } catch (error) {
        console.error('Error:', error);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
    }
});
