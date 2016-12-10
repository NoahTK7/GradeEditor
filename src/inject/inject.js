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

    //TODO: reset assignments, course grade?

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

            updateCourseGrade();
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

            updateCourseGrade();

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
    var jElement = jQuery(element);
    this.element = element;

    this.ID = jElement.attr("data-assignment");
    this.isRemoved = false;

    var letterContents = jElement.find("div.letter").children().contents().text();
    var pointsContents = jElement.find(".numeric");

    //single letter of grade, undefined if none
    this.letterGrade = letterContents.charAt(0);
    //string of percentage followed by percent sign
    this.percent = letterContents.substr(1);

    //
    this.pointsEarned = pointsContents.find(".points").text();
    //
    this.pointsPossible = pointsContents.find(".max").text();

    console.log(this.letterGrade, this.pointsEarned, this.pointsPossible, this.percent);
}

function updateCourseGrade() {
    var pointsEarnedTotal = 0;
    var pointsPossibleTotal = 0;

    currentPageAssignments.forEach(function (assignment) {
        if(!(assignment.pointsEarned == "") && !(assignment.pointsEarned == "X") && !assignment.isRemoved) {
            pointsEarnedTotal += parseInt(assignment.pointsEarned);
            pointsPossibleTotal += parseInt(assignment.pointsPossible);
        }

        console.log(pointsEarnedTotal + " / " + pointsPossibleTotal);
    });

    var newGrade = Math.round(pointsEarnedTotal/pointsPossibleTotal*100);
    var letterElement = jQuery("#ContentHeader").find(".letter");

    letterElement.text(newGrade+"%");

    //set colors
    if (newGrade>=90) {
        //letterElement.css({"color":"#007F00", "background-color":"#E6F2E6"});
        letterElement.prop("style", "color:#007F00;background-color:#E6F2E6");
    } else if (newGrade>=80) {
        //letterElement.css({"color":"#3F7F00", "background-color":"#ECF2E6"});
        letterElement.prop("style", "color:#3F7F00;background-color:#ECF2E6");
    } else if (newGrade>=70) {
        //letterElement.css({"color":"#7F7F00", "background-color":"#F2F2E6"});
        letterElement.prop("style", "color:#7F7F00;background-color:#F2F2E6");
    } else if (newGrade>=60) {
        //letterElement.css({"color":"#7F3F00", "background-color":"#F2ECE6"});
        letterElement.prop("style", "color:#7F3F00;background-color:#F2ECE6");
    } else {
        //letterElement.css({"color":"#7F0000", "background-color":"#F2E6E6"});
        letterElement.prop("style", "color:#7F0000;background-color:#F2E6E6");
    }
}

//receive messages from page action
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.event == "activate") {

        console.log(consolePrefix + "activate");

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

//grade colors
// A (X): color:#007F00;background-color:#E6F2E6
// B: color:#3F7F00;background-color:#ECF2E6
// C: color:#7F7F00;background-color:#F2F2E6
// D: color:#7F3F00;background-color:#F2ECE6
// F: color:#7F0000;background-color:#F2E6E6