chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("[GradeEditor] Script successfully injected.");
		// ----------------------------------------------------------

    // dependencies
    var head = document.getElementsByTagName('head')[0];

    if (head) {
      var fontawesome = document.createElement('link');
      fontawesome.rel = 'stylesheet';
      fontawesome.href = chrome.extension.getURL('assets/libs/font-awesome-4.7.0/css/font-awesome.min.css');
      
      var jquery = document.createElement('script');
      jquery.type = 'text/javascript';
      jquery.src = chrome.extension.getURL('assets/libs/jquery-3.1.1.min.js');
      
      head.appendChild(fontawesome);
      head.appendChild(jquery);
    }
    // document.write("<script src='https://use.fontawesome.com/c01af75451.js'></script><script src='https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>");
    
		//do stuff?
    addButtons();

	}
	}, 10);
});

function addButtons(){
  
  var assignments = document.getElementsByClassName("assignment");
  
  for (var i = 0; i < assignments.length; i++) {
    var editElement = document.createElement("td");
    editElement.setAttribute("class", "editIconsContainer");
  
    var editIconElement = document.createElement("span");
    editIconElement.setAttribute("class", "fa fa-pencil-square-o");
    editElement.appendChild(editIconElement);
    
    assignments[i].appendChild(editElement);
  }
  
}

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