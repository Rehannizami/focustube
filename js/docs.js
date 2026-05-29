// ============================================================================
// js/docs.js - Documentation Interactions & Scroll Spy
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initCodeCopy();
    initScrollSpy();
});

/**
 * 1. Code Block Copy Functionality
 * Finds all copy buttons, extracts the text from the adjacent <code> block,
 * writes it to the clipboard, and triggers a visual success state.
 */
function initCodeCopy() {
    const copyButtons = document.querySelectorAll('.btn-copy-code');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            // Traverse the DOM to find the exact text inside the code block
            const codeWrapper = btn.closest('.code-block-wrapper');
            const codeBlock = codeWrapper.querySelector('pre code');
            
            if (!codeBlock) return;

            const textToCopy = codeBlock.innerText;

            try {
                // Write to clipboard
                await navigator.clipboard.writeText(textToCopy);
                
                // Visual Success Feedback
                const originalText = btn.innerText;
                btn.innerText = 'Copied!';
                btn.style.background = 'var(--neo-orange)';
                btn.style.color = '#fff';
                btn.style.transform = 'scale(1.05)';

                // Reset after 2 seconds
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.transform = 'scale(1)';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                btn.innerText = 'Error';
                setTimeout(() => btn.innerText = 'Copy', 2000);
            }
        });
    });
}

/**
 * 2. Scroll Spy & Smooth Scrolling
 * Highlights the current active section in the sidebar TOC and 
 * handles smooth scrolling when clicking links (with navbar offset).
 */
function initScrollSpy() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    const sections = document.querySelectorAll('section.doc-section');

    if (tocLinks.length === 0 || sections.length === 0) return;

    // A. Smooth Scrolling on Click
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Offset calculation to prevent the sticky navbar from covering the title
                const navHeight = 120; 
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // B. Intersection Observer (Scroll Spy)
    // This watches the screen and detects which section is currently being read
    const observerOptions = {
        root: null,
        rootMargin: '-120px 0px -60% 0px', // Triggers when section hits top 30% of screen
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 1. Remove active class from all TOC links
                tocLinks.forEach(link => link.classList.remove('active'));
                
                // 2. Add active class to the currently viewed section
                const activeLink = document.querySelector(`.toc-list a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}