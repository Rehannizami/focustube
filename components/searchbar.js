// components/searchbar.js

class FocusSearchbar extends HTMLElement {
    connectedCallback() {
        // Output the HTML structure
        this.innerHTML = `
            <div class="search-component-wrapper">
                <form id="search-form" class="search-form">
                    <div class="input-group">
                        <input 
                            type="text" 
                            id="search-input" 
                            placeholder="Search for physics lectures, biology topics, or paste a link..." 
                            autocomplete="off" 
                            required
                        >
                        <button type="submit" id="search-btn" class="btn-primary">
                            Focus
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Add smart routing logic for when the search bar is used outside the search page
        const form = this.querySelector('#search-form');
        const input = this.querySelector('#search-input');

        form.addEventListener('submit', (e) => {
            const currentPath = window.location.pathname;
            
            // If we are NOT on the search page, we need to handle the redirect manually
            if (!currentPath.includes('/search')) {
                e.preventDefault(); // Stop normal submission
                const query = input.value.trim();
                
                if (query) {
                    // Redirect to search page and pass the query in the URL
                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                }
            }
            // If we ARE on the search page, we let js/search.js take over completely!
        });

        // Auto-fill the input if there's a search query in the URL 
        // (e.g., when the user gets redirected from the home page)
        const urlParams = new URLSearchParams(window.location.search);
        const savedQuery = urlParams.get('q');
        if (savedQuery) {
            input.value = savedQuery;
        }
    }
}

customElements.define('focus-searchbar', FocusSearchbar);