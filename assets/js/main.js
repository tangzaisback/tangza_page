document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const toggleBtn = document.getElementById('theme-toggle');

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

const firebaseConfig = {
  apiKey: "REDACTED_API_KEY",
  authDomain: "tangzaisback-563c7.firebaseapp.com",
  projectId: "tangzaisback-563c7",
  storageBucket: "tangzaisback-563c7.firebasestorage.app",
  messagingSenderId: "590553225335",
  appId: "1:590553225335:web:497aff87927e4f512c8e72",
  measurementId: "G-MPFM7ZLEJ5",
  databaseURL: "https://tangzaisback-563c7-default-rtdb.firebaseio.com"
};

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
