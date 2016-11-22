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
    editElement.className = "editIconsContainer";
  
    var editIconElement = document.createElement("span");
    editIconElement.className = "fa fa-pencil-square-o fa-lg editIcons";
    editElement.appendChild(editIconElement);
    
    var deleteIconElement = document.createElement("span");
    deleteIconElement.className = "fa fa-times fa-lg editIcons";
    editElement.appendChild(deleteIconElement);
    
    assignments[i].appendChild(editElement);
  }
  
  var floatButtonsDiv = document.createElement("div");
  floatButtonsDiv.className = "floatButtonsDiv";
  
  var newAssignmentIconElement = document.createElement("span");
  newAssignmentIconElement.className = "fa fa-plus-square fa-2x floatIcons";
  
  var resetIconElement = document.createElement("span");
  resetIconElement.className = "fa fa-refresh fa-2x floatIcons";
    
  var saveIconElement = document.createElement("span");
  saveIconElement.className = "fa fa-save fa-2x floatIcons";
  
  floatButtonsDiv.appendChild(newAssignmentIconElement);
  floatButtonsDiv.appendChild(resetIconElement);
  floatButtonsDiv.appendChild(saveIconElement);
  
  document.body.appendChild(floatButtonsDiv);
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