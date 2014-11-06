$(function () {
    //To implement Progress bar in layout
    //inline progressbar-Comment by asha(step2)
    $.Topic(vm_ui_events.LoadingImage).subscribe(HandleLoadingImage);
    //to implement progress bar in modal
    $.Topic(vm_ui_events.ModalAction).subscribe(HandleModalProgress);
});
//---------------------------------------------------------------------------------------------------------------------------------------
//------ validate the controls in the given form(id padded as variable) diaplys the erroe alert and hignlights the controls which false data
//------------------------------------------------------------------------------------------------------------------------------------------
function FormValidation() {
    //get all the div which has to be validated
    _.each($("div.validate"), function (frmObj) {
        //Extract the FormId        
        var formId = $(frmObj).parent().attr("Id"), formId_rules = {}, formId_msg = {};
        //Loop through each form which has to be validated
        _.each($("#" + formId + " .required" + ", .dateCmp"), function (obj) {
            formId_rules[(obj.id)] = { required: true };           
            var lblName = _.str.isBlank($('#' + formId + ' label[for=' + obj.id + ']').text()) ? $('#' + obj.id).attr("placeholder") : $('#' + formId + ' label[for=' + obj.id + ']').text().trim();
            //$('#' + formId + ' label[for=' + obj.id + ']').text().trim()
            formId_msg[(obj.id)] = { required: lblName + " is required" }
            //-------------RULES (Start)-------------//
            //checks for the class name ex: email. If exist then attaches the corresponding rule
            obj.className.indexOf('email') != -1 ? formId_rules[(obj.id)].email = true : null;
            //Modified on 26-Feb-2014 start
            //For alphanumeric class also it was taking the numeric class while checking index of
            //hence now checking for hasClass
            //$(obj).hasClass('numeric') == true ? formId_rules[(obj.id)].number = true : null;
            //Modified on 26-Feb-2014 end
            //obj.className.indexOf('numeric') != -1 ? formId_rules[(obj.id)].number = true : null;
            obj.className.indexOf('pwd-confirm-cmp') != -1 ? formId_rules[(obj.id)].equalTo = "#" + $("#" + formId + " .required.pwd-cmp")[0].id : null;
            //check if the control has calss starts with dateToCmp then apply the rule
            var result = _.filter(obj.className.split(' '), function (val) {
                if (val.indexOf('dateToCmp') != -1) {
                    return val;
                }
            });
            result.length > 0 ? formId_rules[(obj.id)].greaterThanOrEqualToendDateOrStartDate = "#" + (obj.id) + "," + "#" + result[0].replace('dateToCmp-', '') : null;
            // if the field in not required then dont make the field as required
            //this will happen in case of date comparision
            formId_rules[(obj.id)].required = obj.className.indexOf('required') != -1 ? true : false;
            //$(obj).data('dateToCmp') != null ? formId_rules[(obj.id)].greaterThanOrEqualToHireDateOrStartDate = "'" + (obj.id) + "," + $(obj).data('dateToCmp') + "'" : null;
            //txtEndDate: { greaterThanOrEqualToHireDateOrStartDate: '#txtHireDate,#txtStartDate' }
            //-------------RULES (End)-------------//

            //-------------MESSAGES (Start)-------------//
            obj.className.indexOf('email') != -1 ? formId_msg[(obj.id)].email = lblName + " is invalid" : null;
            //obj.className.indexOf('numeric') != -1 ? formId_msg[(obj.id)].number = $('#' + formId + ' label[for=' + obj.id + ']').text().trim() + " is invalid" : null;
            obj.className.indexOf('pwd-confirm-cmp') != -1 ? formId_msg[(obj.id)].equalTo = "Password Mismatch" : null;
            //-------------MESSAGES (End)-------------//
        });
        //call validation wrapper
        setTimeout(vmValidatorWrapper, 0, formId, formId_rules, formId_msg);
    });
}

    /*////////////////////////////////////////////////////////////////////////////////
        Returns a css class based on the Job posting category
        Note: This is being used to differenciate the color code
        of job listing. We have used bootstrap color theme.
    */////////////////////////////////////////////////////////////////////////////////
    function Category2CssClass(category) {
        var cat2class = { "Novice": "green", "Intermediate": "yellow", "Advanced": "pink" }
        //var cat2class = { "Novice": "danger", "Intermediate": "warning", "Advanced": "primary" }
        return cat2class[category];
    }

    //---------------------------------------------------------------------------------------------------------
    //Modal Progress
    //On Save Action --- "Initiated" -----------------1.hide the body by Id ("rolemodal") 
    //                                                  ex: <div class="modal-body"> <div id="rolemodal"> </div>  
    //                                                2.hide the footer
    //                                                3.Attach the Loading image to the body
    //On Save Success Action --- "CompletedSuccess" --1.Remove the dynamically created div inside the body
    //                                                2.Show the Modal-body 
    //                                                3.Show the Modal-footer 
    //On Save Failure Action --- "CompletedFailure" --1.Remove the dynamically created div inside the body
    //                                                2.Show the Modal-body 
    //                                                3.Show the Modal-footer 
    //                                                4.Display the error message in the div
    //---------------------------------------------------------------------------------------------------------    
    function HandleModalProgress(args) {
        try {
            switch (args.state) {
                case "Initiated":
                    //remove the loader image  
                    $('.modal-body').find(".customLoaderMsg,.loader").remove();
                    $('.' + args.body).css("display", "none"); //hide the body
                    $('.slimScrollDiv').hide();
                    $('.' + args.footer).css("display", "none"); // hide the footer
                    var pm = (args.CustomMsg != undefined) ? '<div class="customLoaderMsg  well-transparent spinner-text-font"><i class="fa fa-spinner fa fa-spin fa fa-lg"></i>&nbsp;' + args.CustomMsg + '</div>' : '<div class="loader" style="padding-left:50%"><div class="fa fa-spinner fa fa-spin fa fa-lg"></div></div>';
                    pm += '<div class="loader" ></div>';
                    // pm += '<div class="loader"><i class="icon-spinner icon-spin icon-large"></i></div>';
                    $('.modal-body').append(pm); //Attach the Loading image to the body
                    break;
                case "CompletedSuccess":
                    $('.modal-body').find(".customLoaderMsg,.loader,.fa fa-spinner").remove(); //Remove the dynamically created div inside the body
                    $('.' + args.body).css("display", "block"); //Show the Modal-body 
                    $('.' + args.footer).css("display", "block"); //Show the Modal-footer 
                    $('.slimScrollDiv').show();
                    break;
                case "CompletedFailure":
                    $('.' + args.body).css("display", "block"); //Show the Modal-body 
                    $('.' + args.footer).css("display", "block"); //Show the Modal-footer 
                    $('.modal-body').find(".customLoaderMsg,.loader,.fa fa-spinner").remove(); ////Remove the dynamically created div inside the body
                    $('.vm-noty-placeholder').noty({ "text": args.message, "layout": "inline", "type": "error" }); //Display the error message in the div
                    $('.slimScrollDiv').show();
                    break;
            }
        } catch (e) { }
    };
    //---------------------------------------------------------------------------------------------------------
    //Loading Image
    //---------------------------------------------------------------------------------------------------------    
    //inline progressbar-Comment by asha(step1)
    function HandleLoadingImage(args) {
        try {
            if (args.progress == 'show') {
                $('#' + args.container).html("");
                $('#' + args.container).append('<div class="customLoaderMsg  well-transparent" style="font-size:17px;padding-left:50%"><i class="fa fa-spinner fa fa-spin fa fa-lg"></i>&nbsp;</div>');
            }
            else {
                $('#' + args.container).find(".customLoaderMsg").remove();
                //$('#' + args.id).remove();
            }
        } catch (e) { }
    };