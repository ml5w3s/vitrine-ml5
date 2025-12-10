// mlab5/src/utils/OverflowManager.js

import { Debug } from '../helpers/Debug.js';

const OVERFLOW_CLASS = 'is-expanded';
const MEDIA_QUERY = '(min-width: 769px)'; // Apply only on non-mobile screens

function checkAndExpandArticle(articleElement) {
    // Only apply if the media query matches (i.e., not on mobile)
    if (!window.matchMedia(MEDIA_QUERY).matches) {
        articleElement.classList.remove(OVERFLOW_CLASS);
        return;
    }

    // Temporarily remove overflow hidden properties if any to get true scrollWidth
    // Store original computed styles to restore accurately
    const computedStyle = window.getComputedStyle(articleElement);
    const originalOverflowX = computedStyle.overflowX;
    const originalOverflow = computedStyle.overflow;
    
    articleElement.style.overflowX = 'visible';
    articleElement.style.overflow = 'visible';

    const isOverflowing = articleElement.scrollWidth > articleElement.clientWidth;

    // Restore original overflow properties. Use style.setProperty to revert to computed if original was empty
    articleElement.style.overflowX = originalOverflowX === 'visible' ? '' : originalOverflowX;
    articleElement.style.overflow = originalOverflow === 'visible' ? '' : originalOverflow;


    if (isOverflowing) {
        if (!articleElement.classList.contains(OVERFLOW_CLASS)) {
            articleElement.classList.add(OVERFLOW_CLASS);
            Debug.log('OverflowManager', `Expanded article:`, articleElement);
        }
    } else {
        if (articleElement.classList.contains(OVERFLOW_CLASS)) {
            articleElement.classList.remove(OVERFLOW_CLASS);
            Debug.log('OverflowManager', `Shrank article:`, articleElement);
        }
    }
}

function processArticles() {
    Debug.log('OverflowManager', 'Processing articles for overflow...');
    // Target relevant articles. Adjust selector if needed.
    const articles = document.querySelectorAll('.item-article, article.item');
    articles.forEach(checkAndExpandArticle);
}

let resizeTimer;
function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(processArticles, 200); // Debounce resize events
}

export function initOverflowManager(eventBus) {
    // Initial check
    processArticles();

    // Re-check on window resize
    window.addEventListener('resize', handleResize);

    // Re-check when new content is rendered by the router
    eventBus.subscribe('contentRendered', processArticles);

    Debug.log('OverflowManager', 'Initialized.');
}

export function destroyOverflowManager(eventBus) {
    window.removeEventListener('resize', handleResize);
    eventBus.unsubscribe('contentRendered', processArticles);
    Debug.log('OverflowManager', 'Destroyed.');
}
