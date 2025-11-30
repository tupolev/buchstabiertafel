// DIN 5009:2022 Buchstabiertafel Converter

let din5009Dictionary = {};
let translations = {};
let currentLanguage = 'de'; // Default language

// Detect user's browser language
function detectBrowserLanguage() {
    const supportedLanguages = ['de', 'en', 'es', 'fr'];

    // Try navigator.languages first (more accurate)
    if (navigator.languages && navigator.languages.length > 0) {
        for (const lang of navigator.languages) {
            const langCode = lang.toLowerCase().split('-')[0]; // Get language code (e.g., 'en' from 'en-US')
            if (supportedLanguages.includes(langCode)) {
                return langCode;
            }
        }
    }

    // Fallback to navigator.language
    if (navigator.language) {
        const langCode = navigator.language.toLowerCase().split('-')[0];
        if (supportedLanguages.includes(langCode)) {
            return langCode;
        }
    }

    // Default to German if no match
    return 'de';
}

// Load the DIN 5009 dictionary
async function loadDictionary() {
    try {
        const response = await fetch('din5009.json');
        if (!response.ok) {
            throw new Error('Failed to load dictionary');
        }
        din5009Dictionary = await response.json();
    } catch (error) {
        console.error('Error loading DIN 5009 dictionary:', error);
        // Fallback dictionary in case of loading error
        din5009Dictionary = {
            "A": "Aachen",
            "B": "Berlin",
            "C": "Chemnitz",
            "D": "Düsseldorf",
            "E": "Essen",
            "F": "Frankfurt",
            "G": "Goslar",
            "H": "Hamburg",
            "I": "Ingelheim",
            "J": "Jena",
            "K": "Köln",
            "L": "Leipzig",
            "M": "München",
            "N": "Nürnberg",
            "O": "Offenbach",
            "P": "Potsdam",
            "Q": "Quickborn",
            "R": "Rostock",
            "S": "Salzwedel",
            "T": "Tübingen",
            "U": "Unna",
            "V": "Völklingen",
            "W": "Wuppertal",
            "X": "Xanten",
            "Y": "Ypsilon",
            "Z": "Zwickau",
            "Ä": "Umlaut Aachen",
            "Ö": "Umlaut Offenbach",
            "Ü": "Umlaut Unna",
            "ß": "Eszett"
        };
    }
}

// Convert word to DIN 5009 spelling
function convertToSpelling(word) {
    const result = [];
    const upperWord = word.toUpperCase();

    for (let i = 0; i < upperWord.length; i++) {
        const char = upperWord[i];
        const codeWord = din5009Dictionary[char] || null;

        if (codeWord) {
            result.push({
                letter: char,
                codeWord: codeWord
            });
        } else if (char.trim() !== '') {
            // Character not in dictionary (e.g., numbers, special chars)
            result.push({
                letter: char,
                codeWord: '-'
            });
        }
    }

    return result;
}

// Load translations
async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        if (!response.ok) {
            throw new Error('Failed to load translations');
        }
        translations = await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Get translation for a key
function t(key) {
    return translations[currentLanguage]?.[key] || translations['de']?.[key] || key;
}

// Get query parameter value
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Update URL query string without page reload
function updateURL(word, lang = null) {
    const url = new URL(window.location);
    if (word && word.trim()) {
        url.searchParams.set('word', encodeURIComponent(word.trim()));
    } else {
        url.searchParams.delete('word');
    }
    if (lang) {
        url.searchParams.set('lang', lang);
    } else if (currentLanguage !== 'de') {
        url.searchParams.set('lang', currentLanguage);
    } else {
        url.searchParams.delete('lang');
    }
    window.history.replaceState({}, '', url);
}

// Get current URL with query string
function getCurrentURL() {
    return window.location.href;
}

// Copy URL to clipboard
async function copyURLToClipboard() {
    const url = getCurrentURL();
    try {
        await navigator.clipboard.writeText(url);
        showCopyFeedback();
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showCopyFeedback();
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
        document.body.removeChild(textArea);
    }
}

// Show copy feedback
function showCopyFeedback() {
    const btn = document.getElementById('copyUrlBtn');
    const originalText = btn.querySelector('.copy-text').textContent;
    btn.querySelector('.copy-text').textContent = t('copied');
    btn.classList.add('copied');

    setTimeout(() => {
        updateTranslations();
        btn.classList.remove('copied');
    }, 2000);
}

// Update all translatable elements
function updateTranslations() {
    // Update elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (element.tagName === 'INPUT' && element.hasAttribute('data-translate-placeholder')) {
            element.placeholder = t(key);
        } else {
            element.textContent = t(key);
        }
    });

    // Update placeholder separately
    const inputField = document.getElementById('inputWord');
    if (inputField && inputField.hasAttribute('data-translate-placeholder')) {
        const key = inputField.getAttribute('data-translate-placeholder');
        inputField.placeholder = t(key);
    }

    // Update page title
    document.title = t('title') + (window.location.pathname.includes('help') ? ' - ' + t('helpTitle') : '');

    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;

    // Update empty state if visible
    const emptyRow = document.querySelector('.empty-row td');
    if (emptyRow && emptyRow.hasAttribute('data-translate')) {
        emptyRow.textContent = t('emptyState');
    }

    // Update language selector
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.value = currentLanguage;
    }

    // Update help page back button to preserve language
    const backButton = document.getElementById('backButton');
    if (backButton) {
        const url = new URL(backButton.href, window.location.origin);
        if (currentLanguage !== 'de') {
            url.searchParams.set('lang', currentLanguage);
        } else {
            url.searchParams.delete('lang');
        }
        backButton.href = url.pathname + (url.search ? url.search : '');
    }

    // Update help link in footer to preserve language
    const helpLinks = document.querySelectorAll('a[href="help.html"], a[href*="help.html"]');
    helpLinks.forEach(link => {
        const url = new URL(link.href, window.location.origin);
        if (currentLanguage !== 'de') {
            url.searchParams.set('lang', currentLanguage);
        } else {
            url.searchParams.delete('lang');
        }
        link.href = url.pathname + (url.search ? url.search : '');
    });
}

// Pronounce word using Web Speech API
function pronounceWord(word) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(word);
        // Use German language for better pronunciation
        utterance.lang = 'de-DE';
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1;
        utterance.volume = 1;

        window.speechSynthesis.speak(utterance);
    } else {
        console.warn('Speech synthesis not supported in this browser');
    }
}

// Display spelling in table
function displaySpelling(spelling) {
    const tableBody = document.getElementById('tableBody');
    const copyUrlContainer = document.getElementById('copyUrlContainer');

    if (!tableBody) return;

    if (spelling.length === 0) {
        tableBody.innerHTML = `<tr class="empty-row"><td colspan="3" data-translate="emptyState">${t('emptyState')}</td></tr>`;
        if (copyUrlContainer) copyUrlContainer.style.display = 'none';
        return;
    }

    // Show copy button when there's a spelling
    if (copyUrlContainer) copyUrlContainer.style.display = 'flex';

    tableBody.innerHTML = '';

    spelling.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.05}s`;

        const letterCell = document.createElement('td');
        letterCell.textContent = item.letter;

        const codeWordCell = document.createElement('td');
        codeWordCell.textContent = item.codeWord;

        // Create pronunciation button cell
        const pronounceCell = document.createElement('td');
        pronounceCell.className = 'pronounce-cell';

        const pronounceBtn = document.createElement('button');
        pronounceBtn.className = 'pronounce-btn';
        pronounceBtn.setAttribute('aria-label', `Aussprache von ${item.codeWord}`);
        pronounceBtn.innerHTML = '🔊';
        pronounceBtn.title = `Aussprache: ${item.codeWord}`;

        pronounceBtn.addEventListener('click', () => {
            pronounceWord(item.codeWord);
        });

        pronounceCell.appendChild(pronounceBtn);

        row.appendChild(letterCell);
        row.appendChild(codeWordCell);
        row.appendChild(pronounceCell);
        tableBody.appendChild(row);
    });
}

// Update language
function updateLanguage(lang) {
    currentLanguage = lang;
    const inputField = document.getElementById('inputWord');
    const word = inputField && inputField.value.trim() ? inputField.value.trim() : null;
    updateURL(word, lang);
    updateTranslations();

    // Refresh spelling display if there's input
    if (inputField && word) {
        const spelling = convertToSpelling(word);
        displaySpelling(spelling);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    const inputField = document.getElementById('inputWord');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const langSelect = document.getElementById('languageSelect');

    // Load translations and dictionary
    await Promise.all([loadTranslations(), loadDictionary()]);

    // Get language from query string, browser, or use default
    const langFromQuery = getQueryParam('lang');
    if (langFromQuery && ['de', 'en', 'es', 'fr'].includes(langFromQuery)) {
        currentLanguage = langFromQuery;
    } else {
        // Use browser language if no query parameter
        currentLanguage = detectBrowserLanguage();
        // Update URL with detected language (but don't add if it's the default 'de')
        if (currentLanguage !== 'de') {
            updateURL(null, currentLanguage);
        }
    }

    // Set initial language
    updateTranslations();

    // Handle language selector change
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }

    // Check for word in query string on page load
    const wordFromQuery = getQueryParam('word');
    if (wordFromQuery && inputField) {
        const decodedWord = decodeURIComponent(wordFromQuery);
        inputField.value = decodedWord;
        const spelling = convertToSpelling(decodedWord);
        displaySpelling(spelling);
    }

    // Handle input in real-time
    if (inputField) {
        inputField.addEventListener('input', (e) => {
            const word = e.target.value.trim();
            updateURL(word);
            const spelling = convertToSpelling(word);
            displaySpelling(spelling);
        });
    }

    // Handle copy URL button click
    if (copyUrlBtn) {
        copyUrlBtn.addEventListener('click', copyURLToClipboard);
    }

    // Focus input field on load (only if no word from query string)
    if (!wordFromQuery && inputField) {
        inputField.focus();
    }

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
});

