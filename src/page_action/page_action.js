/*
var showAllButton = document.getElementById("showAllButton");

document.addEventListener("DOMContentLoaded", function(event) {
    showAllButton.onclick = showAll;
});

// send message to active tab, notify user of response
function showAll() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {event: "showall"}, function(response) {
            if (response.callback == "success"){
                //TODO: notification
            } else {
                //TODO: notification
            }
        });
    });
}
*/