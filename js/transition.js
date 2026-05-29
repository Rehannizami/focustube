// ============================================================================
// js/transition.js - Seamless Page Routing
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. PLAY ENTRANCE ANIMATION ON LOAD
    // Set initial hidden state
    document.body.classList.add('page-transition-enter');
    
    // Wait a tiny fraction of a second, then trigger the fade-in
    setTimeout(() => {
        document.body.classList.remove('page-transition-enter');
        document.body.classList.add('page-transition-active');
    }, 50);

    // 2. INTERCEPT ALL LINKS FOR EXIT ANIMATION
    // Selects only internal links (hrefs that start with a slash like /search)
    const links = document.querySelectorAll('a[href^="/"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');

            // Skip interception if we are already on the target page
            if (targetUrl === window.location.pathname) {
                return;
            }

            // Stop the browser from instantly changing the page
            e.preventDefault();

            // Swap the CSS classes to trigger the exit animation
            document.body.classList.remove('page-transition-active');
            document.body.classList.add('page-transition-exit');

            // Wait exactly 300ms (matching our CSS duration) then manually load the page
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 300); 
        });
    });
});