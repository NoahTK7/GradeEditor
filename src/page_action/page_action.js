document.addEventListener("DOMContentLoaded", function(event) {
    var activateButton = document.getElementById("activateButton");
    var deactivateButton = document.getElementById("deactivateButton");

    document.getElementById("active").style.display = "none";
    document.getElementById("inactive").style.display = "none";

    chrome.storage.local.get(["active"], function (data) {
        if(data.active){
            document.getElementById("active").style.display = "inherit";
        } else {
            document.getElementById("inactive").style.display = "inherit";
        }
    });

    activateButton.onclick = activate;
    deactivateButton.onclick = deactivate;
});

function activate(){
    //deactivate button
    document.getElementById("activateButton").disabled = true;

    //send message to content script
    sendMessage("activate");
}

function deactivate() {
    //deactivate button
    document.getElementById("deactivateButton").disabled = true;

    //send message to content script
    sendMessage("deactivate");
}

function sendMessage(eventName) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {event: eventName}, function(response) {
            if (response.callback == "success"){
                console.log("callback");
                onResponse(eventName);
            }
        });
    });
}

function onResponse(eventName){
    //on success
    console.log("success");

    var doActivate = eventName == "activate";

    chrome.storage.local.set({"active":doActivate});

    if (!doActivate) {
        document.getElementById("active").style.display = "none";
        document.getElementById("inactive").style.display = "inherit";
    } else {
        document.getElementById("active").style.display = "inherit";
        document.getElementById("inactive").style.display = "none";
    }

    //reactivate button
    document.getElementById("deactivateButton").disabled = false;
    document.getElementById("activateButton").disabled = false;
}

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
                // notification
            } else {
                // notification
            }
        });
    });
}
*/