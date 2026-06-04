(function() {
    // Shared global namespace for communicating between scripts
    window.GPL = window.GPL || {};

    GPL.icons = {
        save: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
        library: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
        use: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>`,
        edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        delete: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        bell: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
        bellOff: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
        alarm: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l2 2"></path><path d="M5 3L2 6"></path><path d="M22 6l-3-3"></path></svg>`,
        rtl: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 6H3"/><path d="M17 12H3"/><path d="M11 18H3"/><path d="m7 3-4 4 4 4"/></svg>`,
        export: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        import: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
        markdown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h20v18H2z"></path><path d="m14 13 3 4 3-4"></path><path d="M17 17V7"></path><path d="M4 17V7l3 5 3-5v10"></path></svg>`,
        copy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
        fullscreen: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`,
        minimize: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`
    };

    GPL.locales = {
        fa: {
            geminiTools: "ابزارهای Gemini",
            promptLibrary: "کتابخانه پرامپت",
            chatLibrary: "کتابخانه چت‌ها",
            settings: "تنظیمات",
            toggleTheme: "تغییر پوسته",
            close: "بستن",
            promptTitlePlaceholder: "عنوان پرامپت...",
            promptTextPlaceholder: "متن کامل پرامپت...",
            saveNewPrompt: "ذخیره پرامپت جدید",
            cancelEdit: "لغو ویرایش",
            savedPromptsTitle: "پرامپت‌های ذخیره شده",
            noPromptsSaved: "هنوز پرامپتی ذخیره نشده است.",
            copyPrompt: "کپی کردن پرامپت",
            edit: "ویرایش",
            delete: "حذف",
            confirmDeletePrompt: "آیا از حذف این پرامپت مطمئن هستید؟",
            saveChanges: "ذخیره تغییرات",
            copied: "کپی شد!",
            savedChatsTitle: "چت‌های ذخیره شده",
            addManually: "+ افزودن Markdown",
            addManuallyShort: "+ افزودن دستی",
            selectChatToView: "یک چت را برای مشاهده انتخاب کنید.",
            continueChat: "ادامه چت (کپی کردن کل Markdown)",
            copiedContinueChat: "کپی شد! حالا می‌تونی توی چت جمینای پِیستش کنی.",
            addMarkdownTitle: "افزودن دستی فایل Markdown",
            editMarkdownTitle: "ویرایش Markdown چت",
            markdownPlaceholder: "محتوای فایل .md خود را اینجا پیست کنید...",
            cancel: "لغو",
            add: "افزودن",
            chatExportDefaults: "پیش‌فرض‌های خروجی چت",
            downloadDefault: "دانلود فایل Markdown به صورت پیش‌فرض",
            saveLibraryDefault: "افزودن به کتابخانه چت‌ها به صورت پیش‌فرض",
            notificationDefaults: "تنظیمات پیش‌فرض اعلان",
            none: "هیچکدام",
            enableNotify: "روشن شدن \"باخبر\"",
            enableAlarm: "روشن شدن \"آلارم\"",
            managePromptData: "مدیریت داده‌های پرامپت",
            import: "وارد کردن",
            export: "خروجی گرفتن",
            libraryEmpty: "کتابخانه پرامپت شما خالی است.",
            confirmImport: "شما در حال وارد کردن {count} پرامپت هستید. ادامه می‌دهید؟",
            importSuccess: "{count} پرامپت جدید وارد شد.",
            errorPrefix: "خطا: ",
            invalidFileFormat: "فرمت فایل نامعتبر است.",
            noChatsSaved: "هیچ چتی ذخیره نشده است.",
            confirmDeleteChat: "آیا از حذف این چت مطمئن هستید؟",
            showFullTextSent: "نمایش کامل متنی که فرستادم",
            exitFullscreen: "خروج از تمام صفحه",
            fullscreen: "تمام صفحه",
            alreadySaved: "از قبل ذخیره شده!",
            savedSuccess: "ذخیره شد!",
            savePromptBtn: "ذخیره پرامپت",
            forceHumanModeTitle: "فورس متد انسانی (امن‌تر اما کندتر)",
            markdownExportBtn: "خروجی Markdown",
            preparing: "در حال آماده‌سازی...",
            waitInTab: "لطفاً در تب منتظر بمانید",
            stop: "توقف",
            stoppingAndSaving: "در حال توقف و ساخت فایل...",
            loadingOlder: "در حال بارگذاری پیام‌های قدیمی‌تر...",
            aiChatPage: "صفحه‌ی چت با AI",
            textExtractionError: "[خطا در استخراج متن]",
            retryingMessage: "🔄 تلاش مجدد قطعی برای پیام {index}...",
            extractingMessage: "در حال استخراج... پیام {index} از {total}",
            unusualDelay: "⏳ تأخیر غیرعادی! در حال تلاش مجدد...",
            exportCancelledByUser: "\n> 🛑 **عملیات خروجی در این نقطه توسط کاربر متوقف شد.**\n",
            extensionWarning: "> ⚠️ **اخطار اکستنشن:** ارتباط با دکمه‌ی کپی ناموفق بود (احتمالاً به دلیل قطعی اینترنت یا محدودیت مرورگر). پیام‌های هوش مصنوعی مستقیماً از روی صفحه استخراج شده‌اند و ممکن است قالب‌بندی markdown کاملی نداشته باشند.\n\n---\n\n",
            exportSuccessTitle: "✨ خروجی موفق: چتت در مورد چی بود؟!",
            exportSuccessDesc: "عنوان چت را برای ذخیره وارد کنید و عملیات‌های مورد نظر را انتخاب نمایید:",
            downloadMarkdownOption: "دانلود فایل Markdown",
            addToLibraryOption: "افزودن به کتابخانه چت‌ها",
            confirmAndFinish: "تایید و اتمام",
            exportSuccessAlert: "عملیات خروجی با موفقیت انجام شد، اما به دلیل اختلال در کپی برخی پیام‌ها (مثل قطعی اینترنت یا مسدود شدن کلیپ‌بورد)، اکستنشن از \"متد بحرانی\" برای نجات دادن پیام‌ها استفاده کرد. لطفاً پیام‌های دارای اخطار ⚠️ را در فایل دانلودی چک کنید.",
            aiProcessingFinished: "پردازش هوش مصنوعی به پایان رسید!",
            gotIt: "دیدم!",
            notifyMeBtn: "باخبر!",
            notifyMeTooltip: "وقتی تمام شد با یک صدای کوتاه خبرم کن!",
            alarmBtn: "آلارم!",
            alarmTooltip: "وقتی تمام شد تا 3 دقیقه آلارم پخش کن!",
            canvasRtlTooltip: "تغییر جهت متن Canvas",
            inputRtlTooltip: "تغییر جهت کادر ورودی",
            openPromptLibraryTooltip: "باز کردن کتابخانه پرامپت",
            langSettingsTitle: "تنظیمات زبان / Language Settings",
            langPersian: "فارسی (Persian)",
            langEnglish: "English",
            langChangeConfirm: "تغییر زبان نیاز به بارگذاری مجدد صفحه دارد. آیا مایلید صفحه اکنون مجدداً بارگذاری شود؟",
            chatTitle: "عنوان چت",
            date: "تاریخ",
            manualChatTitle: "چت وارد شده دستی",
            showLeaveMessageTitle: "جلوگیری از بسته شدن اتفاقی تب",
            customFontTitle: "فونت دلخواه (سراسری)",
            customFontPlaceholder: "مثلا iransans (اگر خالی باشد، وزیرمتن لود می‌شود)",
            devSignature: "طراحی شده با 💚 توسط <strong>شایان فرهنگ پژوه</strong>",
            devWebsiteUrl: "https://shayanfp.ir"
        },
        en: {
            geminiTools: "Gemini Tools",
            promptLibrary: "Prompt Library",
            chatLibrary: "Chat Library",
            settings: "Settings",
            toggleTheme: "Toggle Theme",
            close: "Close",
            promptTitlePlaceholder: "Prompt title...",
            promptTextPlaceholder: "Full prompt text...",
            saveNewPrompt: "Save New Prompt",
            cancelEdit: "Cancel Edit",
            savedPromptsTitle: "Saved Prompts",
            noPromptsSaved: "No prompts saved yet.",
            copyPrompt: "Copy Prompt",
            edit: "Edit",
            delete: "Delete",
            confirmDeletePrompt: "Are you sure you want to delete this prompt?",
            saveChanges: "Save Changes",
            copied: "Copied!",
            savedChatsTitle: "Saved Chats",
            addManually: "+ Add Markdown",
            addManuallyShort: "+ Add Manually",
            selectChatToView: "Select a chat to view.",
            continueChat: "Continue Chat (Copy full Markdown)",
            copiedContinueChat: "Copied! Now you can paste it in Gemini chat.",
            addMarkdownTitle: "Add Markdown Manually",
            editMarkdownTitle: "Edit Chat Markdown",
            markdownPlaceholder: "Paste your .md file content here...",
            cancel: "Cancel",
            add: "Add",
            chatExportDefaults: "Default Chat Export Settings",
            downloadDefault: "Download Markdown file by default",
            saveLibraryDefault: "Add to chat library by default",
            notificationDefaults: "Default Notification Settings",
            none: "None",
            enableNotify: "Enable 'Notify'",
            enableAlarm: "Enable 'Alarm'",
            managePromptData: "Prompt Data Management",
            import: "Import",
            export: "Export",
            libraryEmpty: "Your prompt library is empty.",
            confirmImport: "You are importing {count} prompts. Do you want to continue?",
            importSuccess: "{count} new prompts imported.",
            errorPrefix: "Error: ",
            invalidFileFormat: "Invalid file format.",
            noChatsSaved: "No chats saved yet.",
            confirmDeleteChat: "Are you sure you want to delete this chat?",
            showFullTextSent: "Show full text sent",
            exitFullscreen: "Exit Fullscreen",
            fullscreen: "Fullscreen",
            alreadySaved: "Already saved!",
            savedSuccess: "Saved!",
            savePromptBtn: "Save Prompt",
            forceHumanModeTitle: "Force human method (safer but slower)",
            markdownExportBtn: "Markdown Export",
            preparing: "Preparing...",
            waitInTab: "Please wait in this tab",
            stop: "Stop",
            stoppingAndSaving: "Stopping and generating file...",
            loadingOlder: "Loading older messages...",
            aiChatPage: "AI Chat Page",
            textExtractionError: "[Error extracting text]",
            retryingMessage: "🔄 Retrying message {index}...",
            extractingMessage: "Extracting... message {index} of {total}",
            unusualDelay: "Unusual delay! Retrying...",
            exportCancelledByUser: "\n> 🛑 **Export operation was stopped by the user at this point.**\n",
            extensionWarning: "> ⚠️ **Extension Warning:** Connection with the copy button failed (possibly due to network issues or browser restrictions). AI messages were extracted directly from the page and may lack complete markdown formatting.\n\n---\n\n",
            exportSuccessTitle: "✨ Successful Export: What was your chat about?",
            exportSuccessDesc: "Enter chat title to save and select desired actions:",
            downloadMarkdownOption: "Download Markdown file",
            addToLibraryOption: "Add to chat library",
            confirmAndFinish: "Confirm & Finish",
            exportSuccessAlert: "Export completed successfully, but due to issues copying some messages (like network disconnect or clipboard block), the extension used the \"critical method\" to recover messages. Please check messages with ⚠️ warning in the downloaded file.",
            aiProcessingFinished: "AI processing finished!",
            gotIt: "Got it!",
            notifyMeBtn: "Notify!",
            notifyMeTooltip: "Notify me with a short sound when finished!",
            alarmBtn: "Alarm!",
            alarmTooltip: "Play alarm for up to 3 minutes when finished!",
            canvasRtlTooltip: "Toggle Canvas text direction",
            inputRtlTooltip: "Toggle input box direction",
            openPromptLibraryTooltip: "Open Prompt Library",
            langSettingsTitle: "Language Settings",
            langPersian: "Persian (فارسی)",
            langEnglish: "English",
            langChangeConfirm: "Changing language requires reloading the page. Do you want to reload now?",
            chatTitle: "Chat Title",
            date: "Date",
            manualChatTitle: "Manually Imported Chat",
            showLeaveMessageTitle: "Prevent accidental tab closure",
            customFontTitle: "Custom Font (Global)",
            customFontPlaceholder: "e.g., iransans (loads Vazirmatn if empty)",
            devSignature: "Designed with 💚 by <strong>Shayan Farhang Pazhooh</strong>",
            devWebsiteUrl: "https://shayanfp.ir/en"
        }
    };

    GPL.currentLang = 'fa';

    GPL.t = function(key, replacements = {}) {
        const lang = GPL.currentLang || 'fa';
        let text = (GPL.locales[lang] && GPL.locales[lang][key]) || (GPL.locales['fa'] && GPL.locales['fa'][key]) || key;
        for (const [k, v] of Object.entries(replacements)) {
            text = text.replace(`{${k}}`, v);
        }
        return text;
    };

    GPL.loadLanguageAndInit = function(callback) {
        chrome.storage.local.get({ gpl_lang: 'fa' }, (data) => {
            GPL.currentLang = data.gpl_lang;
            if (callback) callback();
        });
    };

    GPL.escapeHTML = function(str) {
        const p = document.createElement("p");
        p.textContent = str;
        return p.innerHTML;
    };

    // Private Module-Level State
    let libraryModal = null;
    let prompts = [];
    let savedChats = [];
    let currentLoadedChatContent = '';
    const isExtensionPopup = !window.location.pathname.endsWith('library.html');

    // DOM Elements (assigned on initCommon)
    let promptList, saveBtn, cancelEditBtn, promptIdInput, promptTitleInput, promptTextInput;
    let chatListContainer, chatMessagesContainer, chatHeader, chatViewTitle, chatViewDate;
    let addChatBtn, importMdModal, cancelMdBtn, saveMdBtn, importMdText;
    let chkExportDl, chkExportLib, chkLeaveMessage, txtCustomFont;

    GPL.initCommon = function() {
        libraryModal = document.getElementById('gemini-prompt-library-modal');
        if (!libraryModal) {
            libraryModal = document.createElement('div');
            libraryModal.id = 'gemini-prompt-library-modal';
            document.body.appendChild(libraryModal);
        }
        
        if (libraryModal.querySelector('.gpl-modal-content')) return;

        if (GPL.currentLang === 'en') {
            libraryModal.classList.add('gpl-lang-en');
            document.body.classList.add('gpl-lang-en');
            if (!isExtensionPopup) {
                document.documentElement.dir = 'ltr';
                document.documentElement.lang = 'en';
            }
        } else {
            libraryModal.classList.remove('gpl-lang-en');
            document.body.classList.remove('gpl-lang-en');
            if (!isExtensionPopup) {
                document.documentElement.dir = 'rtl';
                document.documentElement.lang = 'fa';
            }
        }

        libraryModal.innerHTML = `
        <div class="gpl-modal-content">
            <div class="gpl-modal-header">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <h1 data-gpl-t="geminiTools">${GPL.t('geminiTools')}</h1>
                    <div class="gpl-tabs">
                        <button class="gpl-tab-btn active" data-tab="prompts" data-gpl-t="promptLibrary">${GPL.t('promptLibrary')}</button>
                        <button class="gpl-tab-btn" data-tab="chats" data-gpl-t="chatLibrary">${GPL.t('chatLibrary')}</button>
                        <button class="gpl-tab-btn" data-tab="settings" data-gpl-t="settings">${GPL.t('settings')}</button>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    ${!isExtensionPopup ? `<button id="gpl-theme-toggle" data-gpl-t-title="toggleTheme" title="${GPL.t('toggleTheme')}" style="background:none;border:none;cursor:pointer;font-size:1.2em;">🌓</button>` : ''}
                    <button id="gpl-close-modal-btn" data-gpl-t-title="close" title="${GPL.t('close')}" style="background:none;border:none;color:var(--gpl-secondary-text-color);cursor:pointer;font-size:1.2em;">✖</button>
                </div>
            </div>
            <main>
                <div id="gpl-tab-prompts" class="gpl-tab-content active">
                    <div class="gpl-prompt-form">
                        <input type="hidden" id="gpl-prompt-id">
                        <input type="text" id="gpl-prompt-title" data-gpl-t-placeholder="promptTitlePlaceholder" placeholder="${GPL.t('promptTitlePlaceholder')}">
                        <textarea id="gpl-prompt-text" data-gpl-t-placeholder="promptTextPlaceholder" placeholder="${GPL.t('promptTextPlaceholder')}" rows="5"></textarea>
                        <div class="gpl-form-buttons">
                            <button id="gpl-save-btn" class="gpl-btn gpl-btn-primary" data-gpl-t="saveNewPrompt">${GPL.t('saveNewPrompt')}</button>
                            <button id="gpl-cancel-edit-btn" class="gpl-btn gpl-btn-secondary" data-gpl-t="cancelEdit" style="display: none;">${GPL.t('cancelEdit')}</button>
                        </div>
                    </div>
                    <div class="gpl-prompt-list-container">
                        <h2 data-gpl-t="savedPromptsTitle">${GPL.t('savedPromptsTitle')}</h2>
                        <div id="gpl-prompt-list"></div>
                    </div>
                </div>

                <div id="gpl-tab-chats" class="gpl-tab-content" style="display: none;">
                    <div class="gpl-chats-layout">
                        <div class="gpl-chats-sidebar">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <h2 data-gpl-t="savedChatsTitle">${GPL.t('savedChatsTitle')}</h2>
                                <button id="gpl-add-chat-btn" class="gpl-btn gpl-btn-primary" data-gpl-t="addManually" style="padding: 5px 10px; font-size: 12px;">${GPL.t('addManually')}</button>
                            </div>
                            <div id="gpl-chat-list"></div>
                        </div>
                        <div class="gpl-chat-view-container">
                            <div id="gpl-chat-header" class="gpl-chat-header" style="display: none;">
                                <div>
                                    <h2 id="gpl-chat-view-title" data-gpl-t="chatTitle">${GPL.t('chatTitle')}</h2>
                                    <span id="gpl-chat-view-date" class="gpl-chat-date" data-gpl-t="date">${GPL.t('date')}</span>
                                </div>
                                <button id="gpl-chat-fullscreen-btn" class="gpl-btn-icon" data-gpl-t-title="fullscreen" title="${GPL.t('fullscreen')}">${GPL.icons.fullscreen}</button>
                            </div>
                            <div id="gpl-chat-messages" class="gpl-chat-messages">
                                <div class="gpl-empty-message" data-gpl-t="selectChatToView">${GPL.t('selectChatToView')}</div>
                            </div>
                            <div id="gpl-chat-footer" style="display: none; padding: 15px; border-top: 1px solid var(--gpl-border-color); background: var(--gpl-item-bg-color); text-align: center;">
                                <button id="gpl-continue-chat-btn" class="gpl-btn gpl-btn-primary" data-gpl-t="continueChat" style="width: 100%; font-size: 14px; font-weight: bold;">${GPL.t('continueChat')}</button>
                            </div>
                        </div>
                    </div>
                    
                    <div id="gpl-import-md-modal" class="gpl-md-modal" style="display: none;">
                        <div class="gpl-md-modal-content">
                            <h3 id="gpl-import-md-title" data-gpl-t="addMarkdownTitle">${GPL.t('addMarkdownTitle')}</h3>
                            <textarea id="gpl-import-md-text" rows="10" data-gpl-t-placeholder="markdownPlaceholder" placeholder="${GPL.t('markdownPlaceholder')}" style="width: 100%; box-sizing: border-box; margin-bottom: 10px; font-family: monospace; direction: ltr; padding: 10px; border-radius: 8px; background: var(--gpl-secondary-color); color: var(--gpl-text-color); border: 1px solid var(--gpl-border-color);"></textarea>
                            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                                <button id="gpl-cancel-md-btn" class="gpl-btn gpl-btn-secondary" data-gpl-t="cancel">${GPL.t('cancel')}</button>
                                <button id="gpl-save-md-btn" class="gpl-btn gpl-btn-primary" data-gpl-t="add">${GPL.t('add')}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="gpl-tab-settings" class="gpl-tab-content" style="display: none;">
                    <div class="gpl-settings-section" style="margin-top: 0; border-top: none;">
                        <h2 data-gpl-t="chatExportDefaults">${GPL.t('chatExportDefaults')}</h2>
                        <div class="gpl-settings-options">
                            <label class="gpl-radio-option" style="cursor: pointer; justify-content: flex-start;">
                                <input type="checkbox" id="gpl-setting-export-dl" style="width: 18px; height: 18px; accent-color: #34a853;">
                                <span data-gpl-t="downloadDefault">${GPL.t('downloadDefault')}</span>
                            </label>
                            <label class="gpl-radio-option" style="cursor: pointer; justify-content: flex-start;">
                                <input type="checkbox" id="gpl-setting-export-lib" style="width: 18px; height: 18px; accent-color: #34a853;">
                                <span data-gpl-t="saveLibraryDefault">${GPL.t('saveLibraryDefault')}</span>
                            </label>
                        </div>
                    </div>
                    <div class="gpl-settings-section">
                        <h2 data-gpl-t="notificationDefaults">${GPL.t('notificationDefaults')}</h2>
                        <div class="gpl-settings-options">
                            <div class="gpl-radio-option" data-value="none">
                                <span class="gpl-radio-check"></span><span data-gpl-t="none">${GPL.t('none')}</span>
                            </div>
                            <div class="gpl-radio-option" data-value="notify">
                                <span class="gpl-radio-check"></span><span data-gpl-t="enableNotify">${GPL.t('enableNotify')}</span>
                            </div>
                            <div class="gpl-radio-option" data-value="alarm">
                                <span class="gpl-radio-check"></span><span data-gpl-t="enableAlarm">${GPL.t('enableAlarm')}</span>
                            </div>
                        </div>
                    </div>
                    <div class="gpl-settings-section">
                        <h2 data-gpl-t="langSettingsTitle">${GPL.t('langSettingsTitle')}</h2>
                        <div class="gpl-settings-options" style="flex-direction: row; gap: 20px;">
                            <label class="gpl-radio-option" style="cursor: pointer; justify-content: flex-start; flex-grow: 1;">
                                <input type="radio" name="gpl-lang-select" value="fa" id="gpl-lang-fa-opt" style="width: 18px; height: 18px; accent-color: #34a853;">
                                <span data-gpl-t="langPersian">${GPL.t('langPersian')}</span>
                            </label>
                            <label class="gpl-radio-option" style="cursor: pointer; justify-content: flex-start; flex-grow: 1;">
                                <input type="radio" name="gpl-lang-select" value="en" id="gpl-lang-en-opt" style="width: 18px; height: 18px; accent-color: #34a853;">
                                <span data-gpl-t="langEnglish">${GPL.t('langEnglish')}</span>
                            </label>
                        </div>
                    </div>
                    <div class="gpl-settings-section">
                        <h2 data-gpl-t="showLeaveMessageTitle">${GPL.t('showLeaveMessageTitle')}</h2>
                        <div class="gpl-settings-options">
                            <label class="gpl-radio-option" style="cursor: pointer; justify-content: flex-start;">
                                <input type="checkbox" id="gpl-setting-leave-message" style="width: 18px; height: 18px; accent-color: #34a853;">
                                <span data-gpl-t="showLeaveMessageTitle">${GPL.t('showLeaveMessageTitle')}</span>
                            </label>
                        </div>
                    </div>
                    <div class="gpl-settings-section">
                        <h2 data-gpl-t="customFontTitle">${GPL.t('customFontTitle')}</h2>
                        <div class="gpl-settings-options">
                            <input type="text" id="gpl-setting-custom-font" data-gpl-t-placeholder="customFontPlaceholder" placeholder="${GPL.t('customFontPlaceholder')}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--gpl-border-color); background: var(--gpl-secondary-color); color: var(--gpl-text-color); font-family: inherit;">
                        </div>
                    </div>
                    <div class="gpl-import-export-section">
                        <h2 data-gpl-t="managePromptData">${GPL.t('managePromptData')}</h2>
                        <div class="gpl-import-export-buttons">
                            <button id="gpl-import-btn" class="gpl-btn gpl-btn-secondary">${GPL.icons.import} <span data-gpl-t="import">${GPL.t('import')}</span></button>
                            <button id="gpl-export-btn" class="gpl-btn gpl-btn-secondary">${GPL.icons.export} <span data-gpl-t="export">${GPL.t('export')}</span></button>
                            <input type="file" id="gpl-import-file-input" style="display: none;" accept="application/json,.json">
                        </div>
                    </div>
                </div>
            </main>
            <div class="gpl-developer-signature" style="margin-top: 20px; padding: 15px; text-align: center; border-top: 1px solid var(--gpl-border-color); font-size: 13px; color: var(--gpl-secondary-text-color);">
                <span id="gpl-dev-signature-text" data-gpl-t-html="devSignature">${GPL.t('devSignature')}</span>
                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 10px;">
                    <a href="https://github.com/shayanfp" target="_blank" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--gpl-text-color)'" onmouseout="this.style.color='inherit'" title="GitHub">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>
                    <a id="gpl-dev-website-link" data-gpl-t-href="devWebsiteUrl" href="${GPL.t('devWebsiteUrl')}" target="_blank" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--gpl-text-color)'" onmouseout="this.style.color='inherit'" title="Personal Website">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </a>
                    <a href="https://shayanweb.com" target="_blank" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--gpl-text-color)'" onmouseout="this.style.color='inherit'" title="ShayanWeb">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    </a>
                    <a href="https://www.linkedin.com/in/shayanfp" target="_blank" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--gpl-text-color)'" onmouseout="this.style.color='inherit'" title="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                    <a href="https://x.com/shayanfpX" target="_blank" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--gpl-text-color)'" onmouseout="this.style.color='inherit'" title="Twitter / X">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
                    </a>
                    <a href="https://instagram.com/shayanfpinsta" target="_blank" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--gpl-text-color)'" onmouseout="this.style.color='inherit'" title="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                </div>
            </div>
        </div>`;

        // Initialize element references
        promptList = document.getElementById('gpl-prompt-list');
        saveBtn = document.getElementById('gpl-save-btn');
        cancelEditBtn = document.getElementById('gpl-cancel-edit-btn');
        promptIdInput = document.getElementById('gpl-prompt-id');
        promptTitleInput = document.getElementById('gpl-prompt-title');
        promptTextInput = document.getElementById('gpl-prompt-text');

        chatListContainer = document.getElementById('gpl-chat-list');
        chatMessagesContainer = document.getElementById('gpl-chat-messages');
        chatHeader = document.getElementById('gpl-chat-header');
        chatViewTitle = document.getElementById('gpl-chat-view-title');
        chatViewDate = document.getElementById('gpl-chat-view-date');

        addChatBtn = document.getElementById('gpl-add-chat-btn');
        importMdModal = document.getElementById('gpl-import-md-modal');
        cancelMdBtn = document.getElementById('gpl-cancel-md-btn');
        saveMdBtn = document.getElementById('gpl-save-md-btn');
        importMdText = document.getElementById('gpl-import-md-text');

        chkExportDl = document.getElementById('gpl-setting-export-dl');
        chkExportLib = document.getElementById('gpl-setting-export-lib');

        const themeToggle = document.getElementById('gpl-theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                chrome.storage.local.get({ gpl_standalone_theme: 'dark' }, (data) => {
                    const newTheme = data.gpl_standalone_theme === 'dark' ? 'light' : 'dark';
                    chrome.storage.local.set({ gpl_standalone_theme: newTheme });
                    applyThemeCommon(newTheme);
                });
            });
        }

        const closeBtn = document.getElementById('gpl-close-modal-btn');
        if (closeBtn && isExtensionPopup) {
            closeBtn.addEventListener('click', GPL.toggleModal);
        }
        
        if (isExtensionPopup) {
            libraryModal.addEventListener('click', (e) => {
                if (e.target === libraryModal) {
                    if (window.getSelection().toString().trim().length === 0) {
                        GPL.toggleModal();
                    }
                }
            });
        }
        
        chrome.storage.local.get({ gpl_standalone_theme: 'dark' }, (data) => {
            applyThemeCommon(data.gpl_standalone_theme);
        });

        // Setup settings listeners
        if (chkExportDl) chkExportDl.addEventListener('change', (e) => chrome.storage.local.set({ gpl_export_download: e.target.checked }));
        if (chkExportLib) chkExportLib.addEventListener('change', (e) => chrome.storage.local.set({ gpl_export_save_library: e.target.checked }));

        chkLeaveMessage = document.getElementById('gpl-setting-leave-message');
        if (chkLeaveMessage) chkLeaveMessage.addEventListener('change', (e) => chrome.storage.local.set({ gpl_show_leave_message: e.target.checked }));

        txtCustomFont = document.getElementById('gpl-setting-custom-font');
        if (txtCustomFont) {
            let fontDebounce;
            txtCustomFont.addEventListener('input', (e) => {
                clearTimeout(fontDebounce);
                fontDebounce = setTimeout(() => {
                    chrome.storage.local.set({ gpl_custom_font: e.target.value.trim() });
                }, 500);
            });
        }

        const faRadio = document.getElementById('gpl-lang-fa-opt');
        const enRadio = document.getElementById('gpl-lang-en-opt');
        if (faRadio && enRadio) {
            const handleLangChange = (langVal) => {
                chrome.storage.local.set({ gpl_lang: langVal });
            };
            faRadio.addEventListener('change', () => handleLangChange('fa'));
            enRadio.addEventListener('change', () => handleLangChange('en'));
        }

        exportBtn = document.getElementById('gpl-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (prompts.length === 0) {
                    alert(GPL.t('libraryEmpty'));
                    return;
                }
                const blob = new Blob([JSON.stringify(prompts, null, 2)], { type: 'application/json;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `gemini-pro-tools-backup-${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        }

        importBtn = document.getElementById('gpl-import-btn');
        fileInput = document.getElementById('gpl-import-file-input');
        if (importBtn && fileInput) {
            importBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedPrompts = JSON.parse(e.target.result);
                        if (!Array.isArray(importedPrompts) || !importedPrompts.every(p => p.title && p.text)) {
                            throw new Error(GPL.t('invalidFileFormat'));
                        }
                        if (confirm(GPL.t('confirmImport', { count: importedPrompts.length }))) {
                            const existingTexts = new Set(prompts.map(p => p.text));
                            const newPrompts = importedPrompts
                                .filter(p => !existingTexts.has(p.text))
                                .map((p, i) => ({ id: Date.now() + i, title: p.title, text: p.text }));
                            prompts = [...prompts, ...newPrompts];
                            savePrompts();
                            resetForm();
                            renderPrompts();
                            alert(GPL.t('importSuccess', { count: newPrompts.length }));
                        }
                    } catch (error) {
                        alert(GPL.t('errorPrefix') + error.message);
                    } finally {
                        event.target.value = '';
                    }
                };
                reader.readAsText(file, 'UTF-8');
            });
        }

        // Tab setup
        const tabBtns = document.querySelectorAll('.gpl-tab-btn');
        const tabContents = document.querySelectorAll('.gpl-tab-content');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.style.display = 'none');
                btn.classList.add('active');
                const targetId = `gpl-tab-${btn.dataset.tab}`;
                document.getElementById(targetId).style.display = 'block';

                if (btn.dataset.tab === 'chats') {
                    loadAndRenderChats();
                }
            });
        });

        // Chat manual MD importer setup
        if (addChatBtn) {
            addChatBtn.addEventListener('click', () => {
                const importMdTitle = document.getElementById('gpl-import-md-title');
                if (importMdTitle) importMdTitle.textContent = GPL.t('addMarkdownTitle');
                saveMdBtn.textContent = GPL.t('add');
                delete importMdModal.dataset.editingId;
                importMdText.value = '';
                importMdModal.style.display = 'flex';
                importMdText.focus();
            });
        }

        if (cancelMdBtn) {
            cancelMdBtn.addEventListener('click', () => {
                importMdModal.style.display = 'none';
            });
        }

        if (saveMdBtn) {
            saveMdBtn.addEventListener('click', () => {
                const content = importMdText.value.trim();
                if (!content) return;
                
                let title = GPL.t('manualChatTitle');
                const titleMatch = content.match(/# 📝 عنوان چت:\s*(.*)/) || content.match(/# 📝 Chat Title:\s*(.*)/);
                if (titleMatch) title = titleMatch[1].trim();

                const editingId = importMdModal.dataset.editingId;
                if (editingId) {
                    const index = savedChats.findIndex(c => c.id == editingId);
                    if (index !== -1) {
                        savedChats[index].content = content;
                        savedChats[index].title = title;
                    }
                    delete importMdModal.dataset.editingId;
                    saveMdBtn.textContent = GPL.t('add');
                } else {
                    const newChat = {
                        id: Date.now(),
                        title: title,
                        date: new Date().toISOString(),
                        content: content
                    };
                    savedChats.push(newChat);
                }
                
                chrome.storage.local.set({ gpl_markdown_chats: savedChats }, () => {
                    importMdModal.style.display = 'none';
                    loadAndRenderChats();
                });
            });
        }

        // Chat fullscreen and continue handlers
        const fullscreenBtn = document.getElementById('gpl-chat-fullscreen-btn');
        let isChatFullscreen = false;
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                isChatFullscreen = !isChatFullscreen;
                const layout = document.querySelector('.gpl-chats-layout');
                const modalContent = document.querySelector('.gpl-modal-content');
                const modalHeader = document.querySelector('.gpl-modal-header');
                
                if (isChatFullscreen) {
                    layout.classList.add('gpl-fullscreen-active');
                    modalContent.classList.add('gpl-modal-fullscreen');
                    if(modalHeader) modalHeader.style.display = 'none';
                    if (!isExtensionPopup) {
                        document.body.style.overflow = 'hidden';
                        document.body.style.padding = '0';
                    }
                    fullscreenBtn.innerHTML = GPL.icons.minimize;
                    fullscreenBtn.title = GPL.t('exitFullscreen');
                } else {
                    layout.classList.remove('gpl-fullscreen-active');
                    modalContent.classList.remove('gpl-modal-fullscreen');
                    if(modalHeader) modalHeader.style.display = 'flex';
                    if (!isExtensionPopup) {
                        document.body.style.overflow = '';
                        document.body.style.padding = '40px 15px';
                    }
                    fullscreenBtn.innerHTML = GPL.icons.fullscreen;
                    fullscreenBtn.title = GPL.t('fullscreen');
                }
            });
        }

        const continueBtn = document.getElementById('gpl-continue-chat-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                if (isExtensionPopup) {
                    const editor = document.querySelector('.ql-editor');
                    if (editor) {
                        editor.innerHTML = `<p>${GPL.escapeHTML(currentLoadedChatContent).replace(/\n/g, '</p><p>')}</p>`;
                        editor.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    GPL.toggleModal();
                } else {
                    navigator.clipboard.writeText(currentLoadedChatContent).then(() => {
                        const originalText = continueBtn.textContent;
                        continueBtn.textContent = GPL.t('copiedContinueChat');
                        setTimeout(() => continueBtn.textContent = originalText, 2500);
                    });
                }
            });
        }

        // Initialize state lists
        saveBtn.addEventListener('click', () => {
            const id = promptIdInput.value, title = promptTitleInput.value.trim(), text = promptTextInput.value.trim();
            if (!title || !text) return;
            if (id) {
                const index = prompts.findIndex(p => p.id == id);
                if (index !== -1) prompts[index] = { ...prompts[index], title, text };
            } else {
                prompts.unshift({ id: Date.now(), title, text });
            }
            savePrompts(); resetForm(); renderPrompts();
        });

        promptList.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;
            const item = target.closest('.gpl-prompt-item');
            if (!item) return;
            const id = parseInt(item.dataset.id, 10);
            if (isNaN(id)) return;
            const prompt = prompts.find(p => p.id === id);

            if (target.classList.contains('delete-btn')) {
                if (confirm(GPL.t('confirmDeletePrompt'))) {
                    prompts = prompts.filter(p => p.id !== id);
                    savePrompts();
                    renderPrompts();
                }
            } else if (target.classList.contains('edit-btn')) {
                if (!prompt) return;
                promptIdInput.value = prompt.id;
                promptTitleInput.value = prompt.title;
                promptTextInput.value = prompt.text;
                saveBtn.textContent = GPL.t('saveChanges');
                cancelEditBtn.style.display = 'inline-block';
                promptTitleInput.focus();
            } else if (target.classList.contains('use-btn')) {
                if (!prompt) return;
                if (isExtensionPopup) {
                    const editor = document.querySelector('.ql-editor');
                    if (editor) {
                        editor.innerHTML = `<p>${GPL.escapeHTML(prompt.text).replace(/\n/g, '</p><p>')}</p>`;
                        editor.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    GPL.toggleModal();
                } else {
                    navigator.clipboard.writeText(prompt.text).then(() => {
                        const originalHTML = target.innerHTML;
                        target.innerHTML = `<span style="font-size: 11px; font-weight: bold;">${GPL.t('copied')}</span>`;
                        setTimeout(() => target.innerHTML = originalHTML, 2000);
                    });
                }
            }
        });

        cancelEditBtn.addEventListener('click', resetForm);

        // Load content
        loadAndRenderPrompts();
        loadAndApplyNotificationSetting();
    };

    GPL.toggleModal = function() {
        if (!document.getElementById('gemini-prompt-library-modal') || !document.querySelector('.gpl-modal-content')) {
            GPL.initCommon();
        }
        const modal = document.getElementById('gemini-prompt-library-modal');
        const isVisible = modal.classList.toggle('visible');
        if (isVisible) {
            if (!isExtensionPopup) {
                chrome.storage.local.get({ gpl_standalone_theme: 'dark' }, (data) => {
                    applyThemeCommon(data.gpl_standalone_theme);
                });
            }
            loadAndRenderPrompts();
            loadAndApplyNotificationSetting();
        }
    };

    GPL.updateLanguageUI = function() {
        const modal = document.getElementById('gemini-prompt-library-modal');
        if (!modal) return;
        
        if (GPL.currentLang === 'en') {
            modal.classList.add('gpl-lang-en');
            document.body.classList.add('gpl-lang-en');
            if (!isExtensionPopup) {
                document.documentElement.dir = 'ltr';
                document.documentElement.lang = 'en';
            }
        } else {
            modal.classList.remove('gpl-lang-en');
            document.body.classList.remove('gpl-lang-en');
            if (!isExtensionPopup) {
                document.documentElement.dir = 'rtl';
                document.documentElement.lang = 'fa';
            }
        }

        modal.querySelectorAll('[data-gpl-t]').forEach(el => {
            const key = el.getAttribute('data-gpl-t');
            el.textContent = GPL.t(key);
        });
        
        modal.querySelectorAll('[data-gpl-t-placeholder]').forEach(el => {
            const key = el.getAttribute('data-gpl-t-placeholder');
            el.placeholder = GPL.t(key);
        });

        modal.querySelectorAll('[data-gpl-t-title]').forEach(el => {
            const key = el.getAttribute('data-gpl-t-title');
            el.title = GPL.t(key);
        });

        modal.querySelectorAll('[data-gpl-t-html]').forEach(el => {
            const key = el.getAttribute('data-gpl-t-html');
            el.innerHTML = GPL.t(key);
        });

        modal.querySelectorAll('[data-gpl-t-href]').forEach(el => {
            const key = el.getAttribute('data-gpl-t-href');
            el.href = GPL.t(key);
        });

        loadAndRenderPrompts();
        
        const activeTabBtn = modal.querySelector('.gpl-tab-btn.active');
        if (activeTabBtn && activeTabBtn.dataset.tab === 'chats') {
            loadAndRenderChats();
        }
        
        loadAndApplyNotificationSetting();
    };

    // Private helpers
    function applyThemeCommon(theme) {
        if (isExtensionPopup) return;

        if (theme === 'light') {
            document.body.classList.remove('gpl-theme-active-dark');
            document.body.classList.add('gpl-theme-active-light');
            libraryModal.classList.add('gpl-light-theme');
        } else {
            document.body.classList.remove('gpl-theme-active-light');
            document.body.classList.add('gpl-theme-active-dark');
            libraryModal.classList.remove('gpl-light-theme');
        }
    }

    function loadAndRenderPrompts() {
        chrome.storage.local.get({ prompts: [] }, (data) => {
            prompts = data.prompts.sort((a, b) => b.id - a.id);
            renderPrompts();
        });
    }

    function renderPrompts() {
        if (!promptList) return;
        promptList.innerHTML = prompts.length === 0 ? `<p class="gpl-empty-message">${GPL.t('noPromptsSaved')}</p>` : '';
        prompts.forEach(prompt => {
            const item = document.createElement('div');
            item.className = 'gpl-prompt-item';
            item.dataset.id = prompt.id;
            item.innerHTML = `
                <div class="gpl-prompt-content"><strong class="gpl-prompt-title">${GPL.escapeHTML(prompt.title)}</strong><p class="gpl-prompt-preview">${GPL.escapeHTML(prompt.text.substring(0, 100))}...</p></div>
                <div class="gpl-prompt-actions">
                    <button class="gpl-btn-icon use-btn" title="${GPL.t('copyPrompt')}">${GPL.icons.use}</button>
                    <button class="gpl-btn-icon edit-btn" title="${GPL.t('edit')}">${GPL.icons.edit}</button>
                    <button class="gpl-btn-icon delete-btn" title="${GPL.t('delete')}">${GPL.icons.delete}</button>
                </div>`;
            promptList.appendChild(item);
        });
    }

    function savePrompts() { chrome.storage.local.set({ prompts }); }
    
    function resetForm() {
        if (promptIdInput) {
            promptIdInput.value = ''; promptTitleInput.value = ''; promptTextInput.value = '';
            saveBtn.textContent = GPL.t('saveNewPrompt'); cancelEditBtn.style.display = 'none';
        }
    }

    function loadAndApplyNotificationSetting() {
        chrome.storage.local.get({ 
            gpl_notification_setting: 'none',
            gpl_export_download: true,
            gpl_export_save_library: true,
            gpl_lang: 'fa',
            gpl_show_leave_message: true,
            gpl_custom_font: ""
        }, (data) => {
            const setting = data.gpl_notification_setting;
            document.querySelectorAll('.gpl-radio-option[data-value]').forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.value === setting);
            });
            
            if (chkExportDl) chkExportDl.checked = data.gpl_export_download;
            if (chkExportLib) chkExportLib.checked = data.gpl_export_save_library;

            const chkLeaveMessage = document.getElementById('gpl-setting-leave-message');
            if (chkLeaveMessage) chkLeaveMessage.checked = data.gpl_show_leave_message;
            
            const txtCustomFont = document.getElementById('gpl-setting-custom-font');
            if (txtCustomFont) txtCustomFont.value = data.gpl_custom_font;

            const faRadio = document.getElementById('gpl-lang-fa-opt');
            const enRadio = document.getElementById('gpl-lang-en-opt');
            if (faRadio && enRadio) {
                if (data.gpl_lang === 'en') {
                    enRadio.checked = true;
                    enRadio.closest('.gpl-radio-option').classList.add('selected');
                    faRadio.closest('.gpl-radio-option').classList.remove('selected');
                } else {
                    faRadio.checked = true;
                    faRadio.closest('.gpl-radio-option').classList.add('selected');
                    enRadio.closest('.gpl-radio-option').classList.remove('selected');
                }
            }
        });
    }

    function loadAndRenderChats() {
        chrome.storage.local.get({ gpl_markdown_chats: [] }, (data) => {
            savedChats = data.gpl_markdown_chats.sort((a, b) => b.id - a.id);
            renderChatList();
        });
    }

    function renderChatList() {
        if (!chatListContainer) return;
        chatListContainer.innerHTML = savedChats.length === 0 ? `<p class="gpl-empty-message">${GPL.t('noChatsSaved')}</p>` : '';
        savedChats.forEach(chat => {
            const item = document.createElement('div');
            item.className = 'gpl-chat-list-item';
            item.dataset.id = chat.id;
            
            const dateObj = new Date(chat.date);
            const dateStr = isNaN(dateObj) ? chat.date : dateObj.toLocaleString(GPL.currentLang === 'en' ? 'en-US' : 'fa-IR');

            item.innerHTML = `
                <div style="flex-grow: 1; min-width: 0;">
                    <div class="gpl-chat-list-title">${GPL.escapeHTML(chat.title)}</div>
                    <div class="gpl-chat-list-date">${dateStr}</div>
                </div>
                <div class="gpl-prompt-actions" style="margin-right: 10px; margin-left: 10px;">
                    <button class="gpl-btn-icon edit-chat-btn" title="${GPL.t('edit')}">${GPL.icons.edit}</button>
                    <button class="gpl-btn-icon delete-chat-btn" title="${GPL.t('delete')}">${GPL.icons.delete}</button>
                </div>
            `;
            
            item.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('button');
                if (targetBtn) {
                    if (targetBtn.classList.contains('delete-chat-btn')) {
                        if (confirm(GPL.t('confirmDeleteChat'))) {
                            savedChats = savedChats.filter(c => c.id !== chat.id);
                            chrome.storage.local.set({ gpl_markdown_chats: savedChats }, () => {
                                renderChatList();
                                chatMessagesContainer.innerHTML = `<div class="gpl-empty-message">${GPL.t('selectChatToView')}</div>`;
                                chatHeader.style.display = 'none';
                                document.getElementById('gpl-chat-footer').style.display = 'none';
                            });
                        }
                    } else if (targetBtn.classList.contains('edit-chat-btn')) {
                        const importMdTitle = document.getElementById('gpl-import-md-title');
                        if (importMdTitle) importMdTitle.textContent = GPL.t('editMarkdownTitle');
                        importMdText.value = chat.content;
                        importMdModal.dataset.editingId = chat.id;
                        saveMdBtn.textContent = GPL.t('saveChanges');
                        importMdModal.style.display = 'flex';
                        importMdText.focus();
                    }
                    return;
                }

                document.querySelectorAll('.gpl-chat-list-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                renderChatView(chat);
            });
            
            chatListContainer.appendChild(item);
        });
    }

    function parseMarkdownChat(markdownText) {
        const userMarker = '### 👤 THE_User:';
        const aiMarker = '### 🤖 THE_AI:';
        
        let title = GPL.t('chatTitle');
        let date = "";
        
        const titleMatch = markdownText.match(/# 📝 عنوان چت:\s*(.*)/) || markdownText.match(/# 📝 Chat Title:\s*(.*)/);
        if (titleMatch) title = titleMatch[1].trim();
        
        const dateMatch = markdownText.match(/\*تاریخ:\s*(.*)\*/) || markdownText.match(/\*Date:\s*(.*)\*/);
        if (dateMatch) date = dateMatch[1].trim();

        const messages = [];
        const regex = /(### 👤 THE_User:|### 🤖 THE_AI:)/g;
        let match;
        let lastIndex = 0;
        let lastRole = null;
        
        const headerEndIndex = markdownText.indexOf('---');
        if (headerEndIndex !== -1) {
            lastIndex = headerEndIndex + 3;
            regex.lastIndex = lastIndex;
        }

        while ((match = regex.exec(markdownText)) !== null) {
            if (lastRole !== null) {
                const content = markdownText.substring(lastIndex, match.index).trim();
                const cleanContent = content.replace(/---$/, '').trim();
                if (cleanContent) {
                    messages.push({ role: lastRole, content: cleanContent });
                }
            }
            lastRole = match[0] === userMarker ? 'user' : 'ai';
            lastIndex = regex.lastIndex;
        }
        
        if (lastRole !== null) {
            let content = markdownText.substring(lastIndex).trim();
            content = content.replace(/---$/, '').trim();
            if (content) {
                messages.push({ role: lastRole, content: content });
            }
        }
        
        if (messages.length === 0) {
            messages.push({ role: 'ai', content: markdownText });
        }

        return { title, date, messages };
    }

    function renderChatView(chat) {
        const parsed = parseMarkdownChat(chat.content);
        currentLoadedChatContent = chat.content;
        
        chatViewTitle.textContent = parsed.title;
        chatViewDate.textContent = parsed.date;
        chatHeader.style.display = 'flex';
        document.getElementById('gpl-chat-footer').style.display = 'block';
        
        chatMessagesContainer.innerHTML = '';
        
        parsed.messages.forEach(msg => {
            const bubble = document.createElement('div');
            bubble.className = `gpl-message-bubble ${msg.role === 'user' ? 'gpl-message-user' : 'gpl-message-ai'}`;
            
            if (msg.role === 'user') {
                const lines = msg.content.split('\n');
                if (lines.length > 5) {
                    const shortText = lines.slice(0, 5).join('\n');
                    const textContainer = document.createElement('div');
                    textContainer.className = 'gpl-user-msg-text';
                    textContainer.textContent = shortText + '\n...';
                    
                    const firstLetterMatch = msg.content.match(/[a-zA-Zا-یآپچژ]/);
                    if (firstLetterMatch && /[a-zA-Z]/.test(firstLetterMatch[0])) {
                        textContainer.style.direction = 'ltr';
                        textContainer.style.textAlign = 'left';
                    }
                    
                    const toggleBtn = document.createElement('button');
                    toggleBtn.className = 'gpl-read-more-btn';
                    toggleBtn.textContent = GPL.t('showFullTextSent');
                    let isExpanded = false;
                    toggleBtn.onclick = () => {
                        isExpanded = !isExpanded;
                        if (isExpanded) {
                            textContainer.textContent = msg.content;
                            toggleBtn.textContent = GPL.t('close');
                        } else {
                            textContainer.textContent = shortText + '\n...';
                            toggleBtn.textContent = GPL.t('showFullTextSent');
                        }
                    };
                    bubble.appendChild(textContainer);
                    bubble.appendChild(toggleBtn);
                } else {
                    const textContainer = document.createElement('div');
                    textContainer.className = 'gpl-user-msg-text';
                    textContainer.textContent = msg.content;
                    const firstLetterMatch = msg.content.match(/[a-zA-Zا-یآپچژ]/);
                    if (firstLetterMatch && /[a-zA-Z]/.test(firstLetterMatch[0])) {
                        textContainer.style.direction = 'ltr';
                        textContainer.style.textAlign = 'left';
                    }
                    bubble.appendChild(textContainer);
                }
            } else {
                if (typeof marked !== 'undefined') {
                    let text = msg.content;
                    const mathBlocks = [];
                    
                    text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match) => {
                        mathBlocks.push(match);
                        return `@@@MATHBLOCK${mathBlocks.length - 1}@@@`;
                    });
                    text = text.replace(/\$([^\n$]+?)\$/g, (match) => {
                        mathBlocks.push(match);
                        return `@@@MATHBLOCK${mathBlocks.length - 1}@@@`;
                    });

                    let html = marked.parse(text);
                    if (typeof DOMPurify !== 'undefined') {
                        html = DOMPurify.sanitize(html);
                    }

                    mathBlocks.forEach((block, i) => {
                        const escapedBlock = block.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        html = html.replace(`@@@MATHBLOCK${i}@@@`, escapedBlock);
                    });

                    bubble.innerHTML = html;
                    
                    if (typeof renderMathInElement !== 'undefined') {
                        try {
                            renderMathInElement(bubble, {
                                delimiters: [
                                    {left: '$$', right: '$$', display: true},
                                    {left: '$', right: '$', display: false},
                                    {left: '\\(', right: '\\)', display: false},
                                    {left: '\\[', right: '\\]', display: true}
                                ],
                                throwOnError: false
                            });
                        } catch (e) {
                            console.error('KaTeX render error:', e);
                        }
                    }
                } else {
                    bubble.textContent = msg.content;
                }
                
                const firstLetterMatch = msg.content.match(/[a-zA-Zا-یآپچژ]/);
                if (firstLetterMatch && /[a-zA-Z]/.test(firstLetterMatch[0])) {
                    bubble.style.direction = 'ltr';
                    bubble.style.textAlign = 'left';
                }
            }
            
            chatMessagesContainer.appendChild(bubble);
        });
    }

    // Settings storage listener for sync inside settings tab
    document.addEventListener('click', (e) => {
        const targetOption = e.target.closest('.gpl-radio-option[data-value]');
        if (targetOption) {
            const value = targetOption.dataset.value;
            chrome.storage.local.set({ gpl_notification_setting: value }, () => {
                loadAndApplyNotificationSetting();
            });
        }
    });

    // Auto-instantiate in standalone page
    if (!isExtensionPopup) {
        document.addEventListener('DOMContentLoaded', () => {
            GPL.loadLanguageAndInit(() => {
                GPL.initCommon();
            });
        });
    }

    // Sync state changes across tabs
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.gpl_lang) {
            GPL.currentLang = changes.gpl_lang.newValue;
            GPL.updateLanguageUI();
        }
    });

})();
