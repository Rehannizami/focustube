// components/navbar.js

class FocusNavbar extends HTMLElement {
    // connectedCallback runs automatically when the element is added to the HTML
    connectedCallback() {
        this.innerHTML = `
            <nav class="focus-navbar">
                <div class="nav-container">
                    <a href="/" class="brand-link">
                        <img src="./assets/logo.svg" alt="FocusTube Logo" class="brand-logo">
                        <span class="brand-text">FocusTube</span>
                    </a>

                    <div class="nav-links">
                        <a href="/search" class="nav-item">Search</a>
                        </div>
                </div>
            </nav>
        `;
    }
}

// This registers your custom HTML tag so the browser understands it
customElements.define('focus-navbar', FocusNavbar);