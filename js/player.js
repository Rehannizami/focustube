// js/player.js
import { getDistractionFreeEmbedUrl } from './youtube-api.js';

document.addEventListener('DOMContentLoaded', () => {
    initPlayer();
    initToolbar();
    initQuickNotes();
    initPomodoro();
    initCalculator();
    initLightsOut();
});

// ============================================================================
// 1. THEATER VIDEO PLAYER LOGIC
// ============================================================================
function initPlayer() {
    const playerContainer = document.getElementById('player-container');
    if (!playerContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');

    if (!videoId) {
        playerContainer.innerHTML = `
            <div class="error-state" style="padding: 40px; text-align: center;">
                <h2>No video selected</h2>
                <p>Please search for a video first.</p>
                <a href="/search" class="btn-primary" style="display: inline-block; margin-top: 20px;">Go to Search</a>
            </div>
        `;
        return;
    }

    const embedUrl = getDistractionFreeEmbedUrl(videoId);

    playerContainer.innerHTML = `
        <iframe
            src="${embedUrl}"
            title="FocusTube Theater Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
        </iframe>
    `;

    // <--- WIRE IT HERE: Call the function we added at the bottom
    loadVideoMetadata(videoId);
}

// ============================================================================
// 2. UTILITY TOOLBAR LOGIC
// ============================================================================
function initToolbar() {
    const btnCopy = document.getElementById('btn-copy');
    const btnCalc = document.getElementById('btn-calc');
    const btnSearch = document.getElementById('btn-search');

    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');

    // --- COPY LINK LOGIC ---
    if (btnCopy) {
        btnCopy.addEventListener('click', async () => {
            if (!videoId) return;
            
            // Reconstructs the standard YouTube link so you can share it
            const youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;
            
            try {
                await navigator.clipboard.writeText(youtubeLink);
                // Visual feedback
                const originalText = btnCopy.innerHTML;
                btnCopy.innerHTML = `<span class="icon">✅</span> Copied!`;
                btnCopy.style.borderColor = "#10b981";
                
                setTimeout(() => {
                    btnCopy.innerHTML = originalText;
                    btnCopy.style.borderColor = "";
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
                alert("Failed to copy link.");
            }
        });
    }

    // --- CALCULATOR LOGIC ---
    if (btnCalc) {
        btnCalc.addEventListener('click', () => {
            // The cleanest way to give a powerful calculator without building a massive 
            // math engine locally is to pop open Google's built-in web calculator in a small window.
            window.open(
                'https://www.google.com/search?q=calculator', 
                'FocusTubeCalc', 
                'width=400,height=550,resizable=no,scrollbars=no'
            );
        });
    }

    // --- GOOGLE SEARCH LOGIC ---
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            // Prompts the user for a search term without leaving the page
            const query = prompt("What do you want to search Google for?");
            if (query && query.trim() !== "") {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            }
        });
    }
}

// ============================================================================
// 3. QUICK NOTES LOGIC (Auto-Save & Download)
// ============================================================================
function initQuickNotes() {
    const textarea = document.querySelector('.neo-textarea');
    const downloadBtn = document.querySelector('.scratchpad-header .btn-icon-only');

    if (!textarea) return;

    // 1. Load any previously saved notes when the page opens
    const savedNotes = localStorage.getItem('focusTube_quickNotes');
    if (savedNotes) {
        textarea.value = savedNotes;
    }

    // 2. Auto-save to the browser memory every time you type a letter
    textarea.addEventListener('input', () => {
        localStorage.setItem('focusTube_quickNotes', textarea.value);
    });

    // 3. Download the notes as a text file when you click the top-right icon
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const textContent = textarea.value.trim();
            
            if (!textContent) {
                alert("Your scratchpad is empty.");
                return;
            }

            // Create a downloadable text file on the fly
            const blob = new Blob([textContent], { type: 'text/plain' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'FocusTube_Lecture_Notes.txt';
            
            // Trigger the download silently
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }
}

// ============================================================================
// 4. POMODORO TRACKER ENGINE
// ============================================================================
function initPomodoro() {
    // Timer State Variables
    let focusDuration = 25; // minutes
    let breakDuration = 5;  // minutes
    let timeRemaining = focusDuration * 60; // strictly in seconds
    let isRunning = false;
    let isFocusMode = true;
    let timerInterval = null;

    // DOM Elements - Display & Buttons
    const displayElement = document.getElementById('timer-display');
    const statusBadge = document.getElementById('pomo-status');
    const mainBtn = document.getElementById('btn-pomo-main');
    const breakBtn = document.getElementById('btn-pomo-break');
    const resetBtn = document.getElementById('btn-pomo-reset');

    // DOM Elements - Modal
    const modal = document.getElementById('pomo-modal');
    const settingsBtn = document.getElementById('btn-pomo-settings');
    const closeBtn = document.getElementById('close-pomo-modal');
    const saveBtn = document.getElementById('save-pomo-settings');
    const inputFocus = document.getElementById('input-focus-time');
    const inputBreak = document.getElementById('input-break-time');

    // Load saved settings from memory if they exist
    const savedSettings = JSON.parse(localStorage.getItem('focusTube_pomoSettings'));
    if (savedSettings) {
        focusDuration = savedSettings.focus;
        breakDuration = savedSettings.break;
        inputFocus.value = focusDuration;
        inputBreak.value = breakDuration;
        timeRemaining = focusDuration * 60;
    }

    // --- Core Timer Logic ---
    function updateDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        displayElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function toggleTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            mainBtn.textContent = isFocusMode ? "Resume Focus" : "Resume Break";
            mainBtn.style.background = "var(--theater-surface-light)";
            mainBtn.style.color = "var(--neo-text-main)";
            mainBtn.style.border = "2px solid var(--neo-glass-border)";
        } else {
            mainBtn.textContent = "Pause Timer";
            mainBtn.style.background = "var(--neo-orange)";
            mainBtn.style.color = "#fff";
            mainBtn.style.border = "none";
            
            timerInterval = setInterval(() => {
                timeRemaining--;
                updateDisplay();

                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    // Auto-switch modes when time hits zero
                    if (isFocusMode) {
                        alert("Focus Session Complete! Take a break.");
                        switchToBreak();
                    } else {
                        alert("Break Complete! Ready to focus?");
                        switchToFocus();
                    }
                }
            }, 1000);
        }
        isRunning = !isRunning;
    }

    function switchToBreak() {
        clearInterval(timerInterval);
        isRunning = false;
        isFocusMode = false;
        timeRemaining = breakDuration * 60;
        statusBadge.textContent = "Break";
        statusBadge.style.color = "#3b82f6"; // Blue for break
        mainBtn.textContent = "Start Break";
        updateDisplay();
    }

    function switchToFocus() {
        clearInterval(timerInterval);
        isRunning = false;
        isFocusMode = true;
        timeRemaining = focusDuration * 60;
        statusBadge.textContent = "Focus";
        statusBadge.style.color = "var(--neo-text-muted)";
        mainBtn.textContent = "Start Focus";
        updateDisplay();
    }

    // --- Event Listeners for Timer ---
    mainBtn.addEventListener('click', toggleTimer);
    breakBtn.addEventListener('click', switchToBreak);
    resetBtn.addEventListener('click', switchToFocus);

    // --- Modal Logic ---
    settingsBtn.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    
    // Close modal if clicked outside the box
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    saveBtn.addEventListener('click', () => {
        // Grab and validate the new numbers
        const newFocus = parseInt(inputFocus.value) || 25;
        const newBreak = parseInt(inputBreak.value) || 5;
        
        focusDuration = Math.max(1, newFocus);
        breakDuration = Math.max(1, newBreak);
        
        // Save to browser storage
        localStorage.setItem('focusTube_pomoSettings', JSON.stringify({
            focus: focusDuration,
            break: breakDuration
        }));

        modal.classList.remove('active');
        switchToFocus(); // Instantly apply and reset
    });

    // Initialize display on load
    updateDisplay();
}
// ============================================================================
// 5. NATIVE CALCULATOR ENGINE
// ============================================================================
function initCalculator() {
    const calcBtn = document.getElementById('btn-calc');
    const calcModal = document.getElementById('calc-modal');
    const closeCalcBtn = document.getElementById('close-calc-modal');
    const display = document.getElementById('calc-display');
    const keys = document.querySelectorAll('.btn-calc-key');

    if (!calcBtn || !calcModal || !display) return;

    // 1. Strip the old Google window.open listener by cloning the button
    const newCalcBtn = calcBtn.cloneNode(true);
    calcBtn.parentNode.replaceChild(newCalcBtn, calcBtn);

    // 2. Open/Close Modal Logic
    newCalcBtn.addEventListener('click', () => calcModal.classList.add('active'));
    closeCalcBtn.addEventListener('click', () => calcModal.classList.remove('active'));
    
    calcModal.addEventListener('click', (e) => {
        if (e.target === calcModal) calcModal.classList.remove('active');
    });

    // 3. Calculator Math Engine
    let currentExpr = '0';

    keys.forEach(key => {
        key.addEventListener('click', () => {
            const val = key.getAttribute('data-val');

            if (val === 'C') {
                currentExpr = '0';
            } else if (val === '=') {
                try {
                    // Convert visual math to JS math
                    let toEval = currentExpr.replace(/×/g, '*').replace(/÷/g, '/');
                    // Safe execution
                    let result = new Function('return ' + toEval)();
                    // Fix floating point errors (e.g. 0.1 + 0.2 = 0.300000004)
                    currentExpr = String(Math.round(result * 100000000) / 100000000);
                } catch {
                    currentExpr = 'Error';
                }
            } else {
                // Prevent leading zeros and handle continuing after an error
                if (currentExpr === '0' || currentExpr === 'Error') {
                    currentExpr = (val === '.' || val === '+' || val === '*' || val === '/') ? '0' + val : val;
                } else {
                    currentExpr += val;
                }
            }

            // Visual update, replacing ugly code asterisks with pretty math symbols
            display.value = currentExpr.replace(/\*/g, '×').replace(/\//g, '÷');
        });
    });
}
// ============================================================================
// 6. CINEMATIC "LIGHTS OUT" MODE
// ============================================================================
function initLightsOut() {
    const lightsBtn = document.getElementById('btn-lights');
    const exitBtn = document.getElementById('exit-lights-out');

    if (!lightsBtn || !exitBtn) return;

    lightsBtn.classList.remove('active-toggle');

    // Centralized function to toggle the lights and sync both buttons
    const toggleLights = () => {
        document.body.classList.toggle('lights-out');
        lightsBtn.classList.toggle('active-toggle');
        
        if (document.body.classList.contains('lights-out')) {
            // "Lights On" state (Glowing Sun Icon)
            lightsBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--neo-orange);"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                Lights On
            `;
        } else {
            // "Lights Out" state (Original Eye Icon)
            lightsBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Lights Out
            `;
        }
    };

    // Both buttons trigger the exact same sync logic
    lightsBtn.addEventListener('click', toggleLights);
    exitBtn.addEventListener('click', toggleLights);
}
/**
 * Fetches and injects video metadata into the player.html elements
 */
async function loadVideoMetadata(videoId) {
    try {
        // NOTE: This assumes you have an endpoint that returns video details. 
        // If you don't have one, replace this with a direct YouTube API call.
        const response = await fetch(`/api/video-details?id=${videoId}`);
        const data = await response.json();

        if (data) {
            // Update Title
            document.getElementById('video-title').textContent = data.title;
            
            // Update Channel Name
            document.getElementById('channel-name').textContent = data.channelTitle;
            
            // Update Channel Logo (Avatar)
            const avatar = document.querySelector('.channel-avatar');
            avatar.style.backgroundImage = `url('${data.channelThumbnail}')`;
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
        }
    } catch (err) {
        console.error("Failed to load metadata:", err);
        document.getElementById('video-title').textContent = "Metadata unavailable";
    }
}