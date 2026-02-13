// ==UserScript==
// @name         YouTube Bangla/Hindi Video Filter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Filter out videos with Bangla and Hindi titles on YouTube (Optimized)
// @author       You
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Bangla Unicode ranges: \u0980-\u09FF
    // Hindi (Devanagari) Unicode ranges: \u0900-\u097F
    const FILTER_REGEX = /[\u0900-\u097F\u0980-\u09FF]/;
    
    // Selectors for different YouTube layouts
    const VIDEO_SELECTORS = [
        '#dismissible', // Main video containers
        'ytd-video-renderer', // Search results and related videos
        'ytd-compact-video-renderer', // Sidebar videos
        'ytd-grid-video-renderer', // Grid layout videos
        'ytd-rich-item-renderer', // Home page videos
        'ytd-movie-renderer', // Movie suggestions
        '.ytd-shelf-renderer #dismissible' // Shelf videos
    ];
    
    // Performance optimization: batch DOM operations
    let elementsToHide = [];
    let processingTimeout;
    
    function batchHideElements() {
        if (elementsToHide.length > 0) {
            // Use CSS transform for better performance than display:none
            elementsToHide.forEach(el => {
                el.style.transform = 'scale(0)';
                el.style.height = '0';
                el.style.overflow = 'hidden';
                el.style.margin = '0';
                el.style.padding = '0';
                el.setAttribute('data-filtered', 'true');
            });
            elementsToHide = [];
        }
    }
    
    function getTitleFromElement(element) {
        // Multiple selectors to find video titles in different layouts
        const titleSelectors = [
            '#video-title',
            '.ytd-video-meta-block #video-title',
            'h3 a',
            'h3 span',
            'a#video-title-link',
            '.title-and-badge a',
            '#video-title-link'
        ];
        
        for (const selector of titleSelectors) {
            const titleEl = element.querySelector(selector);
            if (titleEl) {
                return titleEl.textContent || titleEl.getAttribute('title') || titleEl.getAttribute('aria-label');
            }
        }
        
        // Fallback: search for any text content that might be a title
        const textElements = element.querySelectorAll('a, span, h1, h2, h3');
        for (const textEl of textElements) {
            const text = textEl.textContent?.trim();
            if (text && text.length > 10 && text.length < 200) {
                return text;
            }
        }
        
        return '';
    }
    
    function shouldFilterVideo(title) {
        if (!title || title.length < 3) return false;
        
        // Quick check: if no Bangla/Hindi characters, skip
        return FILTER_REGEX.test(title);
    }
    
    function filterVideos() {
        // Only process elements that haven't been filtered yet
        VIDEO_SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(`${selector}:not([data-filtered])`);
            
            elements.forEach(element => {
                const title = getTitleFromElement(element);
                
                if (shouldFilterVideo(title)) {
                    elementsToHide.push(element);
                } else {
                    // Mark as processed to avoid re-checking
                    element.setAttribute('data-filtered', 'false');
                }
            });
        });
        
        // Batch hide elements to improve performance
        if (elementsToHide.length > 0) {
            clearTimeout(processingTimeout);
            processingTimeout = setTimeout(batchHideElements, 10);
        }
    }
    
    // Optimized observer to watch for new videos
    let observerTimeout;
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if added node contains video elements
                        if (VIDEO_SELECTORS.some(selector => 
                            node.matches?.(selector) || node.querySelector?.(selector)
                        )) {
                            shouldProcess = true;
                            break;
                        }
                    }
                }
            }
            if (shouldProcess) break;
        }
        
        if (shouldProcess) {
            clearTimeout(observerTimeout);
            observerTimeout = setTimeout(filterVideos, 100);
        }
    });
    
    // Wait for YouTube to load and start observing
    function initialize() {
        // Initial filter
        filterVideos();
        
        // Start observing changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also filter when navigating within YouTube (SPA navigation)
        let currentUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                setTimeout(filterVideos, 500); // Small delay for content to load
            }
        }, 1000);
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
        clearTimeout(observerTimeout);
        clearTimeout(processingTimeout);
    });
    
    // Debug function (remove in production)
    window.ytFilterDebug = function() {
        console.log('Filtered elements:', document.querySelectorAll('[data-filtered="true"]').length);
        console.log('Total video elements:', document.querySelectorAll(VIDEO_SELECTORS.join(',')).length);
    };
    
})();