var consolePrefix = "[GradeEditor] ";

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
      
      //var jquery = document.createElement('script');
      //jquery.type = 'text/javascript';
      //jquery.src = chrome.extension.getURL('assets/libs/jquery-3.1.1.min.js');
      
      var jqueryUICSS = document.createElement('link');
      jqueryUICSS.rel = 'stylesheet';
      jqueryUICSS.href = chrome.extension.getURL('assets/libs/jquery-ui-1.12.1/jquery-ui.min.css');
      
      //var jqueryUIJS = document.createElement('script');
      //jqueryUIJS.type = 'text/javascript';
      //jqueryUIJS.src = chrome.extension.getURL('assets/libs/jquery-ui-1.12.1/jquery-ui.min.js');
      
      head.appendChild(fontawesome);
      //head.appendChild(jquery);
      head.appendChild(jqueryUICSS);
      //head.appendChild(jqueryUIJS);
    }
    
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
  //var customStateEvent = $.Event("customstate");

  $( ".editIconAssignment" ).on("click", function(eventObj){
    //eventObj.preventDefault();
    console.log(consolePrefix + "Edit Assignment");
    //save real assignment info to storage
    //modal to edit

    var assignment = new Assignment($(this).parents("[data-assignment]").removeClass("hover"));

    //make reset icon visible (move to confirmation in modal)
    assignment.element.find(".resetIconAssignment").removeClass("hiddenIcon");

    //make float buttons active (dispatch event? handler changes color, clickable)
    $(".resetIconFloat,.saveIconFloat").addClass("activeIcon").wrap("<a href='#'></a>");

    //assignment.element.clone().appendTo(assignment.element.parent());

    //$(window).trigger(customStateEvent);

    console.log(assignment.element);

  });

  $( ".deleteIconAssignment" ).on("click", function(eventObj){
    //eventObj.preventDefault();
    console.log(consolePrefix + "Delete Assignment");

    //var assignment = new Assignment($(this).parents("[data-assignment]").removeClass("hover"));

    var assignments = $(this).parents("[data-assignment]").parent().children()

    var assignmentIDs = [];
    for (var i = 0; i < assignments.length; i++){
      assignmentIDs[i] = $(assignments[i]).attr("id");
    }
    
    console.log(assignmentIDs);
    chrome.storage.local.set({"originalAssignments": assignmentIDs}, function(){
      console.log(consolePrefix + "success");
    });

    chrome.storage.local.get(["originalAssignments"], function(data){
      console.log(data);
    });
    /*
      $(document).ready(function(){
        var x;
        $("#btn1").click(function(){
          x = $("p").detach();
        });
        $("#btn2").click(function(){
          $("body").prepend(x);
        });
      });
     */
    
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
    
  });

  $( ".saveIconFloat" ).on("click", function(eventObj){
    eventObj.preventDefault();
    console.log(consolePrefix + "Save Changes");
    
  });

});

function Assignment(element) {
  this.element = element;
  this.ID = element.attr("data-assignment");
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