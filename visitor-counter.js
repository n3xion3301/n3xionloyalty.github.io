// Visitor Counter
function updateVisitorCount() {
    let count = localStorage.getItem('n3xion_visitor_count');
    
    if (!count) {
        count = Math.floor(Math.random() * 500) + 1000;
    } else {
        count = parseInt(count);
    }
    
    count++;
    localStorage.setItem('n3xion_visitor_count', count);
    
    const counterElement = document.getElementById('visitorCount');
    if (counterElement) {
        animateCounter(counterElement, count);
    }
}

function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 50);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current.toLocaleString();
    }, 20);
}

function animateDashboardStats() {
    const stats = [
        { id: 'activeCases', target: 47 },
        { id: 'resolved', target: 23 },
        { id: 'network', target: 1247 }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            setTimeout(() => {
                animateCounter(element, stat.target);
            }, 500);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateVisitorCount();
    animateDashboardStats();
});
