// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {

    //set active value true
    chrome.storage.local.set({"active": true});

    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {urlContains: 'https://pinnacle.polk-fl.net/Pinnacle/Gradebook/InternetViewer/StudentAssignments.aspx'},
                    })
                ],
                // And shows the extension's page action.
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});

//from SCStreamNotifier
//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.pageAction.show(sender.tab.id);
        sendResponse();
    });