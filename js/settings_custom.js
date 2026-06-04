(function() {
    let gplShowLeaveMessage = true;
    let gplCustomFont = "";
    let customStyleEl = null;
    let leaveMessageListenerActive = false;

    function handleBeforeUnload(e) {
        if (gplShowLeaveMessage) {
            e.preventDefault();
            e.returnValue = '';
        }
    }

    function updateLeaveMessageListener() {
        if (gplShowLeaveMessage && !leaveMessageListenerActive) {
            window.addEventListener('beforeunload', handleBeforeUnload);
            leaveMessageListenerActive = true;
        } else if (!gplShowLeaveMessage && leaveMessageListenerActive) {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            leaveMessageListenerActive = false;
        }
    }

    function updateCustomStyles() {
        if (!customStyleEl) {
            customStyleEl = document.createElement('style');
            customStyleEl.id = 'gpl-custom-settings-styles';
            if (document.head) {
                document.head.appendChild(customStyleEl);
            } else {
                document.documentElement.appendChild(customStyleEl);
            }
        }

        let css = '';
        const targetSelectorsNormal = `body, p, div, span, *, :root .light-theme:where(.gm2-theme) .gmat-body-1, .gb_ha, .gb_dd, strong, h1, h2, h3, h4, h5, h6, .markdown h1, .markdown h2, .markdown h3, .markdown h4, .markdown h5, .markdown h6`;
        const targetSelectorsImportant = `p, h1, h2, h3, h4, h5, h6, .markdown h1, .markdown h2, .markdown h3, .markdown h4, .markdown h5, .markdown h6, .gds-label-l, .gds-body-m, .markdown table td, .gds-body-s, .gds-emphasized-body-s, .mat-mdc-text-field-wrapper textarea, .gds-body-l`;
        const codeSelectors = `.markdown code, .markdown code > span.selected`;

        if (gplCustomFont && gplCustomFont.trim() !== '') {
            const fontName = gplCustomFont.trim();
            document.documentElement.style.setProperty('--gpl-active-font', `"${fontName}"`);
            css += `
                ${targetSelectorsNormal} { font-family: "${fontName}"; }
                ${targetSelectorsImportant} { font-family: "${fontName}" !important; }
                ${codeSelectors} { font-family: 'Google Sans Mono', monospace !important; }
            `;
        } else {
            const regularFontUrl = chrome.runtime.getURL('fonts/Vazirmatn-Regular.woff2');
            const boldFontUrl = chrome.runtime.getURL('fonts/Vazirmatn-Bold.woff2');
            
            css += `
                @font-face {
                    font-family: 'Vazirmatn';
                    src: url('${regularFontUrl}') format('woff2');
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap;
                }
                @font-face {
                    font-family: 'Vazirmatn';
                    src: url('${boldFontUrl}') format('woff2');
                    font-weight: bold;
                    font-style: normal;
                    font-display: swap;
                }
            `;
            document.documentElement.style.setProperty('--gpl-active-font', `'Vazirmatn'`);
            css += `
                ${targetSelectorsNormal} { font-family: 'Vazirmatn'; }
                ${targetSelectorsImportant} { font-family: 'Vazirmatn' !important; }
                ${codeSelectors} { font-family: 'Google Sans Mono', monospace !important; }
            `;
        }

        css += `
            .gpl-rtl-list-item::before {
                left: unset !important;
                right: 0 !important;
            }
        `;

        customStyleEl.textContent = css;
    }

    const persianRegex = /[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]/;

    function processMarkdownLists() {
        const listItems = document.querySelectorAll('.markdown ul > li:not(.gpl-rtl-processed)');
        listItems.forEach(li => {
            li.classList.add('gpl-rtl-processed');
            const textContent = li.textContent || "";
            if (persianRegex.test(textContent)) {
                li.classList.add('gpl-rtl-list-item');
            }
        });
    }

    let domObserverDebounce = null;
    const domObserver = new MutationObserver((mutations) => {
        let shouldProcess = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }
        if (shouldProcess) {
            if (domObserverDebounce) clearTimeout(domObserverDebounce);
            domObserverDebounce = setTimeout(() => {
                processMarkdownLists();
            }, 300);
        }
    });

    function initObserver() {
        if (document.body) {
            domObserver.observe(document.body, { childList: true, subtree: true });
            processMarkdownLists();
        } else {
            setTimeout(initObserver, 100);
        }
    }
    initObserver();

    chrome.storage.local.get({
        gpl_show_leave_message: true,
        gpl_custom_font: ""
    }, (data) => {
        gplShowLeaveMessage = data.gpl_show_leave_message;
        gplCustomFont = data.gpl_custom_font;
        
        updateLeaveMessageListener();
        updateCustomStyles();
    });

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
            if (changes.gpl_show_leave_message !== undefined) {
                gplShowLeaveMessage = changes.gpl_show_leave_message.newValue;
                updateLeaveMessageListener();
            }
            if (changes.gpl_custom_font !== undefined) {
                gplCustomFont = changes.gpl_custom_font.newValue;
                updateCustomStyles();
            }
        }
    });
})();
