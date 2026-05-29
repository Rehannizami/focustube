// ============================================================================
// js/theme.js - Global Dark Mode Engine
// ============================================================================

// 1. INSTANT THEME APPLICATION
// This runs immediately to prevent the "white flash" of unstyled content
const savedTheme = localStorage.getItem('focusTubeTheme');
const htmlElement = document.documentElement; // Targets the <html> tag, which is critical for :root CSS variables

if (savedTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
}

// 2. WIRE UP THE TOGGLE BUTTON(S)
// Because we import this file as type="module", it automatically defers execution
// until the DOM is parsed. We don't even need DOMContentLoaded.
const initThemeToggles = () => {
    // querySelectorAll just in case you ever have a mobile menu AND a desktop menu with the button
    const themeToggleBtns = document.querySelectorAll('#themeToggle');

    if (themeToggleBtns.length === 0) {
        console.warn("Theme toggle button not found on this page.");
        return;
    }

    themeToggleBtns.forEach(btn => {
        // Set the initial text of the button based on the current theme
        btn.innerText = savedTheme === 'dark' ? 'Light Mode' : 'Dark Mode';

        // Listen for clicks
        btn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                // Switch to Light
                htmlElement.removeAttribute('data-theme');
                localStorage.setItem('focusTubeTheme', 'light');
                themeToggleBtns.forEach(b => b.innerText = 'Dark Mode');
            } else {
                // Switch to Dark
                htmlElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('focusTubeTheme', 'dark');
                themeToggleBtns.forEach(b => b.innerText = 'Light Mode');
            }
        });
    });
};

// Fire the function
initThemeToggles();