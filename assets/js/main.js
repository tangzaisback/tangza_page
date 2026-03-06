document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Load saved theme or apply light theme by default
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 2. Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before it hits the bottom
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
});
