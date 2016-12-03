document.addEventListener("DOMContentLoaded", function (event) {
    var activateButton = document.getElementById("activateButton");
    var deactivateButton = document.getElementById("deactivateButton");

    document.getElementById("active").style.display = "none";
    document.getElementById("inactive").style.display = "none";

    chrome.storage.local.get(["active"], function (data) {
        if (data.active) {
            document.getElementById("active").style.display = "inherit";
        } else {
            document.getElementById("inactive").style.display = "inherit";
        }
    });

    activateButton.onclick = activate;
    deactivateButton.onclick = deactivate;
});

function activate() {
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
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {event: eventName}, function (response) {
            if (response.callback == "success") {
                console.log("callback");
                chrome.storage.local.set({"active": eventName == "activate"});
            }
        });
    });
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];

        if (key == "active") {
            if (storageChange.newValue) {
                //activate

                document.getElementById("active").style.display = "inherit";
                document.getElementById("inactive").style.display = "none";

            } else {
                //deactivate

                document.getElementById("active").style.display = "none";
                document.getElementById("inactive").style.display = "inherit";
            }

            document.getElementById("deactivateButton").disabled = false;
            document.getElementById("activateButton").disabled = false;

        }

        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});