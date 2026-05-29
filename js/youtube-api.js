// js/youtube-api.js
import { API_BASE_URL } from './config.js';

/**
 * Sends the user's search query to your backend server.
 * @param {string} query - What the user typed in the search bar.
 * @returns {Array|null} - Array of video objects or null if it fails.
 */
export async function searchYouTube(query) {
    if (!query || query.trim() === '') return [];

    try {
        const response = await fetch(`${API_BASE_URL}/youtube/search?query=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.results; 
        
    } catch (error) {
        console.error("FocusTube Search Error:", error.message);
        // In a real app, you might want to trigger a UI alert here
        return null; 
    }
}

/**
 * Extracts the raw YouTube Video ID from a standard link.
 * Useful if the user pastes a link directly instead of searching.
 * @param {string} url - e.g., "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 * @returns {string|null} - The 11-character video ID.
 */
export function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Generates the distraction-free embed URL for the player iframe.
 */
export function getDistractionFreeEmbedUrl(videoId) {
    if (!videoId) return '';

    // The absolute bare minimum embed link to bypass strict security blocks
    return `https://www.youtube.com/embed/${videoId}`;
}