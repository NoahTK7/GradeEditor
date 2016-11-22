chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("[GradeEditor] Script successfully injected.");
		// ----------------------------------------------------------

		//do stuff?

	}
	}, 10);
});


/* get message from page action (from SCStreamModifier)
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		
		if (request.event == "showall") {

			console.log("[SCStreamModifier] Show All event");
			sendResponse({callback: "success"});

			return;

		}

		sendResponse({callback:"failure"});

	}

);
*/