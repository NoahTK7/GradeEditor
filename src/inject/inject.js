var consolePrefix = "[GradeEditor] ";

//TODO: save "active" and "loaded" states to local storage (for use with activating/deactivating by page action)

chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log(consolePrefix + "Script successfully injected.");
		// ----------------------------------------------------------

    // dependencies
    var head = document.getElementsByTagName('head')[0];

    if (head) {
      var fontawesome = document.createElement('link');
      fontawesome.rel = 'stylesheet';
      fontawesome.href = chrome.extension.getURL('assets/libs/font-awesome-4.7.0/css/font-awesome.min.css');
      
      var jqueryUICSS = document.createElement('link');
      jqueryUICSS.rel = 'stylesheet';
      jqueryUICSS.href = chrome.extension.getURL('assets/libs/jquery-ui-1.12.1/jquery-ui.min.css');
      
      head.appendChild(fontawesome);
      head.appendChild(jqueryUICSS);
    }

    var isActive = chrome.storage.local.get(["active"], function (data) {
        if (data.active) {
          //do stuff
          addButtons();

          //make loaded
          chrome.storage.local.set({"loaded":true});
        }
    });

        window.addEventListener("onbeforeunload", function (eventObj) {
            chrome.storage.local.set({"loaded":false});
        });

	}
	}, 10);
});

function addButtons(){
  
  var assignments = document.getElementsByClassName("assignment");
  
  for (var i = 0; i < assignments.length; i++) {
    var editElement = document.createElement("td");
    editElement.className = "editIconsContainer";
  
    var editIconElement = document.createElement("span");
    editIconElement.className = "fa fa-pencil fa-lg modifyIcons editIconAssignment";
    var aEditIconElement = document.createElement("a");
    aEditIconElement.className = "aModifyIcons";
    aEditIconElement.appendChild(editIconElement);
    editElement.appendChild(aEditIconElement);
    
    var deleteIconElement = document.createElement("span");
    deleteIconElement.className = "fa fa-times fa-lg modifyIcons deleteIconAssignment";
    var aDeleteIconElement = document.createElement("a");
    aDeleteIconElement.className = "aModifyIcons";
    aDeleteIconElement.appendChild(deleteIconElement);
    editElement.appendChild(aDeleteIconElement);

    var resetIconElement = document.createElement("span");
    resetIconElement.className = "fa fa-refresh fa-lg modifyIcons resetIconAssignment hiddenIcon";
    var aResetIconElement = document.createElement("a");
    aResetIconElement.className = "aModifyIcons";
    aResetIconElement.appendChild(resetIconElement);
    editElement.appendChild(aResetIconElement);
    
    assignments[i].appendChild(editElement);
  }
  
  var floatButtonsDiv = document.createElement("div");
  floatButtonsDiv.className = "floatButtonsDiv";

  var newAssignmentIconElement = document.createElement("span");
  newAssignmentIconElement.className = "fa fa-plus-square fa-2x floatIcons newIconFloat activeIcon";
  var aNewAssignmentIconElement = document.createElement("a");
  aNewAssignmentIconElement.href = "#";
  aNewAssignmentIconElement.appendChild(newAssignmentIconElement);

  var resetIconElement = document.createElement("span");
  resetIconElement.className = "fa fa-refresh fa-2x floatIcons resetIconFloat";
    
  var saveIconElement = document.createElement("span");
  saveIconElement.className = "fa fa-save fa-2x floatIcons saveIconFloat";
  
  floatButtonsDiv.appendChild(aNewAssignmentIconElement);
  floatButtonsDiv.appendChild(resetIconElement);
  floatButtonsDiv.appendChild(saveIconElement);
  
  document.body.appendChild(floatButtonsDiv);
}

jQuery("document").ready(function(){
  var pageAssignments = [];
  var assignments = $("[data-assignment]");

  for (var i = 0; i < assignments.length; i++){
    pageAssignments[i] = new Assignment(assignments[i]);
  }

  //event handling
  $( ".editIconAssignment" ).on("click", function(eventObj){
    //eventObj.preventDefault();
    console.log(consolePrefix + "Edit Assignment");
    //modal to edit

    var assignment = new Assignment($(this).parents("[data-assignment]").removeClass("hover"));

    //make reset icon visible (move to confirmation in modal)
    assignment.element.find(".resetIconAssignment").removeClass("hiddenIcon");

    //make float buttons active (dispatch event? handler changes color, clickable)
    $(".resetIconFloat,.saveIconFloat").addClass("activeIcon").wrap("<a href='#'></a>");

    console.log(assignment.element);

  });

  $( ".deleteIconAssignment" ).on("click", function(eventObj){
    //eventObj.preventDefault();
    console.log(consolePrefix + "Delete Assignment");

    var thisID = $(this).parents("[data-assignment]").attr("data-assignment");

    console.log(thisID);

    pageAssignments.forEach(function(assignment){
      console.log(assignment.ID);
      if (assignment.ID == thisID) {
        $(assignment.element).detach();
        assignment.isRemoved = true;
      };
    });
  });

  $( ".resetIconAssignment" ).on("click", function(eventObj){
    //eventObj.preventDefault();
    console.log(consolePrefix + "Reset Assignment");
    
  });

  $( ".newIconFloat" ).on("click", function(eventObj){
    eventObj.preventDefault();
    console.log(consolePrefix + "New Assignment");
    
  });

  $( ".resetIconFloat" ).on("click", function(eventObj){
    eventObj.preventDefault();
    console.log(consolePrefix + "Reset Changes");

    $("table#Assignments tbody").empty();
    pageAssignments.forEach(function(assignment){
      //element stored at load is updated, make and store copy for restoration? (useful bc elements will be modified)
      $(assignment.element).removeClass("hover");
      $("table#Assignments tbody").append(assignment.element);
    });

    //deactivate reset (and save) button
    
  });

  $( ".saveIconFloat" ).on("click", function(eventObj){
    eventObj.preventDefault();
    console.log(consolePrefix + "Save Changes");
    
  });

});

function Assignment(element) {
  this.element = element;
  this.ID = jQuery(element).attr("data-assignment");
  this.isRemoved  = false;
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