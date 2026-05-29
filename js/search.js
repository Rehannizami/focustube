// js/search.js
import { searchYouTube, extractVideoId } from './youtube-api.js';

document.addEventListener('DOMContentLoaded', () => {
    initSearchEngine();
    initFilterInteractions();
});

/**
 * Initializes the core search functionality, handling inputs, 
 * API fetching, and dynamic DOM rendering.
 */
function initSearchEngine() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const skeletonLoader = document.getElementById('loading-state'); 

    if (!searchForm || !searchInput || !resultsContainer) {
        console.error("Critical Error: Search UI elements missing from the DOM.");
        return;
    }

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const query = searchInput.value.trim();
        
        if (!query) {
            showError("Please enter a search term (e.g., preparation of dinitrogen) or paste a direct YouTube link.");
            return;
        }

        // 1. Smart Link Detection
        // If the user pastes a direct YouTube link, bypass search and load player
        const directVideoId = extractVideoId(query);
        if (directVideoId) {
            window.location.href = `/player?v=${directVideoId}`;
            return;
        }

        // 2. Prepare UI for searching (Trigger Skeleton Loader)
        setLoadingState(true, skeletonLoader, resultsContainer, searchInput);

        // 3. Fetch results from your backend controller
        try {
            const results = await searchYouTube(query);

            // 4. Handle the response and update UI
            setLoadingState(false, skeletonLoader, resultsContainer, searchInput);

            if (results === null) {
                showError("We couldn't connect to the server. Please check your local backend.");
            } else if (results.length === 0) {
                showError(`No specific lectures found for "${query}". Try adjusting your filters or terms.`);
            } else {
                renderResults(results, resultsContainer);
            }
        } catch (error) {
            console.error("Search execution failed:", error);
            setLoadingState(false, skeletonLoader, resultsContainer, searchInput);
            showError("An unexpected error occurred while searching. Please try again.");
        }
    });
}

/**
 * Renders the array of video objects into the Neo-Brutalist DOM structure.
 * @param {Array} videos - The array of video objects from the backend.
 * @param {HTMLElement} container - The DOM element to append results to.
 */
function renderResults(videos, container) {
    // Clear out any previous errors or old results
    container.innerHTML = '';
    
    // Document fragment for high-performance DOM injection
    const fragment = document.createDocumentFragment();

    videos.forEach(video => {
        // Create the main anchor tag wrapper for the card
        const card = document.createElement('a');
        card.href = `/player?v=${video.videoId}`;
        card.classList.add('neo-video-card', 'glass-panel'); 
        
        // Ensure data is sanitized before injecting into HTML
        const safeTitle = escapeHTML(video.title);
        const safeChannel = escapeHTML(video.channelTitle);
        const safeDescription = escapeHTML(video.description);

        // The Neo-Brutalist HTML Structure
        card.innerHTML = `
            <div class="card-thumbnail-wrapper">
                <img src="${video.thumbnail}" alt="Thumbnail for ${safeTitle}" loading="lazy">
                <div class="duration-badge">Lecture</div>
                <div class="play-overlay">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>
            <div class="card-metadata">
                <h3 class="card-title">${safeTitle}</h3>
                <div class="card-channel">
                    <span class="channel-name">${safeChannel}</span>
                    <svg class="verified-badge" width="14" height="14" viewBox="0 0 24 24" fill="var(--neo-orange)">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <p class="card-description">${safeDescription}</p>
                <div class="card-tags">
                    <span class="brutal-tag">Focus Mode</span>
                    <span class="brutal-tag">Education</span>
                </div>
            </div>
        `;

        fragment.appendChild(card);
    });

    // Append all built cards to the grid in one single operation
    container.appendChild(fragment);
}

/**
 * Manages the visual transition between the skeleton loading animation and actual results.
 * @param {boolean} isLoading 
 * @param {HTMLElement} skeleton 
 * @param {HTMLElement} container 
 * @param {HTMLElement} input 
 */
function setLoadingState(isLoading, skeleton, container, input) {
    if (isLoading) {
        input.disabled = true;
        input.style.opacity = '0.7';
        container.style.display = 'none'; // Hide current results
        if (skeleton) skeleton.style.display = 'grid'; // Show skeleton grid
    } else {
        input.disabled = false;
        input.style.opacity = '1';
        input.focus();
        if (skeleton) skeleton.style.display = 'none'; // Hide skeleton grid
        container.style.display = 'grid'; // Restore results grid
    }
}

/**
 * Displays an error or empty state message inside the results container.
 * @param {string} message 
 */
function showError(message) {
    const container = document.getElementById('results-container');
    if (!container) return;

    container.innerHTML = `
        <div class="error-state glass-panel" style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; border-radius: 20px;">
            <div style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
            <h3 style="color: var(--neo-text-main); font-size: 1.5rem; margin-bottom: 12px;">Notice</h3>
            <p style="color: var(--neo-text-muted); font-size: 1.1rem; max-width: 500px; margin: 0 auto;">
                ${escapeHTML(message)}
            </p>
        </div>
    `;
    container.style.display = 'grid';
}

/**
 * Utility to prevent Cross-Site Scripting (XSS) from unverified YouTube data.
 */
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}

/**
 * Optional: Adds visual interactivity to the sidebar filters.
 * Future integration point for appending filter parameters to the YouTube API fetch.
 */
function initFilterInteractions() {
    const clearBtn = document.querySelector('.clear-filters-btn');
    const checkboxes = document.querySelectorAll('.brutal-checkbox input');
    const radios = document.querySelectorAll('.brutal-radio input');

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            // Uncheck all custom boxes
            checkboxes.forEach(box => box.checked = false);
            
            // Reset radio to default first option
            if (radios.length > 0) {
                radios[0].checked = true;
            }
        });
    }
}