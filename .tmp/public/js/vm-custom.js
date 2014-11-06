/*############333Important for IE Hack##############################################*/
// Passing Arguments to setTimeout and setInterval
//http://arguments.callee.info/2008/11/10/passing-arguments-to-settimeout-and-setinterval/

(function (f) {
    window.setTimeout = f(window.setTimeout);   // overwrites the global function!
    window.setInterval = f(window.setInterval); // overwrites the global function!
})(function (f) {
    return function (c, t) {
        var a = [].slice.call(arguments, 2);    // gathers the extra args
        return f(function () {
            //Swathi: added check for c is not undefined 
            //sometime is c can be undefined so process should do only if c is not undefined
            if (c != undefined) { c.apply(this, a); }               // passes them to your function
        }, t);
    };
});


/*
Author : Senthil
Date Created: 04-Dec-2012
Description: Contains Custom methods
Modification Log:


1) Date: 19-Dec-2012 : Moved the code from vm validator to vm-custom : By : Mahasweta Dutta
2) Date: 02-May-2013 : Replaced custom codes for date handling with moment.js library codes
*/




//http://api.jquery.com/jQuery.Callbacks/
//Example
// Publish - > $.Topic("mailArrived").publish("hello world!")
// Subscribe - > $.Topic("mailArrived").subscribe(fn1);
//Handler -> function fn1(args){console.log(args);}
var topics = {};
$(function () {
    jQuery.Topic = function (id) {
        var callbacks,
        method,
        topic = id && topics[id];
        if (!topic) {
            callbacks = jQuery.Callbacks();
            topic = {
                publish: callbacks.fire,
                subscribe: callbacks.add,
                unsubscribe: callbacks.remove
            };
            if (id) {
                topics[id] = topic;
            }
        }
        return topic;
    };

});

//-------------------------------------------------------------------
// Global Selected row highlight event handelr for Jquery Data Table
//------------------------------------------------------------------
function Handle_datatableColumnClicked(nRow) {
    //Apply back ground only if the table has 'stripped' class
    //set odd rows background color to grey
    ($(nRow).parents('table').hasClass('table-striped')) ? $(nRow).parents('table').find('tr.odd td').css("background-color", "#f9f9f9") : null;
    //remove the active item(blue color)
    $(nRow).parents('table').find('td').removeClass('btn-primary');
    //Added as IE9 was not taking 'btn-primary' blue color:hack code
    //$(nRow).parents('table').find('td').css("background-color", "");
    //take out font color i.e white
    $(nRow).parents('table').find('i').removeClass('vm-white');
    $(nRow).parents('table').find('i').css('color', '#428bca'); //Added by asha
    $(nRow).parents('table').find('a').css('color', '#428bca');//Added by asha
    //apply back the  background color i.e blue for the selected item 
    ($(nRow).parents('table').hasClass('table-striped')) ? $(nRow).find('td').css("background-color", 'white') : null;
    $(nRow).find('td').addClass('btn-primary');
    //Added as IE9 was not taking 'btn-primary' blue color:hack code
    //$(nRow).find('td').css("background-color", "#0044cc");
    //set White color for image
    $(nRow).find('i').addClass('vm-white');
    $(nRow).find('i').css('color', 'white'); //Added by asha
    $(nRow).find('a').css('color', 'white'); //Added by asha
    return false;
}


//---------------------------------------------------------------------
//  Function for Bootstrap Modal
//---------------------------------------------------------------------  
function BootstrapModal(divId, width) {
    $('#' + divId).modal({
        backdrop: "static", show: true //Modified on 3-Mar-2013 changed backdrop form true to static to avoid popup getting closed if it is clicked outside
    })
    .css({ 'width': function () { return width; }, 'margin-left': function () { return -($(this).width() / 2); }
    });
}

//-------------------------------------------------------------------------------------------
//Method to reset the controls
//Currently it will reset only input and select 
//-------------------------------------------------------------------------------------------
function ResetControls(id) {
    $("#" + id + " input").val("");
    $("#" + id + " select").select2("val", { id: null, text: null });
    //to empty the text area
    $("#" + id + " textarea").val("");
    //Changed by Chaitra - 28th Mar 2014
    $("#" + id + " .but-switch").swatch('setState', false);
}

//-------------------------------------------------------------------------------------------
//Method to reset the form
//Currently it will reset only input and select 
//-------------------------------------------------------------------------------------------
function ResetForm(id) {
    //reset the validate form
    $('#' + id).validate().resetForm();
    //Added by Swathi: to reset the form beensubmitted to false to save new record 
    $('#' + id).validate().beenSubmitted = false;
    //end
    //remove error class if exists
    $(".has-error").removeClass("has-error");
}

//added new parameter "hasMultipleForms"  to avoid multiple alerts 
//if the view has multiple forms then alert message is avoided in the Invalid handler
//Instead of that do in the form itself in submit click button
//ex:  var employeeErrorlist = $("#frmEmployeeGeneralDetails").validate().errorList; //this will list the errors in the form
//run through the error list and display the alert at the end
function vmValidatorWrapper(formId, rules, messages, hasMultipleForms) {
    // hook up the form, the validation rules, and messages with jQuery validate.
    var showErrorMessage = false;
    var validator = $("#" + formId).validate({
        ////Elements to ignore when validating, simply filtering them out.
        ignore: "input:hidden",
        onchange: true,
        errorPlacement: function (error, element) {
            //Modified On 4th feb 2013 By Ranjitha
            //Reason:If any element has any Image attached to it,then error class was getting created between the image and the element
            //To avoid this, error class is added below the span
            //Modified on 18-Mar-2014 By Ranjitha
            //If any control is grouped with the span then "vm-group" class needs to be added .This is added since highlighting of the 
            //grouped control was not working properly.  
            if (element.hasClass('vm-date') || element.hasClass('vm-group')) {
                //get the span and attach the text after it
                error.insertAfter(element.closest('div'));
            }
            else {
                error.insertAfter(element);
            }
            //Enable wrap for longer error messages
            $("label.error").attr('style', 'white-space:pre-wrap;');
            //Call the function to scroll the window to required field
            //AnimateToRequiredDiv(formId);
        },
        //Key/value pairs defining custom rules. Key is the name of an element 
        //value is an object consisting of rule/parameter pairs or a plain String.
        rules: rules,
        //Key/value pairs defining custom messages. Key is the name of an element, 
        //value the message to display for that element. Instead of a plain message another 
        //map with specific messages for each rule can be used. 
        messages: messages,
        //Highlights an invalid element by fading it out and in again.
        highlight: function (label) {
            $(label).closest('.form-group').addClass('has-error');
            AnimateToRequiredDiv(formId)
            return false;
        },
        //the error label is displayed to show a valid element.
        success: function (label) {
            $(label).closest('.form-group').removeClass('has-error');
            //Added beacuse it was not removing the error label in mozilla, and causing alignment issues because label was 
            //present but not having any text.
            $(label).remove();
        },
        //Callback for handling the actual submit when the form is valid
        submitHandler: function (form) {
            //Table validation(start) Added By ranjitha on 20-01-2014
            var errorMessages = "";
            _.each($("#" + formId + " div.tablerequired"), function (obj) {
                if ($("#" + obj.id + " table tbody tr").length == 0) {
                    $("#" + obj.id).css({ 'border-color': '#EE1411', '-webkit-box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #A71614', '-moz-box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #A71614', 'box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #A71614' });
                    $("#" + obj.id).next().html("Atleast one " + $("#" + obj.id).data('message') + " required").attr('style', 'color:#b94a48');
                    errorMessages += "Atleast one " + $("#" + obj.id).data('message') + " required \n"; //Message Example : Atleast one address is required
                }
            });
            if (!hasMultipleForms && errorMessages != "") {
                alert(errorMessages);
                return false;
            }
            //Table validation(end)    
            //Added by Swathi on 1stAug13: To avoid multiple submits 
            //if (!this.beenSubmitted) {
            this.beenSubmitted = true;
            //done to prevent multiple clicks of button
            //disable submit button for a particular form on first click 
            $(form).find(':submit').attr('disabled', 'disabled');
            $("." + $(form).data('name')).attr('style', '');
            $("." + $(form).data('name')).next().html("");
            //alert(vm_ui_events.FormSubmitClick + '_' + formId)
            setTimeout(function () {
                $.Topic(vm_ui_events.FormSubmitClick + '_' + formId).publish(form);
                 })
            

        },
        //Displays a message , indicating how many fields are invalid when the user tries to submit an invalid form.
        invalidHandler: function (form, validator) {
            var errorMessages = "";
            for (var i = 0; i < validator.errorList.length; i++) {
                errorMessages = errorMessages + validator.errorList[i].message + "\n";
            }
            //Below Code is only for table validation (Start)
            //Loop through the entire form and check for table required
            //and then check if number of rows is zero then highlight the div and display the error message
            _.each($("#" + formId + " div.tablerequired"), function (obj) {
                if ($("#" + obj.id + " table tbody tr").length == 0) {
                    $("#" + obj.id).css({ 'border-color': '#EE1411', '-webkit-box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #A71614', '-moz-box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #A71614', 'box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #A71614' });
                    $("#" + obj.id).next().html("Atleast one " + $("#" + obj.id).data('message') + " required").attr('style', 'color:#b94a48');
                    errorMessages += "Atleast one " + $("#" + obj.id).data('message') + " required \n"; //Message Example : Atleast one address is required
                }
            });
            //Code is only for table validation (End)
            if (!hasMultipleForms) {
                alert(errorMessages);
                //added on 29-July-12 by Swathi: for issue #5877
                //always set the focus to first element in the validation error list
                validator.errorList[0].element.focus();
                //end
            }
            AnimateToRequiredDiv(formId);
        }
    });
}
//--------------------------------------------------------------------------
//Function to scroll back to the required field which is highlighted
//--------------------------------------------------------------------------
function AnimateToRequiredDiv(Id) {
    var isModalVisible = false;
    //scroll back to the required field
    $(".modal").each(function () { if ($(this).attr('aria-hidden') == 'false') { isModalVisible = true; } });
    if (isModalVisible == false) {//If modal is hidden(else for modal validation, background window will scroll everytime for an error)
        if ($(".control-group.error").length >= 1) {
            var scrollPos3 = $(".control-group.error").first().offset().top - 50;
            $('html,body').animate({
                scrollTop: scrollPos3
            }, 0);
        }
    }
}
//--------------------------------------------------------------------------
// Generic function to Append Html Templates
//--------------------------------------------------------------------------
function AppendHtmlTemplates(templatePath, appendToDiv, data) {
    //1) Clear the div
    $("#" + appendToDiv).empty();
    //2) insert the template to the div
    $.get(_AbsolutePath + templatePath, function (template) {
        /*Attach Panel*/
        $.tmpl(template, data).appendTo("#" + appendToDiv);
        //setTimeout(functionToCall, 0);
    });
}

//Starts: Added by Swathi on 7 Jan13 to get all weeks based on Year
//--------------------------------------------------------------------------
//Function to get all Weeks based on Year and Month in an array
//Week Period starts from Sunday and ends in Saturday
//1) getting days which are sundays for an month and manipulating based on that to get the week period
//--------------------------------------------------------------------------
function GetWeeksBasedOnMonthAndYear(year, month) {
    //declare array to hold week periods for a selected year and month
    var weekPeriods = [];
    //declare array to hold all days which are sundays
    var days = [];
    //get the start date of a particular month  in  a year where week starts from Sunday
    var date = new Date(year, month, 1);
    //check whether the day is not sunday
    while (date.getDay() != 0) {
        //add 1 to date to go for next day
        date.setDate(date.getDate() + 1);
    }
    //the loop should run until the the year matches with user selected year
    while (date.getFullYear() == year && date.getMonth() == month) {
        //get month of the date
        var m = date.getMonth() + 1;
        //get date of the date
        var d = date.getDate();
        //push the date to an array
        days.push(
          year + '-' +
          (m < 10 ? '0' + m : m) + '-' +
          (d < 10 ? '0' + d : d)
        );
        //add 7 days to date and set the date
        date.setDate(date.getDate() + 7);
    }
    //declare variable to hold all months three letter code
    var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    //loop for each date in an array and get the week period
    for (var d in days) {
        //set the start date 
        var startDt = new Date(days[d]);
        //set the end date as start date
        var endDt = new Date(days[d]);
        //get the year of start date
        var stYear = startDt.getFullYear().toString();
        //declare variable to hold Week Start Date in the format ddMMMYY
        var weekBeginDt = ((startDt.getDate() < 10) ? '0' + startDt.getDate() : startDt.getDate()) + monthname[startDt.getMonth()] + stYear.substring(2);
        //set the date of End Date
        endDt.setDate(endDt.getDate() + 6);
        //get the year of End Date
        var endYear = endDt.getFullYear().toString();
        //declare variable to hold Week End Date in the format ddMMMYY
        var weekEndDt = ((endDt.getDate() < 10) ? '0' + endDt.getDate() : endDt.getDate()) + monthname[endDt.getMonth()] + endYear.substring(2);
        var weekIndex = parseInt(d) + 1;
        //push the Week period in to Array
        //push Week name, Week period, index
        weekPeriods.push(["W" + weekIndex, weekBeginDt + "-" + weekEndDt, d, startDt, endDt]);
    }

    //return WeekPeriods
    return weekPeriods;
}
//Ends: Added by Swathi on 7 Jan13 to get all weeks based on Year

//--------------------------------------------------------------------------
// Generic function to Convert Json Date to dd/mm/yyyy format
//--------------------------------------------------------------------------
function ConvertJsonDateToDDMMYYFormat(jsonDate) {
    //use moment.js library to convert json date to required format
    return moment(jsonDate).format('DD/MM/YYYY');
}

//--------------------------------------------------------------------------
// Generic function to Convert dd/mm/yyyy Date to mm/dd/yyyy format
//--------------------------------------------------------------------------
function ConvertDDMMYYToMMDDYYFormat(dateInDDMMYYFormat) {
    //check if the passed date is not empty
    if (dateInDDMMYYFormat != "") {
        return moment(dateInDDMMYYFormat, 'DD/MM/YYYY').format('MM/DD/YYYY'); //from moment.js library
    }
    return false;
}
//-------------------------------------------------------------------------------------------
//Generic Function to convert  date to dd/mm/yyyy format
//-------------------------------------------------------------------------------------------
function ConvertDateToDDMMYYYY(date) {
    return moment(date).format('DD/MM/YYYY'); //from moment.js library
}
//--------------------------------------------------------------------------
// Generic function to get full year for date comparison
//--------------------------------------------------------------------------
function GetFullYearForDateComparison(value) {
    //use moment.js to return javascript date in format: Sat Apr 19 2003 00:00:00 GMT+0530 (India Standard Time)
    return moment(value).toDate();
}

//--------------------------------------------------------------------------
// Generic function to get Date and Time Stamp
// Input will be Json date
//--------------------------------------------------------------------------
function DateTimeFormatter(jsonDate) {
    //format the json date with moment. Output format will be : 04/22/2013 15:20:48
    return moment(jsonDate).format('MM/DD/YYYY HH:mm:ss');
}

function DateTimeFormatterMMDDDYYYY(jsonDate) {
    //format the json date with moment. Output format will be : 04/22/2013 15:20:48
    return moment(jsonDate).format('DD-MMM-YYYY HH:mm:ss');
}

jQuery.validator.addMethod("phoneUS", function (phone_number, element) {

    phone_number = phone_number.replace(/\s+/g, "");
    return this.optional(element) || phone_number.length > 9 &&
		phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
}, "Please specify a valid phone number");

jQuery.validator.addMethod("lessThanOrEqualTo", function (value, element, param) {
    if ($(param).val() === "") {
        return true;
    } else {
        if (!/Invalid|NaN/.test(new Date(value))) {
            //Swathi: commented on 15-May-13: the date is already in MM/dd/yyyy format  and no need of conversion date as it is failing the start date and end date validation
            //return GetFullYearForDateComparison(ConvertDDMMYYToMMDDYYFormat(value)) <= GetFullYearForDateComparison(ConvertDDMMYYToMMDDYYFormat($(param).val()));
            return (moment(value).isSame($(param).val()) || moment(value).isBefore($(param).val()));
        }
        return isNaN(value) && isNaN($(param).val())
        || (Number(value) <= Number($(param).val()));
    }
}, 'Must be less than or equal to {0}.');

jQuery.validator.addMethod("greaterThanOrEqualTo", function (value, element, param) {
    //temp variable used to convert dd/mm/yy format date into mm/dd/yy
    //Swathi: commented on 15-May-13: the date is already in MM/dd/yyyy format  and no need of conversion date as it is failing the start date and end date validation
    var tempDate = $(param).val(); //ConvertDDMMYYToMMDDYYFormat(fromDt);
    value = value; //ConvertDDMMYYToMMDDYYFormat(value);
    if ($(param).val() === "") {
        return true;
    } else {
        if (!/Invalid|NaN/.test(new Date(value))) {
            return (moment(value).isSame(tempDate) || moment(value).isAfter(tempDate));
        }
        return isNaN(value) && isNaN(tempDate)
        || (Number(value) >= Number(tempDate));
    }
}, 'Must be greater than or equal to {0}.');

jQuery.validator.addMethod("lessThan", function (value, element, param) {
    if ($(param).val() === "") {
        return true;
    } else {
        if (!/Invalid|NaN/.test(new Date(value))) {
            return moment(value).isBefore($(param).val());
        }
        return isNaN(value) && isNaN($(param).val())
        || (Number(value) < Number($(param).val()));
    }
}, 'Must be less than {0}.');

jQuery.validator.addMethod("greaterThan", function (value, element, param) {
    if ($(param).val() === "") {
        return true;
    } else {
        if (!/Invalid|NaN/.test(new Date(value))) {
            return moment(value).isAfter($(param).val());
        }
        return isNaN(value) && isNaN($(param).val())
        || (Number(value) > Number($(param).val()));
    }
}, 'Must be greater than {0}.');

$.validator.addMethod("alphanumeric", function (value, element) {
    return this.optional(element) || value === "NA" ||
        value.match(/^[a-z0-9]*$/i);
}, "Please enter a valid number, or 'NA'");

//-----------------------------------------------------------------------------------------------------------------------
//Function to Convert date to required format
//--------------------------------------------------------------------------------------------------------------------------
function DateFormatter(date, format) {
    if (format == "dd-mmm-yyyy") {
        //use moment.js to get date, e.g. :04/19/2013 in format: 19-Apr-2013
        return moment(date).format('DD-MMM-YYYY');
    }
    else if (format == "mm/dd/yy") {
        //use moment.js to get date, e.g.: 04/19/2013 in format: 04/19/13
        return moment(date).format('MM/DD/YY');
    }
    if (format == "ddmmmyyyy") {
        //use moment.js to get date, e.g. :04/19/2013 in format: 19Apr2013
        return moment(date).format('DDMMMYYYY');
    }
}

//-----------------------------------------------------------------------------------------------------------------------
//Function to Convert a table Row into Json object
//--------------------------------------------------------------------------------------------------------------------------
function tableRowToJson(nRow) {
    var data = [];

    // first row needs to be headers
    var headers = [];

    // go through cells

    var columnData = {};

    for (var j = 0; j < nRow.cells.length; j++) {
        if ($(nRow.cells[j]).data("column-name") !== undefined && $(nRow.cells[j]).data("column-name") != null) {
            if ($(nRow.cells[j]).data("cell-value") !== undefined && $(nRow.cells[j]).data("cell-value") !== null) {
                //in case of switches the cell value is 1 or 0, assign data instead of innerhtml which has image class
                columnData[$(nRow.cells[j]).data("column-name")] = $(nRow.cells[j]).data("cell-value"); //nRow.cells[j].innerHTML;
            } else {
                columnData[$(nRow.cells[j]).data("column-name")] = $.trim($(nRow.cells[j]).text());
            }
        }
    }

    data.push(columnData);
    return data;
}

// to sort the value in alphabetical order in drop down
function SortSelect2Options(id) {
    var prePrepend = "#";
    if (id.match("^#") == "#") prePrepend = "";
    $(prePrepend + id).html($(prePrepend + id + " option").sort(
        function (a, b) { return a.text == b.text ? 0 : a.text < b.text ? -1 : 1 })
    );
}


//-----------------------------------------------------------------------------------------------------------------------
//Function to Apply progress bar for entire form
//--------------------------------------------------------------------------------------------------------------------------
function FormProgressBar(divId) {
    $("BODY").append(
         '<div class="modal-backdrop vm-dummy-formProgressbar fade in vm-dummy-' + divId + '" ><div class="loader" id="' + divId + '" ><div class="bar"></div><div class="bar"></div><div class="bar"></div></div></div>');
    $("#" + divId).css('position', 'absolute');
    $("#" + divId).css("left", ($(window).width() / 2 - $("#" + divId).width() / 2) + "px");
    $("#" + divId).css("top", ($(window).height() / 2 - $("#" + divId).height() / 2) + "px");

    return false;
}

//-----------------------------------------------------------------------------------------------------------------------
//Function to remove  progress bar for entire form
//--------------------------------------------------------------------------------------------------------------------------
function RemoveFormProgressBar() {
    $(".vm-dummy-formProgressbar").remove();
    return false;
}

//-----------------------------------------------------------------------------------------------------------------------
//Function to Apply Custom progress bar for entire form with or without text
//Parameter divId is the id of the div;   isTextRequired is if text is required after the progress bar image; text is the required text after the Progress Bar
//--------------------------------------------------------------------------------------------------------------------------
function CustomFormProgressBar(divId, isTextRequired, text) {
    if (isTextRequired == true && isTextRequired != undefined) {

        $("BODY").append(
         '<div class="modal-backdrop vm-dummy-formProgressbar fade in vm-dummy-' + divId + '" style="z-index:10000"><div class="loader" id="' + divId + '" ><div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div><div>' + text + '</div></div></div>');
    }
    else {
        $("BODY").append(
         '<div class="modal-backdrop vm-dummy-formProgressbar fade in vm-dummy-' + divId + '" style="z-index:10000" ><div class="loader" id="' + divId + '" ><div class="bar"></div><div class="bar"></div><div class="bar"></div></div></div>');
    }
    $("#" + divId).css('position', 'absolute');
    $("#" + divId).css("left", ($(window).width() / 2 - $("#" + divId).width() / 2) + "px");
    $("#" + divId).css("top", ($(window).height() / 2 - $("#" + divId).height() / 2) + "px");

    return false;
}

// Fucntion to retreive icons based on request type
function DetermineIconForRequest(requestName) {
    var icon = "icon-trash red";
    switch (requestName.toLowerCase().replace(" ", "")) {
        case "termination":
            icon = "icon-trash black";
            break;
        case "newhire":
            icon = "icon-group";
            break;
        case "statuschange":
            icon = "icon-pencil";
            break;
        case "genericid":
            icon = "icon-credit-card";
            break;
        case "rehire":
            icon = "icon-undo";
            break;
        case "coderelease":
            icon = "icon-code";
            break;
    }
    return icon;
}

//-----------------------------------------------------------------------------------------------------------------------
// Fucntion to set local storage item, to avoid "QuotaExceededError: DOM Exception 22 " in chrome
//-----------------------------------------------------------------------------------------------------------------------
function setLocalStorageItem(key, val) {
    //Loop through all the Local Storage formed
$.each(vmLocalStorage, function (i, item) {    
        //Condition to clear duplicate localstorage key to avoid bulk storage and space occupied
        //i contain full url along with the version
        //key is the current url
        //key.indexOf("?") is to compare with i, without version because till ? local storage url is same 
        if (i.indexOf(key.substring(0, key.indexOf("?"))) == 0) {
            //remove the key if it already exist
            vmLocalStorage.removeItem(i);
        }
    });

    //remove the item
    vmLocalStorage.removeItem(key);
    //set the item
    vmLocalStorage.setItem(key, val);
}

//-----------------------------------------------------------------------------------------------------------------------
// Fucntion to get the singer role description
//-----------------------------------------------------------------------------------------------------------------------
function GetSignerRoleShortForm(SignerRoleCode) {
    var signerRole = "";
    switch (SignerRoleCode) {
        case vm_ui_settings.HIR_MGR: signerRole = vm_ui_settings.HiringManager; break;
        case vm_ui_settings.SEC_ADM: signerRole = vm_ui_settings.SecurityAdministrator; break;
        case vm_ui_settings.SEC_ADM_RVW: signerRole = vm_ui_settings.SecurityAdministratorReviewer; break;
        case vm_ui_settings.HR_DIR: signerRole = vm_ui_settings.HRDirector; break;
        case vm_ui_settings.REQUESTER: signerRole = vm_ui_settings.Requester; break;
        case vm_ui_settings.SEC_GRP: signerRole = vm_ui_settings.SecurityGroup; break;
        case vm_ui_settings.SEC_MGR: signerRole = vm_ui_settings.SecurityManager; break;
        case vm_ui_settings.BUITL: signerRole = vm_ui_settings.BuITLeader; break;
        case vm_ui_settings.SEC_MGR_RVW: signerRole = vm_ui_settings.SecurityManagerReviewer; break;
        case vm_ui_settings.ProdReleaseManager: signerRole = vm_ui_settings.ProductionReleaseManagerDesc; break;
        case vm_ui_settings.TestReleaseManager: signerRole = vm_ui_settings.TestReleaseManagerDesc; break;
        case vm_ui_settings.ProdReleaseImplementer: signerRole = vm_ui_settings.ProductionReleaseManagerDesc; break;

    }
    return signerRole;
}
//Swathi : added for Start date should be greater or equal to Hire date if start date is entered.
//Amod : Changed the name since this can be used in the situation where we enter either of the values or both of the values.
jQuery.validator.addMethod("greaterThanOrEqualToSomeDateIfEitherIsNull", function (value, element, param) {
    //temp variable used to convert dd/mm/yy format date into mm/dd/yy
    //Swathi: commented on 15-May-13: the date is already in MM/dd/yyyy format  and no need of conversion date as it is failing the start date and end date validation
    var tempDate = $(param).val();
    if (value === "") {
        value = tempDate;
    }
    if ($(param).val() === "") {
        return true;
    } else {
        if (!/Invalid|NaN/.test(new Date(value))) {
            return (moment(value).isSame(tempDate) || moment(value).isAfter(tempDate));
        }
        return isNaN(value) && isNaN(tempDate)
        || (Number(value) >= Number(tempDate));
    }

}, 'Must be greater than or equal to {0}.');
//Swathi : added for Start date as it is optional even if End date exists ie; End date is based on Hire date if the emp is contractor and start date is optional
jQuery.validator.addMethod("lessThanOrEqualToEndDate", function (value, element, param) {
    var tempDate = $(param).val();
    if (value === "") {
        value = tempDate;
    }
    if ($(param).val() === "") {
        return true;
    } else {
        if (!/Invalid|NaN/.test(new Date(value))) {
            //Swathi: commented on 15-May-13: the date is already in MM/dd/yyyy format  and no need of conversion date as it is failing the start date and end date validation
            //return GetFullYearForDateComparison(ConvertDDMMYYToMMDDYYFormat(value)) <= GetFullYearForDateComparison(ConvertDDMMYYToMMDDYYFormat($(param).val()));
            return (moment(value).isSame(tempDate) || moment(value).isBefore(tempDate));
        }
        return isNaN(value) && isNaN($(param).val())
        || (Number(value) <= Number($(param).val()));
    }
}, 'Must be less than or equal to {0}.');

//This method takes the Ids of Hire Date and Start Date fields from add employee popup in New Hire page(in 'param')
//and checks the following:
//1. End Date is >= Hire Date (if Start date is empty)  2. End Date is >= Start date (if Start Date is not empty)
jQuery.validator.addMethod("greaterThanOrEqualToendDateOrStartDate", function (value, element, param) {
    var tempDate = param.split(',');
    //IF in case , the start or end end is not a input control say "div" then data cannot be accessed with the val() function hence 
    //a condition is added 
    //Currently the data which is enclosed in the "div" is of format "dd-mmm-yyyy" hence it is converted to "mm-dd-yyyy" format
    var endDate = $(tempDate[0])[0].tagName == 'INPUT' ?$(tempDate[0]).val():$(tempDate[0]).text() ; //Value for End Date
    var startDate = $(tempDate[1])[0].tagName == 'INPUT' ?$(tempDate[1]).val(): $(tempDate[1]).text() ; //Value for Start Date
    var endDateLabel = $("label[for='" + $(tempDate[0]).attr('id') + "']:not(.error)").text().trim();
    var startDateLabel = $("label[for='" + $(tempDate[1]).attr('id') + "']:not(.error)").text().trim(); //get the label of end date    
    var msg = endDateLabel + " must be greater than or equal to " + startDateLabel;
    if (endDate !== "") {
        if (value === "") { //if End date is empty
            return true;
        }
        if (startDate === "") { //if start date is empty
            if (!/Invalid|NaN/.test(new Date(value))) {
                $.validator.messages.greaterThanOrEqualToendDateOrStartDate = msg;
                return (moment(value).isSame(endDate) || moment(value).isAfter(endDate)); //End date >= Hire date ?
            }
        } else {        //if all three dates are not empty
            if (!/Invalid|NaN/.test(new Date(value))) {               
                var firstChk = (moment(value).isSame(endDate) || moment(value).isAfter(endDate)); //End date >= Hire date ?
                if (!/Invalid|NaN/.test(new Date(startDate)) && firstChk == true) { //End date >= Hire date 
                    $.validator.messages.greaterThanOrEqualToendDateOrStartDate = msg;                    
                    return (moment(value).isSame(startDate) || moment(value).isAfter(startDate)); //End date >= Start date ?
                }
                else {
                    $.validator.messages.greaterThanOrEqualToendDateOrStartDate = msg;
                    return firstChk;            //End date < Hire date 
                }
            }
            return (isNaN(value) && isNaN(endDate) && isNaN(startDate)) || ((Number(value) >= Number(endDate)) && (Number(value) >= Number(startDate)));
        }
    }
    else {
        return true;
    }
}, function (params, element) {
    return $.validator.messages.greaterThanOrEqualToendDateOrStartDate; //Show appropriate message
});

//-----------------------------------------------------------------------------------------------------------------------
// Fucntion to get the request status description
//-----------------------------------------------------------------------------------------------------------------------
function GetRequestStatusShortForm(statusCode) {
    var statusName = "";
    switch (statusCode) {
        case vm_ui_settings.PendingStatus: statusName = vm_ui_settings.Pending; break;
        case vm_ui_settings.SignoffStatus: statusName = vm_ui_settings.WaitingForResponse; break;
        case vm_ui_settings.RejectStatus: statusName = vm_ui_settings.Rejected; break;
        case vm_ui_settings.VoidStatus: statusName = vm_ui_settings.Voided; break;
        case vm_ui_settings.ClosedStatus: statusName = vm_ui_settings.Closed; break;
        case vm_ui_settings.ApproveStatus: statusName = vm_ui_settings.Approved; break;
        case vm_ui_settings.DraftStatus: statusName = vm_ui_settings.Draft; break;

    }
    return statusName;
}
//Function to validate if a field has at least one letter from alphabet
jQuery.validator.addMethod("containsAtLeastOneLetter", function (value, element, param) {
    if (param === true) {
        if (value != "") { //check if some value is entered
            if (value.match(/[A-Za-z]+/g)) return true; //if matched, return valid
            else return false; //else return invalid
        } else return true; // if no value is entered, return as valid(since empty values are taken care by 'required' validation)
    }
}, "Enter at least one letter");


//Function to disable the previous dates from datepicker of 'To Date' in a combination of (From Date, To Date), when 'From Date' is selected.
//This fn updates the value in To Date to the selscted value in From Date Field, shows the date picker at To Date field, and 
//disables all the previous dates.
function DisablePreviousDatesInToDate(fromDateId, toDateId) {
    $("#" + fromDateId).on('changeDate', function () {
        var d = new Date($("#" + fromDateId).val());
        $("#" + toDateId).datepicker('update', $("#" + fromDateId).val()); //update the value to 'From Date' value.
        $("#" + toDateId).datepicker('show'); //Show the datepicker at To Date field
        $("#" + toDateId).datepicker('setStartDate', new Date(d)); //Disable all the previous dates
    });
}

//Function to get workflow icon with color
function GetIconForWorkflow(wf) {
    switch (wf) {
        case vm_ui_settings.WorkflowGenericIdCode: return 'icon-credit-card genericid-color';
            break;
        case vm_ui_settings.WorkflowNewHireCode: return 'icon-group newhire-color';
            break;
        case vm_ui_settings.WorkflowStatusChangeCode: return 'icon-pencil statuschange-color';
            break;
        case vm_ui_settings.WorkflowReHireCode: return 'icon-undo rehire-color';
            break;
        case vm_ui_settings.WorkflowTerminationCode: return 'icon-trash termination-color';
            break;
        case vm_ui_settings.WorkflowCodeReleaseCode: return 'icon-code release-color';
            break;
    }
}

//Function to get request types with spaces between words e.g. 'StatusChange' to 'Status Change'(fix to #5411)
function GetRequestTypeWithSpaces(reqType) {
    switch (reqType) {
        case vm_ui_settings.StatusChangeWithoutSpace: return vm_ui_settings.StatusChange; break;
        case vm_ui_settings.GenericIdWithoutSpace: return vm_ui_settings.GenericId; break;
        case vm_ui_settings.NewHireWithoutSpace: return vm_ui_settings.NewHire; break;
        case vm_ui_settings.ReHireWithoutSpace: return vm_ui_settings.ReHireDisplay; break; //no need for spaces
        case vm_ui_settings.TerminationWithoutSpace: return vm_ui_settings.Termination; break; //no need for spaces
        case vm_ui_settings.SourceCodeReleaseWithoutSpace: return vm_ui_settings.SourceCodeRelease; break; //no need for spaces    
    }
}

//-------------------------------------------------------------------------------------------
//Function handler for scrolling to required div
//-------------------------------------------------------------------------------------------
function ScrollToRequiredDiv(divId) {
    //scroll back to the required field
    $('html,body').animate({
        scrollTop: $("#" + divId).offset().top - 50
    }, 0);
}

//-------------------------------------------------------------------------------------------
//Function to return Version of MasterSeedInformation for a particular Master
//-------------------------------------------------------------------------------------------
function GetMasterSeedVersion(masterName) {
    
    var matchecdItem = jQuery.grep(vm_ui_globalObj.g_MasterSeedInfo, function (n, i) { return n.Name == masterName; });
    if (matchecdItem.length > 0)
        return matchecdItem[0].Value;
    else
        return 1;
}


// Fucntion to retreive icons based on request type 
function DetermineIconForMyRequest(requestName) {
    var icon = "";
    switch (requestName.toLowerCase().replace(" ", "").replace(" ", "")) {
        case "termination":
            icon = "icon-trash red";
            break;
        case "newhire":
            icon = "icon-group newhire-color";
            break;
        case "statuschange":
            icon = "icon-pencil statuschange-color";
            break;
        case "genericid":
            icon = "icon-credit-card genericid-color";
            break;
        case "rehire":
            icon = "icon-undo rehire-color";
            break;
        case "release":
            icon = "icon-code release-color";
            break;
    }
    return icon;
}

//-----------------------------------------------------------------------------------------------------------------
/*@Author: karthiga
*@DateCreated: 16-7-2013   
*@Decription: Function returns the string  with 20 characters and whole string to be viewed in the tooltip
*/
//------------------------------------------------------------------------------------------------------------------
function ChopDataFormatter(elCell, oRecord, oColumn, oData) {
    var descriptionLink;
    var choplen = 0;
    if (oColumn.width <= 40)
        choplen = 3;
    else if (oColumn.width > 40 && oColumn.width <= 80)
        choplen = 6;
    else if (oColumn.width > 80 && oColumn.width <= 120)
        choplen = 10;
    else if (oColumn.width > 120 && oColumn.width <= 150)
        choplen = 13;
    else if (oColumn.width >= 150)
        choplen = 15;
    var chopdatastr = chopdata(oRecord.getData(oColumn.key), 0, choplen);
    elCell.innerHTML = chopdatastr;
}
//================================================================== 
//  Chop string based on start and end position                 
//==================================================================
function chopdata(str, start, end) {
    var chopdata = str;

    if (str.length > end) {
        var chopdata = str.substring(start, end);
        chopdata = chopdata + "<b>...</b>";
    }
    return chopdata;
}

function chopdetails(str, start, end) {
    var chopdata = str;

    if (str.length > end) {
        var chopdata = str.substring(start, end);
        chopdata = chopdata + "...";
    }
    return chopdata;
}

//**********************************************************************************************
//                        Generic bootstrap modal progressbar
//http://dotnetspeak.com/2013/05/creating-simple-please-wait-dialog-with-twitter-bootstrap
//**********************************************************************************************
var myAppEuLuxMotors;
 myAppEuLuxMotors = myAppEuLuxMotors || (function () {
        var pleaseWaitDiv = $('<div id="myModal" class="modal fade modal-prg" tabindex="-1" data-keyboard="false" style="display: none;"aria-hidden="false"><div class="modal-dialog modal-vertical-centered modal-dialog-prg" style="width: 200px;"><div class="modal-content modal-content-prg" style="border: 4px solid rgba(1, 0, 0, 1);" ><div class="modal-body"><center><i class="fa fa-spinner fa-spin fa-2x" style="color:orange;"></i></center></div></div></div></div>');
        return {
            showPleaseWait: function () {
                pleaseWaitDiv.modal('show');               
            }
        , hidePleaseWait: function () { pleaseWaitDiv.modal('hide'); }
        };

    })();
    //**********************************************************************************************



//------------------------------------------------------------------------------------------
// Utility function to check the existence of master data in the local store
//-------------------------------------------------------------------------------------------
function CheckIfDataAvailableInLocalStorage(args) {
    var o = vmLocalStorage.getItem(args.CodeKeyUrl)
    return (o != null)
}

//------------------------------------------------------------------------------------------
//Utility function to attach the datatable pagination
//Modifed on 13-Feb-2014 
//Reason : Introduced sorting functionality 
//Columns to be sorted should have the class "sorting_asc" for ascending
//and "sorting_desc" for descending
//"tableId" is the Id of the table
//In order to have datatable row reorder , add "vm-rowReorder" class to  
//body template
//http://jsfiddle.net/upenrao/HEDvf/7/light/
//http://jquery-datatables-row-reordering.googlecode.com/svn/trunk/index.html
//-------------------------------------------------------------------------------------------
function AttachDatatablePagination(tableId) {
    //Sorting (start)
    var columnSortLst = [], cols_DisableSorting = [];
    //loop through each row to check for sorting class, if exist then collect it in an array
    //then pass the collection to "aaSorting" property 
    $('#' + tableId + ' th').each(function (index, e1) {
        var columnSort = [];
        if ($(e1).hasClass('sorting_asc')) {
            columnSort.push(index, 'asc');
        } else if ($(e1).hasClass('sorting_desc')) {
            columnSort.push(index, 'desc');
        }
        else {
            //these are the columns for which sorting is not required
            //pass this array for "aoColumnDefs==aTargets>" property 
            cols_DisableSorting.push(index);
        }
        columnSort.length > 0 ? columnSortLst.push(columnSort) : "";
    });
    //Sorting (end)
    window[tableId + '_Table'] = $('#' + tableId).dataTable({
        "sDom": "<'row'<'col-md-6 offset1'l><'col-md-6 offset1'<'pull-right' f>>r>t<'row'<'col-md-6 offset1'<'vm-strong'i>><'col-xs-6 offset1'<'pull-right' p>>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "<span style='vertical-align: -webkit-baseline-middle;'>Show _MENU_ entries</span>",
            "sSearch": "" 
        },        
        "fnDrawCallback": function (oSettings) {
            var pagination = $("#" + tableId).siblings('div').find('.pagination');
            pagination.addClass('pagination-sm');
            pagination.find('.prev a').html('<i class="fa fa-chevron-circle-left"/>');
            pagination.find('.next a').html('<i class="fa fa-chevron-circle-right"/>')
            $('.dataTables_filter input').attr('placeholder', 'Search Text').addClass('form-control input-sm');
            $('select[name=' + tableId + '_length]').select2()
        },
        "aaSorting": columnSortLst,
        "aoColumnDefs": [
        { 
          "bSortable": false,
          "aTargets": cols_DisableSorting // <-- gets last column and turns off sorting
         }
     ],
    //Swathi(19-Mar-14)(Starts):
    //bDestroy: Replace a DataTable which matches the given selector and replace it with one which has the properties of the new initialisation object passed. If no table matches the selector, then the new DataTable will be constructed as per normal.
    "bDestroy": true,
    //bautowidth added becoz in chrome after few searches, the datatable width is distorted.
    //bAutoWidth: Enable or disable automatic column width calculation. This can be disabled as an optimisation (it takes some time to calculate the widths) if the tables widths are passed in using aoColumns.
    "bAutoWidth": true
    //Swathi(19-Mar-14)(Ends)
  });  
  //based on "vm-rowReorder" css class  attaches row reordering added on 21-Feb-2014
  //Get the no of rows of template body . If any row exist then attach table row reorder
  var trs = $('#' + tableId).find('tbody tr');
  if (trs.length > 0) {
      trs.hasClass('vm-rowReorder') ? window[tableId + '_Table'].rowReordering() : "";
  }
}

//Swathi(19-Mar-14)(Starts): added function to destroy the datatable
//fnDestroy - to refresh the datatable everytime on click of search
function DestroyDatatable(tableId) {
    if (window[tableId + '_Table'] != undefined) {
        window[tableId + '_Table'].fnDestroy();
    }
}
//Swathi(19-Mar-14)(Ends)

// Delete Jquery datatable rows before rebinding
function DeleteJqTableRow(tableId) {
    var id = '#' + tableId;
    //get all datatable present in the page
    var settings = $.fn.dataTableSettings;
    //loop through all datatables, if datatable matches with the table id we passed remove all rows
    for (var i = 0, iLen = settings.length; i < iLen; i++) {
        if (settings[i].nTable == $(id)[0]) {
            var oSettings = $(id).dataTable().fnSettings();
            var iTotalRecords = oSettings.fnRecordsTotal();
            for (i = 0; i <= iTotalRecords; i++) {
                $(id).dataTable().fnDeleteRow(0, null, true);
            }
        }
    }
}


//------------------------------------------------------------------------------------------
// Utility function to parse the json object
// Reason to Create ==> "JSON.parse" was not working inside the template hence created this utility
//-------------------------------------------------------------------------------------------
function ParseJSON(obj) {
    var result = JSON.parse(obj);
    return result;
}

//------------------------------------------------------------------------------------------------------------------------------
//function called to enable or disable all elements of a div
//Parameters:Parentdiv in the form of $("#parentdivid")
//Choice:for disabling pass it as "View" 
//----------------------------------------------------------------------------------------------------------------------------
function DisableOrEnableControls(parentdiv, choice) {
    //textboxes
    parentdiv.find("input[type=text]").attr("disabled", choice == "View" ? true : false);
    //dropdown
    parentdiv.find("select").select2(choice == "View" ? "disable" : "enable");
    //textarea
    parentdiv.find("textarea").attr("disabled", choice == "View" ? true : false);
    //for disabling
    if (choice == "View") {
        //hide the reset option when dropdown is disabled
        parentdiv.find(".select2-container").find("abbr.select2-search-choice-close").hide();
        //checkbox
        parentdiv.find("input[type=checkbox]").parent().parent().addClass("deactivate");
        parentdiv.find("input[type=checkbox]").attr("checked", "").attr("disabled", "");
        //submit type button
        parentdiv.find("button[type=submit]").addClass("hide");
        //all form header add buttons
        var formheaderaddbtns = parentdiv.find("div[id^='Form_Header_Add_']");
        _.each(formheaderaddbtns, function (item, i) {
            if (!($(item).hasClass("hide"))) {
                $(item).addClass("hide showbtn");

            }
        });
        //all tables
        var tables = parentdiv.find("table");
        _.each(tables, function (item, i) {
            _.times(2, function (index) {
                //thead
                _.each(item.children[index].children, function (item, i) {
                    var RowsToBeRemoved = _.first((item.children), 2);
                    $(RowsToBeRemoved).addClass('hide');
                });
            });

        });
    }
    //for enabling
    else {
        //show the reset option when dropdown is enabled
        //parentdiv.find(".select2-container").find("abbr.select2-search-choice-close").show();
        //checkbox
        parentdiv.find("input[type=checkbox]").parent().parent().removeClass("deactivate");
        parentdiv.find("input[type=checkbox]").removeAttr("checked", "").removeAttr("disabled", "");
        //submit type button
        parentdiv.find("button[type=submit]").removeClass("hide");
        //all form header add buttons
        var formheaderaddbtns = parentdiv.find("div[id^='Form_Header_Add_']");
        _.each(formheaderaddbtns, function (item, i) {
            if (($(item).hasClass("showbtn"))) {
                $(item).removeClass("hide showbtn");

            }
        });
        //all tables
        var tables = parentdiv.find("table");
        _.each(tables, function (item, i) {
            _.times(2, function (index) {
                _.each(item.children[index].children, function (item, i) {
                    var RowsToBeAdded = _.first((item.children), 2);
                    $(RowsToBeAdded).removeClass('hide');
                });
            });
        });
    }
}


