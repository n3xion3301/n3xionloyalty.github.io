document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Format message for Telegram
    const telegramMessage = `New Contact Form Submission:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    
    // Your Telegram Bot Token and Chat ID
    const botToken = 'YOUR_BOT_TOKEN'; // Replace with your bot token
    const chatId = 'YOUR_CHAT_ID'; // Replace with your chat ID
    
    // Send to Telegram via bot API
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('errorMessage').style.display = 'none';
            document.getElementById('contactForm').reset();
            
            // Open Telegram after 1 second
            setTimeout(() => {
                window.open('https://t.me/n3xion3301', '_blank');
            }, 1000);
        } else {
            throw new Error('Failed to send message');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
    });
});
