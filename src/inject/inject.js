var consolePrefix = "[GradeEditor] ";

var currentPageAssignments = [];
var pageAssignmentsTemplates = [];
var defaultAssignments;

chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
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

            defaultAssignments = $("[data-assignment]");

            chrome.storage.local.get(["active"], function (data) {
                if (data.active) {
                    load();
                }
            });
        }
    }, 10);
});

function setDefaultResources() {
    for (var i = 0; i < defaultAssignments.length; i++) {
        currentPageAssignments[i] = new Assignment(defaultAssignments[i]);
        pageAssignmentsTemplates[i] = new Assignment($(defaultAssignments[i]).clone());
    }
}

function load() {
    //add buttons, init event handlers (set loaded)

    addButtons();

    setDefaultResources();

    //init jquery event handlers
    //window.dispatchEvent(geInitHandlersEvent);
    attachEventHandlers();

    //make status loaded
    chrome.storage.local.set({"loaded": true});

    //unload when tab closed
    window.addEventListener("onbeforeunload", function (eventObj) {
        chrome.storage.local.set({"loaded": false});
    });

}

function unload() {
    //remove elements
    //use remove() to remove event handlers
    //set not loaded

    removeComponents();

    chrome.storage.local.set({"loaded": false});

}

function addButtons() {

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

    var resetIconFloatElement = document.createElement("span");
    resetIconFloatElement.className = "fa fa-refresh fa-2x floatIcons resetIconFloat";

    var saveIconElement = document.createElement("span");
    saveIconElement.className = "fa fa-save fa-2x floatIcons saveIconFloat";

    floatButtonsDiv.appendChild(aNewAssignmentIconElement);
    floatButtonsDiv.appendChild(resetIconFloatElement);
    floatButtonsDiv.appendChild(saveIconElement);

    document.body.appendChild(floatButtonsDiv);
}

function removeComponents() {

    jQuery(".editIconsContainer").remove();
    jQuery(".floatButtonsDiv").remove();

}

function attachEventHandlers() {
    //event handling
    jQuery(function () {
        $(".editIconAssignment").on("click", function (eventObj) {
            //eventObj.preventDefault();
            console.log(consolePrefix + "Edit Assignment");
            //modal to edit

            var assignment = new Assignment($(this).parents("[data-assignment]").removeClass("hover"));

            //make reset icon visible (move to confirmation in modal)
            assignment.element.find(".resetIconAssignment").removeClass("hiddenIcon");

            //make float buttons active
            makeFloatsActive();

            console.log(assignment.element);

        });

        function makeFloatsActive() {
            if (!($(".resetIconFloat").hasClass("activeIcon"))) {
                $(".resetIconFloat,.saveIconFloat").addClass("activeIcon").wrap("<a href='#'></a>");
                $(".resetIconFloat").on("click", addResetEvent);
            }
        }

        function makeFloatsInactive() {
            if (($(".resetIconFloat").hasClass("activeIcon"))) {
                $(".resetIconFloat,.saveIconFloat").removeClass("activeIcon").unwrap();
                $(".resetIconFloat").off("click", addResetEvent);
            }
        }

        $(".deleteIconAssignment").on("click", function (eventObj) {
            //eventObj.preventDefault();
            console.log(consolePrefix + "Delete Assignment");

            var thisID = $(this).parents("[data-assignment]").attr("data-assignment");

            console.log(thisID);

            currentPageAssignments.forEach(function (assignment) {
                //console.log(assignment.ID);
                if (assignment.ID == thisID) {
                    $(assignment.element).remove();
                    assignment.isRemoved = true;
                }
            });

            makeFloatsActive();
        });

        $(".resetIconAssignment").on("click", function (eventObj) {
            //eventObj.preventDefault();
            console.log(consolePrefix + "Reset Assignment");

        });

        $(".newIconFloat").on("click", function (eventObj) {
            eventObj.preventDefault();
            console.log(consolePrefix + "New Assignment");

        });

        function addResetEvent(eventObj) {
            eventObj.preventDefault();
            console.log(consolePrefix + "Reset Changes");

            $("table#Assignments tbody").empty();
            for (var i = 0; i < pageAssignmentsTemplates.length; i++) {
                //element stored at load is updated, make and store copy for restoration? (useful bc elements will be modified)
                var copy = $(pageAssignmentsTemplates[i].element).clone();
                $("table#Assignments tbody").append(copy);
                currentPageAssignments[i] = new Assignment(copy);
            }

            removeComponents();
            addButtons();

            //reattach event handlers
            attachEventHandlers();

            //deactivate reset (and save) button
            makeFloatsInactive();
        }

        $(".saveIconFloat").on("click", function (eventObj) {
            eventObj.preventDefault();
            console.log(consolePrefix + "Save Changes");

            //save functionality

            makeFloatsInactive();
        });
    });
}


function Assignment(element) {
    this.element = element;
    this.ID = jQuery(element).attr("data-assignment");
    this.isRemoved = false;
}

//receive messages from page action
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.event == "activate") {

        console.log(consolePrefix + "activate");

        /*chrome.storage.local.get(["active"], function (data) {
         if (data.active) {
         load();
         }
         });*/

        load();

        sendResponse({callback: "success"});
        return;

    } else if (request.event == "deactivate") {

        console.log(consolePrefix + "deactivate");

        unload();

        sendResponse({callback: "success"});
        return;

    }

    sendResponse({callback: "failure"});

});