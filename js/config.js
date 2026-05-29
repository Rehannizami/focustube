// js/config.js

/**
 * FocusTube Central Configuration
 * This file manages global states, URLs, and constants to prevent hard-coded bugs.
 */

// ============================================================================
// 1. ENVIRONMENT DETECTION & API ROUTING
// ============================================================================
// Automatically detects if you are testing on your computer (localhost) 
// or if you have deployed the site to the internet.
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE_URL = window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api'          // Your local Express server
      : '/api'

// ============================================================================
// 2. CORE APPLICATION SETTINGS
// ============================================================================
export const APP_CONFIG = {
    appName: 'FocusTube',
    version: '1.0.0',
    debugMode: isLocalhost, // Automatically turns off console logs in production for security
    
    // Timeouts (in milliseconds) to prevent infinite loading screens
    timeouts: {
        youtubeSearch: 10000, // 10 seconds max for YouTube API
        geminiChat: 30000,    // 30 seconds max for AI processing (useful for complex queries)
    },
    
    // UI Constants
    maxSearchResults: 10,
    theme: 'dark' // Placeholder if you decide to add light/dark mode later
};

// ============================================================================
// 3. CENTRALIZED ERROR MESSAGES
// ============================================================================
// By keeping strings here, you ensure the exact same error message appears 
// everywhere in the app. If you want to change a typo, you only change it once.
export const ERROR_MESSAGES = {
    network: "We couldn't connect to the server. Please check if your backend is running.",
    youtube: {
        emptySearch: "Please enter a search term or paste a YouTube link.",
        noResults: "No educational videos found. Try tweaking your search term.",
        invalidLink: "That doesn't look like a valid YouTube link."
    },
    gemini: {
        timeout: "The AI took too long to respond. Please try asking again.",
        serverError: "Gemini is currently unavailable. Ensure your local server is running.",
        emptyPrompt: "Please type a question before sending."
    },
    player: {
        noVideo: "No video selected. Please search for a video first to start focusing."
    }
};

// ============================================================================
// 4. CUSTOM LOGGER UTILITY
// ============================================================================
// Use this instead of console.log(). It only logs when debugMode is true,
// preventing you from accidentally leaking data to users in the live version.
export const logger = {
    info: (message, data = '') => {
        if (APP_CONFIG.debugMode) {
            console.log(`[📘 FocusTube INFO]: ${message}`, data);
        }
    },
    warn: (message, data = '') => {
        if (APP_CONFIG.debugMode) {
            console.warn(`[📙 FocusTube WARN]: ${message}`, data);
        }
    },
    error: (message, error = null) => {
        // Errors should always log, even in production, so you can track crashes
        console.error(`[📕 FocusTube ERROR]: ${message}`, error || '');
    }
};