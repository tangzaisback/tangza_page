document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const applyThemeToggle = (btn) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    };
    applyThemeToggle(document.getElementById('theme-toggle'));
    applyThemeToggle(document.getElementById('theme-toggle-mobile'));

    // 2. Mobile Hamburger Menu
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = menuBtn.classList.toggle('is-open');
            mobileMenu.classList.toggle('is-open', isOpen);
            menuBtn.setAttribute('aria-expanded', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
        });

        // 메뉴 항목 클릭 시 닫기
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('is-open');
                mobileMenu.classList.remove('is-open');
                menuBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
            });
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

    // 3. Active navigation highlight
    const currentPath = window.location.pathname;
    document.querySelectorAll('a.cate-title').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const linkBase = href.replace(/\/$/, '').split('/').pop();
        if (linkBase && currentPath.includes(linkBase)) {
            link.classList.add('cate-title-active');
        }
    });
});

// ==========================================
// 3. Firebase Anonymous Like Button Logic
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Logic only executes if there's a like button on the page
const likeBtn = document.getElementById('like-btn');
if (likeBtn) {
    const likeCountSpan = document.getElementById('like-count');
    const heartIconSpan = likeBtn.querySelector('.heart-icon');
    
    // Create a safe database key from the URL (replacing invalid characters like . # $ [ ] /)
    const rawUrl = likeBtn.getAttribute('data-url');
    // e.g. "/2022/05/30/post_1.html" -> "2022_05_30_post_1_html"
    const dbKey = rawUrl.replace(/[.#$\[\]\/]/g, '_'); 
    const likesRef = ref(db, 'likes/' + dbKey);

    // 1. Realtime listener for the like count
    onValue(likesRef, (snapshot) => {
        const data = snapshot.val();
        const currentLikes = data ? data.count : 0;
        likeCountSpan.innerText = currentLikes;
    });

    // Check if user already liked this post (locally)
    const hasLiked = localStorage.getItem('liked_' + dbKey);
    if (hasLiked) {
        heartIconSpan.innerText = '🍅';
        likeBtn.classList.add('liked');
    }

    // 2. Click event to increment likes
    likeBtn.addEventListener('click', () => {
        if (localStorage.getItem('liked_' + dbKey)) {
            // Already liked! We could allow unlike, but let's keep it simple.
            return; 
        }

        // Run transaction to safely increment even if multiple people click at once
        runTransaction(likesRef, (currentData) => {
            if (currentData === null) {
                return { count: 1 };
            } else {
                return { count: currentData.count + 1 };
            }
        }).then(() => {
            // Success
            localStorage.setItem('liked_' + dbKey, 'true');
            heartIconSpan.innerText = '🍅';
            likeBtn.classList.add('liked');
            
            // Add a little pop animation
            likeBtn.style.transform = 'scale(1.2)';
            setTimeout(() => likeBtn.style.transform = 'scale(1)', 200);
        }).catch((error) => {
            console.error('Like transaction failed: ', error);
        });
    });
}
