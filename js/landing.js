// ============================================================================
// js/landing.js - Premium Scroll Hijack Navigation
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    let isNavigating = false;

    // The animation function
    const transitionToDocs = () => {
        if (isNavigating) return;
        isNavigating = true;

        // 1. Force the body to animate upwards
        document.body.style.transition = 'transform 0.7s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.7s ease';
        document.body.style.transform = 'translateY(-100vh)';
        document.body.style.opacity = '0';

        // 2. Wait for the animation to finish, then actually load the next page
        setTimeout(() => {
            window.location.href = '/documentation';
        }, 650); // Matches the CSS transition time
    };

    // Listen for Mouse Wheel / Trackpad scrolls
    window.addEventListener('wheel', (e) => {
        // If the user scrolls down aggressively (deltaY is positive)
        if (e.deltaY > 40) {
            transitionToDocs();
        }
    });

    // Listen for Mobile Touch Swipes
    let touchStartY = 0;
    
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        let touchEndY = e.changedTouches[0].screenY;
        
        // If the user swiped UP by more than 50 pixels (meaning they are scrolling down the page)
        if (touchStartY - touchEndY > 50) {
            transitionToDocs();
        }
    }, { passive: true });
});