(function() {
    // Intercept clipboard writes by replacing navigator.clipboard write methods on the page context.
    // This is required because content scripts run in isolated JS contexts and cannot directly read copy 
    // operations originating from page actions.
    const injectScript = document.createElement('script');
    injectScript.textContent = `
        (function() {
            if (navigator.clipboard) {
                if (navigator.clipboard.writeText) {
                    const originalWriteText = navigator.clipboard.writeText;
                    navigator.clipboard.writeText = function(text) {
                        document.dispatchEvent(new CustomEvent('GPL_ClipboardWrite', { detail: text }));
                        return originalWriteText.apply(this, arguments);
                    };
                }
                if (navigator.clipboard.write) {
                    const originalWrite = navigator.clipboard.write;
                    navigator.clipboard.write = async function(data) {
                        try {
                            for (const item of data) {
                                if (item.types.includes('text/plain')) {
                                    const blob = await item.getType('text/plain');
                                    const text = await blob.text();
                                    document.dispatchEvent(new CustomEvent('GPL_ClipboardWrite', { detail: text }));
                                    break;
                                }
                            }
                        } catch(e) {}
                        return originalWrite.apply(this, arguments);
                    };
                }
            }
            const originalExecCommand = document.execCommand;
            document.execCommand = function(command, ui, value) {
                if (command.toLowerCase() === 'copy') {
                    let copiedText = '';
                    const activeEl = document.activeElement;
                    if (activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT')) {
                        copiedText = activeEl.value.substring(activeEl.selectionStart, activeEl.selectionEnd) || activeEl.value;
                    } else {
                        copiedText = window.getSelection().toString();
                    }
                    if (copiedText) {
                        document.dispatchEvent(new CustomEvent('GPL_ClipboardWrite', { detail: copiedText }));
                    }
                }
                return originalExecCommand.apply(this, arguments);
            };
        })();
    `;
    (document.head || document.documentElement).appendChild(injectScript);
    injectScript.remove();

    // Isolated Content Script State
    let isRtlModeActiveForTab = false;
    let isPromptRtlActive = true; 
    let isNotificationActive = false;
    let isAlarmActive = false;
    let alarmAudioContext = null;
    let alarmOscillator = null;
    let alarmGainNode = null;
    let alarmTimeout = null;

    function createButton(text, iconSvg, clickHandler, className = '') {
        const button = document.createElement('button');
        button.className = `gpl-button ${className}`;
        
        const icon = document.createElement('span');
        icon.innerHTML = iconSvg;
        icon.style.cssText = 'width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;';
        button.appendChild(icon);

        if (text) {
            const textSpan = document.createElement('span');
            textSpan.className = 'gpt-button-text';
            textSpan.textContent = text;
            button.appendChild(textSpan);
        }
        
        button.onclick = clickHandler;
        return button;
    }

    function savePrompt(promptText, button) {
        chrome.storage.local.get({ prompts: [] }, (data) => {
            const prompts = data.prompts;
            const textToSave = promptText;
            
            if (prompts.some(p => p.text === textToSave)) {
                const originalHTML = button.innerHTML;
                button.textContent = GPL.t('alreadySaved');
                setTimeout(() => { button.innerHTML = originalHTML; }, 2000);
                return;
            }
            
            const cleanTitle = textToSave.trim().replace(/\n/g, ' ').substring(0, 40) + '...';
            const newPrompt = { id: Date.now(), title: cleanTitle, text: textToSave };
            
            prompts.push(newPrompt);
            chrome.storage.local.set({ prompts }, () => {
                const originalHTML = button.innerHTML;
                const originalBorder = button.style.borderColor;
                button.textContent = GPL.t('savedSuccess');
                button.style.borderColor = '#34a853';
                setTimeout(() => { 
                    button.innerHTML = originalHTML; 
                    button.style.borderColor = originalBorder;
                }, 2000);
            });
        });
    }

    function getCleanPromptFromDOM(userQuery) {
        const lines = userQuery.querySelectorAll('.query-text-line');
        if (lines.length > 0) {
            return Array.from(lines).map(line => {
                let txt = line.textContent;
                if (txt.startsWith(' ')) txt = txt.substring(1);
                if (txt.endsWith(' ')) txt = txt.substring(0, txt.length - 1);
                return txt;
            }).join('\n');
        }
        const queryText = userQuery.querySelector('.query-text');
        if (queryText) {
            const clone = queryText.cloneNode(true);
            const hidden = clone.querySelectorAll('.cdk-visually-hidden');
            hidden.forEach(el => el.remove());
            return clone.innerText.trim();
        }
        return "";
    }

    function addExportChatButton() {
        if (document.getElementById('gpl-export-wrapper')) return;

        if (!document.getElementById('gpl-export-btn-styles')) {
            const style = document.createElement('style');
            style.id = 'gpl-export-btn-styles';
            style.textContent = `
                .gpl-export-wrapper { position: fixed; bottom: 24px; right: 24px; display: flex; align-items: center; gap: 12px; margin-top: 24px; direction: rtl; z-index: 9998 }
                .gpl-toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
                .gpl-toggle-switch input { opacity: 0; width: 0; height: 0; }
                .gpl-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; transition: .3s; border-radius: 24px; border: 1px solid var(--gem-sys-color--outline, #777); }
                .gpl-toggle-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: #cfcfcf; transition: .3s; border-radius: 50%; }
                .gpl-toggle-switch input:checked + .gpl-toggle-slider { background-color: #1a73e8; border-color: #2767ba; }
                .gpl-toggle-switch input:checked + .gpl-toggle-slider:before { transform: translateX(20px); background-color: #fff; }
                .gpl-floating-btn { border-radius: 12px; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid var(--gem-sys-color--outline, transparent); }
                .gpl-floating-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
            `;
            document.head.appendChild(style);
        }

        const oldBtn = document.getElementById('gpl-export-chat-btn');
        if (oldBtn) oldBtn.remove();

        const wrapper = document.createElement('div');
        wrapper.id = 'gpl-export-wrapper';
        wrapper.className = 'gpl-export-wrapper';

        const checkboxContainer = document.createElement('label');
        checkboxContainer.className = 'gpl-toggle-switch';
        checkboxContainer.title = GPL.t('forceHumanModeTitle');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'gpl-force-human-mode';
        
        const slider = document.createElement('span');
        slider.className = 'gpl-toggle-slider';
        
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(slider);

        const exportBtn = document.createElement('button');
        exportBtn.id = 'gpl-export-chat-btn';
        exportBtn.className = 'gpl-floating-btn';
        exportBtn.style.cssText = 'position: relative; right: auto; bottom: auto; left: auto; top: auto; margin: 0; flex-shrink: 0;';
        exportBtn.innerHTML = `
            <span class="gpl-icon">${GPL.icons.markdown}</span>
            <span class="gpl-text">${GPL.t('markdownExportBtn')}</span>
        `;
        
        exportBtn.onclick = async () => {
            const forceHumanMode = document.getElementById('gpl-force-human-mode').checked;
            await exportEntireChat(forceHumanMode);
        };

        wrapper.appendChild(checkboxContainer);
        wrapper.appendChild(exportBtn);

        document.body.appendChild(wrapper);
    }

    async function readCurrentClipboard() {
        try {
            return await navigator.clipboard.readText();
        } catch (err) {
            try {
                const ta = document.createElement('textarea');
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.focus();
                document.execCommand('paste');
                const val = ta.value;
                document.body.removeChild(ta);
                if (val) return val;
            } catch(e) {}
            return null;
        }
    }

    function extractTextCriticalMethod(el) {
        const markdownEl = el.querySelector('.markdown');
        return markdownEl ? markdownEl.innerText : GPL.t('textExtractionError');
    }

    async function writeToClipboardSafe(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                return true;
            } catch(e) {
                return false;
            }
        }
    }

    async function exportEntireChat(forceHumanMode) {
        if (!document.getElementById('gpl-export-styles')) {
            const style = document.createElement('style');
            style.id = 'gpl-export-styles';
            style.textContent = `
                @keyframes gpl-spin { 100% { transform: rotate(360deg); } }
                .gpl-floating-export-panel {
                    position: fixed; bottom: 84px; right: 24px;
                    background: var(--gem-sys-color--surface, #1e1e1e);
                    color: var(--gem-sys-color--on-surface, #e3e3e3);
                    padding: 16px 24px; border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                    z-index: 10000; display: flex; align-items: center; gap: 16px;
                    direction: rtl;
                    border: 1px solid rgba(255,255,255,0.05);
                    transition: opacity 0.3s ease;
                    min-width: 320px;
                }
                .gpl-export-spinner {
                    width: 20px; height: 20px;
                    border: 3px solid var(--gem-sys-color--surface-variant, #444);
                    border-top-color: #1a73e8; border-radius: 50%;
                    animation: gpl-spin 1s linear infinite;
                }
                #gpl-cancel-export-btn:hover { background: #d93025 !important; }
                
                .gpl-name-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 100000; display: flex; align-items: center; justify-content: center; direction: rtl; opacity: 0; transition: opacity 0.3s ease; }
                .gpl-name-modal-card { background: var(--gem-sys-color--surface, #1e1e1e); color: var(--gem-sys-color--on-surface, #e3e3e3); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 32px; width: 90%; max-width: 480px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); transform: translateY(20px); transition: transform 0.3s ease; }
                .gpl-name-modal-overlay.gpl-show { opacity: 1; }
                .gpl-name-modal-overlay.gpl-show .gpl-name-modal-card { transform: translateY(0); }
                .gpl-name-modal-title { font-size: 20px; font-weight: bold; margin: 0 0 8px 0; }
                .gpl-name-modal-desc { font-size: 13px; color: var(--gem-sys-color--on-surface-variant, #aaa); margin: 0 0 24px 0; line-height: 1.5; }
                .gpl-name-modal-input { width: 100%; background: transparent; border: 1px solid var(--gem-sys-color--outline, #555); color: inherit; padding: 12px 16px; border-radius: 10px; font-size: 15px; outline: none; transition: border-color 0.2s; box-sizing: border-box; margin-bottom: 24px; }
                .gpl-name-modal-input:focus { border-color: #1a73e8; }
                .gpl-name-modal-btn { background: #1a73e8; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-size: 15px; font-weight: bold; cursor: pointer; width: 100%; transition: background 0.2s, transform 0.2s; box-shadow: 0 2px 8px rgba(138, 180, 248, 0.2); }
                .gpl-name-modal-btn:hover { background: #a1c2fa; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(138, 180, 248, 0.3); }
                .gpl-name-modal-btn#gpl-final-filename-cancel { background: #5f6368 !important; color: #fff !important; box-shadow: none !important; border-color: transparent !important; }
                .gpl-name-modal-btn#gpl-final-filename-cancel:hover { background: #70757a !important; transform: translateY(0); }
            `;
            document.head.appendChild(style);
        }

        const panel = document.createElement('div');
        panel.id = 'gpl-export-panel';
        panel.className = 'gpl-floating-export-panel' + (GPL.currentLang === 'en' ? ' gpl-lang-en' : '');
        panel.innerHTML = `
            <div class="gpl-export-spinner" id="gpl-export-spinner-icon"></div>
            <div style="display: flex; flex-direction: column; gap: 4px; flex-grow: 1;">
                <p id="gpl-export-status" style="margin:0;font-size:14px;font-weight:bold;">${GPL.t('preparing')}</p>
                <p style="margin:0;font-size:11px;color:#888;">${GPL.t('waitInTab')}</p>
            </div>
            <button id="gpl-cancel-export-btn" style="background: #ea4335; color: white; border: none; padding: 6px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: 0.2s;">${GPL.t('stop')}</button>
        `;
        document.body.appendChild(panel);
        const statusText = document.getElementById('gpl-export-status');
        const spinnerIcon = document.getElementById('gpl-export-spinner-icon');

        let isExportCancelled = false;
        document.getElementById('gpl-cancel-export-btn').onclick = () => {
            isExportCancelled = true;
            statusText.innerText = GPL.t('stoppingAndSaving');
            spinnerIcon.style.display = 'none';
        };

        let rawTitle = document.title || "";
        rawTitle = rawTitle.replace(" - Google Gemini", "").replace("Google Gemini", "").trim();
        rawTitle = rawTitle.replace(" - Gemini", "").replace("Gemini", "").trim();
        
        if (!rawTitle || rawTitle === "صفحه‌ی چت با AI" || rawTitle === "AI Chat Page" || rawTitle.toLowerCase() === "gemini") {
            const firstQueryEl = document.querySelector('user-query');
            if (firstQueryEl) {
                let firstText = getCleanPromptFromDOM(firstQueryEl).trim();
                firstText = firstText.replace(/\n/g, ' ').replace(/\s+/g, ' ');
                let snippet = firstText.length > 40 ? firstText.substring(0, 40) + "..." : firstText;
                rawTitle = snippet;
            } else {
                rawTitle = GPL.t('aiChatPage');
            }
        }

        const scrollContainer = document.querySelector('.chat-history-scroll-container') || document.documentElement;
        const originalScrollTop = scrollContainer.scrollTop;
        
        let lastScrollHeight = scrollContainer.scrollHeight;
        let attempts = 0;
        while(attempts < 10) { 
            if (isExportCancelled) break;
            statusText.innerText = GPL.t('loadingOlder');
            scrollContainer.scrollTop = 0;
            await new Promise(r => setTimeout(r, 800));
            if (scrollContainer.scrollHeight === lastScrollHeight) break;
            lastScrollHeight = scrollContainer.scrollHeight;
            attempts++;
        }

        const elements = document.querySelectorAll('user-query, model-response');
        let fullChatMarkdown = `# 📝 ${GPL.t('chatTitle')}: ${rawTitle}\n\n*${GPL.t('date')}: ${new Date().toLocaleString(GPL.currentLang === 'en' ? 'en-US' : 'fa-IR')}*\n\n---\n\n`;

        let hasCriticalFailures = false;
        let isButtonBroken = false;
        let isButtonConfirmedWorking = false;

        const executeCopyProcess = async (el, index) => {
            const nativeCopyBtn = el.querySelector('button[aria-label="Copy"], gem-icon-button[data-test-id="copy-button"] button, button[aria-label="کپی"]');
            if (!nativeCopyBtn) return null;

            if (!forceHumanMode) {
                const uniqueMarkerFast = `GEMINI_WAITING_FAST_${Date.now()}_${index}`;
                const markerWrittenFast = await writeToClipboardSafe(uniqueMarkerFast);
                
                if (markerWrittenFast) {
                    nativeCopyBtn.click();

                    for (let i = 0; i < 35; i++) {
                        if (isExportCancelled) return null;
                        await new Promise(r => setTimeout(r, 100));
                        const currentText = await readCurrentClipboard();
                        
                        if (currentText && currentText !== uniqueMarkerFast) {
                            return currentText;
                        }
                    }
                }
            }

            const uniqueMarkerStrict = `GEMINI_WAITING_STRICT_${Date.now()}_${index}`;
            const markerWrittenStrict = await writeToClipboardSafe(uniqueMarkerStrict);
            if (!markerWrittenStrict) return null;

            if (forceHumanMode) {
                nativeCopyBtn.click();
            }

            const toastContainer = document.querySelector('.cdk-overlay-container');
            let toastAppeared = false;

            for (let i = 0; i < 150; i++) {
                if (isExportCancelled) return null;
                if (toastContainer && toastContainer.innerHTML.trim() !== '') {
                    toastAppeared = true;
                    break;
                }
                await new Promise(r => setTimeout(r, 100));
            }

            if (toastAppeared) {
                for (let i = 0; i < 80; i++) {
                    if (isExportCancelled) return null;
                    if (!toastContainer || toastContainer.innerHTML.trim() === '') break;
                    await new Promise(r => setTimeout(r, 100));
                }

                let text = await readCurrentClipboard();
                if (text && text !== uniqueMarkerStrict) {
                    const waitTime = forceHumanMode ? 500 : 2000;
                    await new Promise(r => setTimeout(r, waitTime));
                    return text;
                }
            }

            if (isExportCancelled) return null;
            statusText.innerText = GPL.t('retryingMessage', { index: index + 1 });
            
            await new Promise(r => setTimeout(r, 2000));
            if (isExportCancelled) return null;

            const retryMarker = `GEMINI_WAITING_RETRY_${Date.now()}_${index}`;
            await writeToClipboardSafe(retryMarker);

            nativeCopyBtn.click();

            toastAppeared = false;
            for (let i = 0; i < 150; i++) { 
                if (isExportCancelled) return null;
                if (toastContainer && toastContainer.innerHTML.trim() !== '') {
                    toastAppeared = true;
                    break;
                }
                await new Promise(r => setTimeout(r, 100));
            }

            if (toastAppeared) {
                for (let i = 0; i < 80; i++) {
                    if (isExportCancelled) return null;
                    if (!toastContainer || toastContainer.innerHTML.trim() === '') break;
                    await new Promise(r => setTimeout(r, 100));
                }
            }

            let finalText = await readCurrentClipboard();
            await new Promise(r => setTimeout(r, 2000));

            if (finalText && finalText !== retryMarker) {
                return finalText;
            }

            return null;
        };

        for (let i = 0; i < elements.length; i++) {
            if (isExportCancelled) break;

            const el = elements[i];
            
            if (el.tagName.toLowerCase() === 'user-query') {
                let text = getCleanPromptFromDOM(el);
                text = text.replace(/\u00A0/g, ' ');
                fullChatMarkdown += `### 👤 THE_User:\n${text}\n\n`;
            } 
            else if (el.tagName.toLowerCase() === 'model-response') {
                statusText.innerText = GPL.t('extractingMessage', { index: i + 1, total: elements.length });
                
                let copiedContent = null;

                if (isButtonBroken) {
                    copiedContent = extractTextCriticalMethod(el);
                } else {
                    copiedContent = await executeCopyProcess(el, i);
                    
                    if (isExportCancelled) break;

                    if (copiedContent) {
                        isButtonConfirmedWorking = true;
                    } else {
                        if (isButtonConfirmedWorking) {
                            statusText.innerText = GPL.t('unusualDelay');
                            let retries = 0;
                            while (!copiedContent && retries < 3) {
                                if (isExportCancelled) break;
                                copiedContent = await executeCopyProcess(el, i);
                                retries++;
                            }
                            if (!isExportCancelled && !copiedContent) copiedContent = extractTextCriticalMethod(el);
                        } else {
                            isButtonBroken = true;
                            hasCriticalFailures = true;
                            copiedContent = extractTextCriticalMethod(el);
                        }
                    }
                }

                if (!isExportCancelled) {
                    fullChatMarkdown += `### 🤖 THE_AI:\n${copiedContent}\n\n---\n\n`;
                }
            }
        }

        if (isExportCancelled) {
            fullChatMarkdown += GPL.t('exportCancelledByUser');
        }

        if (hasCriticalFailures) {
            const warningText = GPL.t('extensionWarning');
            fullChatMarkdown = fullChatMarkdown.replace('---\n\n', warningText);
        }

        panel.remove();
        scrollContainer.scrollTop = originalScrollTop;

        const exportResult = await new Promise(resolve => {
            chrome.storage.local.get({
                gpl_export_download: true,
                gpl_export_save_library: true
            }, (settings) => {
                const overlay = document.createElement('div');
                overlay.className = 'gpl-name-modal-overlay' + (GPL.currentLang === 'en' ? ' gpl-lang-en' : '');
                overlay.innerHTML = `
                    <div class="gpl-name-modal-card">
                        <h2 class="gpl-name-modal-title">${GPL.t('exportSuccessTitle')}</h2>
                        <p class="gpl-name-modal-desc">${GPL.t('exportSuccessDesc')}</p>
                        <input type="text" class="gpl-name-modal-input" id="gpl-final-filename-input" value="${rawTitle}" style="margin-bottom: 16px;">
                        
                        <div style="display: flex; gap: 20px; margin-bottom: 24px; padding: 12px 16px; border-radius: 8px;">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; user-select: none;">
                                <input type="checkbox" id="gpl-opt-download" ${settings.gpl_export_download ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: #1a73e8; cursor: pointer;">
                                <span>${GPL.t('downloadMarkdownOption')}</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; user-select: none;">
                                <input type="checkbox" id="gpl-opt-library" ${settings.gpl_export_save_library ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: #1a73e8; cursor: pointer;">
                                <span>${GPL.t('addToLibraryOption')}</span>
                            </label>
                        </div>
    
                        <div style="display: flex; gap: 10px;">
                            <button class="gpl-name-modal-btn" id="gpl-final-filename-submit" style="flex: 2;">${GPL.t('confirmAndFinish')}</button>
                            <button class="gpl-name-modal-btn" id="gpl-final-filename-cancel" style="flex: 1; background: #5f6368; border-color: #5f6368;">${GPL.t('cancel')}</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);
                
                overlay.offsetHeight; 
                overlay.classList.add('gpl-show');
    
                const input = document.getElementById('gpl-final-filename-input');
                const submitBtn = document.getElementById('gpl-final-filename-submit');
                const cancelBtn = document.getElementById('gpl-final-filename-cancel');
                const chkDownload = document.getElementById('gpl-opt-download');
                const chkLibrary = document.getElementById('gpl-opt-library');
    
                input.focus();
                input.select();
    
                const finish = () => {
                    const name = input.value.trim() || rawTitle;
                    const dl = chkDownload.checked;
                    const lib = chkLibrary.checked;
    
                    overlay.classList.remove('gpl-show');
                    setTimeout(() => {
                        overlay.remove();
                        resolve({ finalTitle: name, doDownload: dl, doSaveLibrary: lib });
                    }, 300);
                };
    
                submitBtn.onclick = finish;
                
                cancelBtn.onclick = () => {
                    overlay.classList.remove('gpl-show');
                    setTimeout(() => {
                        overlay.remove();
                        resolve({ cancelled: true });
                    }, 300);
                };
    
                input.onkeydown = (e) => {
                    if (e.key === 'Enter') finish();
                };
            });
        });
    
        if (exportResult.cancelled) return;
        const { finalTitle, doDownload, doSaveLibrary } = exportResult;
    
        fullChatMarkdown = fullChatMarkdown.replace(`# 📝 ${GPL.t('chatTitle')}: ${rawTitle}`, `# 📝 ${GPL.t('chatTitle')}: ${finalTitle}`);
        
        if (doSaveLibrary) {
            chrome.storage.local.get({ gpl_markdown_chats: [] }, (data) => {
                const chats = data.gpl_markdown_chats;
                const newId = Date.now();
                chats.push({
                    id: newId,
                    title: finalTitle,
                    date: new Date().toISOString(),
                    content: fullChatMarkdown
                });
                chrome.storage.local.set({ gpl_markdown_chats: chats });
            });
        }
    
        if (doDownload) {
            const safeFileName = finalTitle.replace(/[\\/:*?"<>|]/g, "_");
            const blob = new Blob([fullChatMarkdown], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            const dateStr = new Date().toISOString().slice(0, 10);
            a.download = `${safeFileName} - ${dateStr}.md`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    
        if (hasCriticalFailures) {
            setTimeout(() => {
                alert(GPL.t('exportSuccessAlert'));
            }, 500);
        }
    }

    function playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            const now = audioContext.currentTime;
            const noteDuration = 0.15;
            const pauseDuration = 0.1;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01);
            oscillator.frequency.setValueAtTime(523.25, now);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, now + noteDuration);
            gainNode.gain.linearRampToValueAtTime(0.4, now + noteDuration + pauseDuration);
            oscillator.frequency.setValueAtTime(783.99, now + noteDuration + pauseDuration);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, now + (noteDuration * 2) + pauseDuration + 0.1);
            oscillator.start(now);
            oscillator.stop(now + (noteDuration * 2) + pauseDuration + 0.2);
        } catch (e) {}
    }

    function playAlarmSound() {
        try {
            if (alarmAudioContext) stopAlarmSound();
            alarmAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            alarmOscillator = alarmAudioContext.createOscillator();
            alarmGainNode = alarmAudioContext.createGain();
            alarmOscillator.connect(alarmGainNode);
            alarmGainNode.connect(alarmAudioContext.destination);
            alarmOscillator.type = 'triangle';
            alarmGainNode.gain.setValueAtTime(0, alarmAudioContext.currentTime);

            const notes = [440.00, 554.37, 659.25, 880.00];
            const noteDuration = 0.2;
            const pauseDuration = 0.15;
            const sequenceDuration = (noteDuration + pauseDuration) * notes.length;
            const now = alarmAudioContext.currentTime;
            
            alarmOscillator.start(now);

            const scheduleSequence = (startTime) => {
                let time = startTime;
                for (const note of notes) {
                    alarmOscillator.frequency.setValueAtTime(note, time);
                    alarmGainNode.gain.cancelScheduledValues(time);
                    alarmGainNode.gain.setValueAtTime(0, time);
                    alarmGainNode.gain.linearRampToValueAtTime(0.25, time + 0.01); 
                    alarmGainNode.gain.exponentialRampToValueAtTime(0.0001, time + noteDuration);
                    time += noteDuration + pauseDuration;
                }
            };

            const maxLoops = Math.floor(180 / sequenceDuration);
            for (let i = 0; i < maxLoops; i++) {
                scheduleSequence(now + i * sequenceDuration);
            }
            alarmTimeout = setTimeout(stopAlarmSound, 180000);
        } catch (e) {}
    }

    function stopAlarmSound() {
        if (alarmTimeout) clearTimeout(alarmTimeout);
        alarmTimeout = null;
        if (alarmAudioContext) {
            alarmAudioContext.close().then(() => {
                alarmAudioContext = null;
                alarmOscillator = null;
                alarmGainNode = null;
            });
        }
        const popup = document.getElementById('gpl-alarm-popup');
        if (popup) popup.remove();
    }

    function showAlarmPopup() {
        const existingPopup = document.getElementById('gpl-alarm-popup');
        if (existingPopup) existingPopup.remove();
        const popup = document.createElement('div');
        popup.id = 'gpl-alarm-popup';
        popup.innerHTML = `
            <div class="gpl-alarm-popup-content">
                <p>${GPL.t('aiProcessingFinished')}</p>
                <button id="gpl-stop-alarm-btn">${GPL.t('gotIt')}</button>
            </div>`;
        document.body.appendChild(popup);
        document.getElementById('gpl-stop-alarm-btn').onclick = stopAlarmSound;
    }

    function handleNotifyFeature() {
        const stopButton = document.querySelector('button[aria-label="Stop response"]');
        const buttonsWrapper = document.querySelector('input-area-v2 .input-buttons-wrapper-bottom');

        if (stopButton && buttonsWrapper) {
            if (document.getElementById('gpl-notify-container')) return;

            const notifyContainer = document.createElement('div');
            notifyContainer.id = 'gpl-notify-container';
            notifyContainer.style.cssText = 'display: flex;';

            const sendButtonContainer = buttonsWrapper.querySelector('.send-button-container');
            if (sendButtonContainer) {
                buttonsWrapper.insertBefore(notifyContainer, sendButtonContainer);
            } else {
                return;
            }

            chrome.storage.local.get({ gpl_notification_setting: 'none' }, (data) => {
                if (data.gpl_notification_setting === 'notify') {
                    isNotificationActive = true;
                    isAlarmActive = false;
                } else if (data.gpl_notification_setting === 'alarm') {
                    isNotificationActive = true;
                    isAlarmActive = true;
                } else {
                    isNotificationActive = false;
                    isAlarmActive = false;
                }
                
                const notifyBtn = createButton(GPL.t('notifyMeBtn'), isNotificationActive ? GPL.icons.bell : GPL.icons.bellOff, (e) => {
                    e.stopPropagation();
                    isNotificationActive = !isNotificationActive;
                    if (!isNotificationActive && isAlarmActive) {
                        isAlarmActive = false;
                        document.getElementById('gpl-alarm-btn')?.classList.remove('active');
                    }
                    e.currentTarget.classList.toggle('active', isNotificationActive);
                    const iconSpan = e.currentTarget.querySelector('span:first-child');
                    if (iconSpan) iconSpan.innerHTML = isNotificationActive ? GPL.icons.bell : GPL.icons.bellOff;
                }, 'gpl-notify-btn');
                notifyBtn.id = 'gpl-notify-btn';
                notifyBtn.classList.toggle('active', isNotificationActive);
                notifyBtn.title = GPL.t('notifyMeTooltip');

                const alarmBtn = createButton(GPL.t('alarmBtn'), GPL.icons.alarm, (e) => {
                    e.stopPropagation();
                    isAlarmActive = !isAlarmActive;
                    if (isAlarmActive && !isNotificationActive) {
                        isNotificationActive = true;
                        const notifyBtnElem = document.getElementById('gpl-notify-btn');
                        if(notifyBtnElem) {
                            notifyBtnElem.classList.add('active');
                            const notifyIcon = notifyBtnElem.querySelector('span:first-child');
                            if(notifyIcon) notifyIcon.innerHTML = GPL.icons.bell;
                        }
                    }
                    e.currentTarget.classList.toggle('active', isAlarmActive);
                }, 'gpl-alarm-btn');
                alarmBtn.id = 'gpl-alarm-btn';
                alarmBtn.classList.toggle('active', isAlarmActive);
                alarmBtn.title = GPL.t('alarmTooltip');

                notifyContainer.appendChild(notifyBtn);
                notifyContainer.appendChild(alarmBtn);
            });
            
        } else {
            const notifyContainer = document.getElementById('gpl-notify-container');
            if (notifyContainer) {
                if (isAlarmActive) { playAlarmSound(); showAlarmPopup(); } 
                else if (isNotificationActive) { playNotificationSound(); }
                isNotificationActive = false;
                isAlarmActive = false;
                notifyContainer.remove();
            }
        }
    }

    function applyCanvasRtlStyle() {
        const rtlButton = document.getElementById('gpl-canvas-rtl-toggle-btn');
        const responseContainer = document.querySelector('immersive-panel .response-container');
        const immersiveEditor = document.querySelector('immersive-panel immersive-editor');
        if (!rtlButton) return;
        rtlButton.classList.toggle('active', isRtlModeActiveForTab);
        if (responseContainer) responseContainer.style.direction = isRtlModeActiveForTab ? 'rtl' : '';
        if (immersiveEditor) immersiveEditor.style.direction = isRtlModeActiveForTab ? 'rtl' : '';
    }

    function applyPromptRtlStyle() {
        const editor = document.querySelector('.ql-editor');
        const button = document.getElementById('gpl-prompt-rtl-toggle-btn');
        if (editor) editor.style.direction = isPromptRtlActive ? 'rtl' : 'ltr';
        if (button) button.classList.toggle('active', isPromptRtlActive);
    }

    function initializeRtlFeatures() {
        const immersivePanel = document.querySelector('immersive-panel');
        if (immersivePanel) {
            if (!immersivePanel.hasAttribute('data-rtl-manual-override')) {
                const editorContent = immersivePanel.querySelector('.immersive-editor .ProseMirror');
                if (editorContent && editorContent.textContent.length > 10 && !immersivePanel.hasAttribute('data-rtl-initial-detect-done')) {
                    const initialText = editorContent.textContent.substring(0, 200);
                    const persianRegex = /[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]/;
                    isRtlModeActiveForTab = persianRegex.test(initialText);
                    immersivePanel.setAttribute('data-rtl-initial-detect-done', 'true');
                }
            }
            if (!immersivePanel.querySelector('#gpl-canvas-rtl-toggle-btn')) {
                const toolbarLeftPanel = immersivePanel.querySelector('toolbar .left-panel');
                if (toolbarLeftPanel) {
                    const rtlButton = createButton('', GPL.icons.rtl, (e) => {
                        e.stopPropagation();
                        isRtlModeActiveForTab = !isRtlModeActiveForTab;
                        immersivePanel.setAttribute('data-rtl-manual-override', 'true'); 
                        applyCanvasRtlStyle();
                    });
                    rtlButton.id = 'gpl-canvas-rtl-toggle-btn';
                    rtlButton.title = GPL.t('canvasRtlTooltip');
                    rtlButton.classList.add('gpl-toolbar-icon-button');
                    
                    const formattingButtons = toolbarLeftPanel.querySelector('formatting-buttons');
                    if (formattingButtons) toolbarLeftPanel.insertBefore(rtlButton, formattingButtons);
                    else toolbarLeftPanel.appendChild(rtlButton);
                }
            }
            applyCanvasRtlStyle();
        }

        const leadingActions = document.querySelector('input-area-v2 .leading-actions-wrapper');
        if (leadingActions && !document.getElementById('gpl-prompt-rtl-toggle-btn')) {
            const promptRtlButton = createButton('', GPL.icons.rtl, (e) => {
                e.stopPropagation();
                isPromptRtlActive = !isPromptRtlActive;
                applyPromptRtlStyle();
            });
            promptRtlButton.id = 'gpl-prompt-rtl-toggle-btn';
            promptRtlButton.title = GPL.t('inputRtlTooltip');
            promptRtlButton.classList.add('gpl-input-action-button');
            
            const libraryButton = document.getElementById('open-library-btn');
            if(libraryButton) leadingActions.insertBefore(promptRtlButton, libraryButton);
            else leadingActions.appendChild(promptRtlButton);
        }
        applyPromptRtlStyle();
    }

    function addActionButtonsToMessages() {
        document.querySelectorAll('user-query:not(.gpl-processed)').forEach(userQuery => {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'gemini-pro-tools-buttons';
            buttonContainer.style.marginTop = '8px';
            buttonContainer.style.textAlign = 'right';

            const savePromptBtn = createButton(GPL.t('savePromptBtn'), GPL.icons.save, (e) => {
                e.stopPropagation();
                const nativeCopyBtn = userQuery.querySelector('button[aria-label="Copy prompt"], gem-icon-button[data-test-id="prompt-copy-button"] button');
                
                if (nativeCopyBtn) {
                    let caught = false;
                    const onCopy = (evt) => {
                        caught = true;
                        clearTimeout(fallbackTimer);
                        document.removeEventListener('GPL_ClipboardWrite', onCopy);
                        let textToSave = evt.detail.replace(/\u00A0/g, ' ');
                        savePrompt(textToSave, e.currentTarget);
                    };
                    
                    document.addEventListener('GPL_ClipboardWrite', onCopy);
                    nativeCopyBtn.click();
                    
                    const fallbackTimer = setTimeout(() => {
                        if (!caught) {
                            document.removeEventListener('GPL_ClipboardWrite', onCopy);
                            let textToSave = getCleanPromptFromDOM(userQuery).replace(/\u00A0/g, ' ');
                            savePrompt(textToSave, e.currentTarget);
                        }
                    }, 500);

                } else {
                    let textToSave = getCleanPromptFromDOM(userQuery).replace(/\u00A0/g, ' ');
                    savePrompt(textToSave, e.currentTarget);
                }
            });

            buttonContainer.appendChild(savePromptBtn);
            userQuery.querySelector('.query-content')?.appendChild(buttonContainer);
            userQuery.classList.add('gpl-processed');
        });

        document.querySelectorAll('model-response:not(.gpl-processed)').forEach(modelResponse => {
            modelResponse.classList.add('gpl-processed');
        });
    }

    function applyTheme() {
        const isLightTheme = document.body.classList.contains('light-theme');
        document.body.classList.toggle('gpl-theme-active-light', isLightTheme);
        document.body.classList.toggle('gpl-theme-active-dark', !isLightTheme);
        const modal = document.getElementById('gemini-prompt-library-modal');
        if (modal) {
            modal.classList.toggle('gpl-light-theme', isLightTheme);
        }
    }

    function addLibraryButtonToInput() {
        const leadingActions = document.querySelector('input-area-v2 .leading-actions-wrapper');
        if (leadingActions && !document.getElementById('open-library-btn')) {
            const libraryBtn = document.createElement('button');
            libraryBtn.id = 'open-library-btn';
            libraryBtn.className = 'gpl-button gpl-input-action-button';
            libraryBtn.innerHTML = GPL.icons.library;
            libraryBtn.title = GPL.t('openPromptLibraryTooltip');
            libraryBtn.addEventListener('click', GPL.toggleModal);
            leadingActions.appendChild(libraryBtn);
        }
    }

    function updateGeminiUITranslations() {
        const exportBtn = document.getElementById('gpl-export-chat-btn');
        if (exportBtn) {
            const textEl = exportBtn.querySelector('.gpl-text');
            if (textEl) textEl.textContent = GPL.t('markdownExportBtn');
        }
        
        const forceHumanEl = document.getElementById('gpl-force-human-mode');
        if (forceHumanEl) {
            const labelEl = forceHumanEl.closest('.gpl-toggle-switch');
            if (labelEl) labelEl.title = GPL.t('forceHumanModeTitle');
        }
        
        const notifyBtn = document.getElementById('gpl-notify-btn');
        if (notifyBtn) {
            const textEl = notifyBtn.querySelector('.gpt-button-text');
            if (textEl) textEl.textContent = GPL.t('notifyMeBtn');
            notifyBtn.title = GPL.t('notifyMeTooltip');
        }
        
        const alarmBtn = document.getElementById('gpl-alarm-btn');
        if (alarmBtn) {
            const textEl = alarmBtn.querySelector('.gpt-button-text');
            if (textEl) textEl.textContent = GPL.t('alarmBtn');
            alarmBtn.title = GPL.t('alarmTooltip');
        }
        
        const canvasRtlBtn = document.getElementById('gpl-canvas-rtl-toggle-btn');
        if (canvasRtlBtn) {
            canvasRtlBtn.title = GPL.t('canvasRtlTooltip');
        }
        
        const promptRtlBtn = document.getElementById('gpl-prompt-rtl-toggle-btn');
        if (promptRtlBtn) {
            promptRtlBtn.title = GPL.t('inputRtlTooltip');
        }
        
        const openLibraryBtn = document.getElementById('open-library-btn');
        if (openLibraryBtn) {
            openLibraryBtn.title = GPL.t('openPromptLibraryTooltip');
        }

        document.querySelectorAll('.gemini-pro-tools-buttons button').forEach(btn => {
            const textSpan = btn.querySelector('.gpt-button-text');
            if (textSpan && (textSpan.textContent === GPL.locales['fa']['savePromptBtn'] || textSpan.textContent === GPL.locales['en']['savePromptBtn'])) {
                textSpan.textContent = GPL.t('savePromptBtn');
            }
        });
    }

    // Sync state changes across tabs
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.gpl_lang) {
            GPL.currentLang = changes.gpl_lang.newValue;
            if (GPL.currentLang === 'en') {
                document.body.classList.add('gpl-lang-en');
            } else {
                document.body.classList.remove('gpl-lang-en');
            }
            updateGeminiUITranslations();
            GPL.updateLanguageUI();
        }
    });

    // Content script initialization
    GPL.loadLanguageAndInit(() => {
        if (GPL.currentLang === 'en') {
            document.body.classList.add('gpl-lang-en');
        } else {
            document.body.classList.remove('gpl-lang-en');
        }
        
        GPL.initCommon();

        let mainObserverTimer = null;
        const observer = new MutationObserver(() => {
            if (mainObserverTimer) clearTimeout(mainObserverTimer);
            mainObserverTimer = setTimeout(() => {
                addActionButtonsToMessages();
                addLibraryButtonToInput();
                addExportChatButton();
                handleNotifyFeature();
                initializeRtlFeatures(); 
            }, 300);
        });
        observer.observe(document.body, { childList: true, subtree: true });

        let themeObserverTimer = null;
        const themeObserver = new MutationObserver(() => {
            if (themeObserverTimer) clearTimeout(themeObserverTimer);
            themeObserverTimer = setTimeout(() => applyTheme(), 150);
        });
        themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        setTimeout(() => {
            addActionButtonsToMessages();
            addLibraryButtonToInput();
            addExportChatButton();
            handleNotifyFeature();
            initializeRtlFeatures();
            applyTheme();
        }, 1000);
    });
})();