chrome.action.onClicked.addListener(() => {
    // Open the library page in a new tab
    chrome.tabs.create({ url: chrome.runtime.getURL("library.html") });
});