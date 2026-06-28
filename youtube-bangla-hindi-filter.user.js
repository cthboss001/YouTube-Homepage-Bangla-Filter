// ==UserScript==
// @name         YouTube Bangla/Hindi Video Filter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Filter out videos with Bangla and Hindi titles on YouTube (Optimized)
// @author       cthboss001
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
        '#dismissible',
        'ytd-video-renderer',
        'ytd-compact-video-renderer',
        'ytd-grid-video-renderer',
        'ytd-rich-item-renderer',
        'ytd-movie-renderer',
        '.ytd-shelf-renderer #dismissible',
        'ytd-video-renderer[is-slim-media]',    // large featured top result
        'ytd-search-pyv-renderer',              // promoted/ad cards
        'ytd-reel-item-renderer',               // shorts
        'ytd-playlist-video-renderer',          // playlist items
        'ytd-radio-item-renderer'               // mix/radio items
    ];

    // Performance: batch DOM operations
    let elementsToHide = [];
    let processingTimeout;

    function batchHideElements() {
        if (elementsToHide.length > 0) {
            elementsToHide.forEach(el => {
                // display:none is cleaner — no leftover gaps from scale(0)
                el.style.cssText = 'display:none !important';
                el.setAttribute('data-filtered', 'true');
            });
            elementsToHide = [];
        }
    }

    function getTitleFromElement(element) {
        // Priority order matters — yt-formatted-string must come first
        // because YouTube's search results use it for the top card,
        // and a plain #video-title query won't match that element type.
        const titleSelectors = [
            'yt-formatted-string#video-title',   // top search result / featured card
            '#video-title',
            'a#video-title-link',
            'yt-formatted-string.ytd-video-renderer',
            '.ytd-video-meta-block #video-title',
            'h3 a',
            'h3 span',
            '.title-and-badge a',
            '#video-title-link'
        ];

        for (const selector of titleSelectors) {
            const titleEl = element.querySelector(selector);
            if (titleEl) {
                const text =
                    titleEl.textContent?.trim() ||
                    titleEl.getAttribute('title') ||
                    titleEl.getAttribute('aria-label');
                if (text && text.length > 2) return text;
            }
        }

        // Fallback: scan all text nodes for something title-shaped
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
        return FILTER_REGEX.test(title);
    }

    function filterVideos() {
        VIDEO_SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(`${selector}:not([data-filtered])`);

            elements.forEach(element => {
                const title = getTitleFromElement(element);

                if (shouldFilterVideo(title)) {
                    elementsToHide.push(element);
                } else {
                    element.setAttribute('data-filtered', 'false');
                }
            });
        });

        if (elementsToHide.length > 0) {
            clearTimeout(processingTimeout);
            processingTimeout = setTimeout(batchHideElements, 10);
        }
    }

    // Debounced MutationObserver
    let observerTimeout;
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;

        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
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

    function initialize() {
        filterVideos();

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // SPA navigation detection
        let currentUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                // Reset all data-filtered marks so re-navigation re-checks everything
                document.querySelectorAll('[data-filtered]').forEach(el => {
                    el.removeAttribute('data-filtered');
                    el.style.cssText = '';
                });
                setTimeout(filterVideos, 500);
            }
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    window.addEventListener('beforeunload', () => {
        observer.disconnect();
        clearTimeout(observerTimeout);
        clearTimeout(processingTimeout);
    });

    // Debug helper — run ytFilterDebug() in console
    window.ytFilterDebug = function() {
        console.log('Filtered (hidden):', document.querySelectorAll('[data-filtered="true"]').length);
        console.log('Passed (visible):', document.querySelectorAll('[data-filtered="false"]').length);
        console.log('Total video elements:', document.querySelectorAll(VIDEO_SELECTORS.join(',')).length);
    };

})();
