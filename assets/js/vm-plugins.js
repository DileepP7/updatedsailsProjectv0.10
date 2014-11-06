/*
---------------------------------------------------------------------------------
HighChart - Gauge Chart
---------------------------------------------------------------------------------
Example Usage:

Line #1
-------
myGaugeOptions = {
"Title": "Hours"
, "gaugeChartData": myDs
, "gaugeChartOptions":
{
"Type": "gauge"
, "TitleText": ""
, "StartAngle": "-140"
, "EndAngle": "140"
, "MinValue": "0"
, "MaxValue": "300"
, "TickPixelInterval": "20"
, "TickLength": "5"
, "TooltipValueSuffix": " Hrs"
, "yAxisLabelStep": "3"
, "PlotBand": myPlotBand
},
"myChart": null
}

Line #2
-------
$("#phChart").gauge(myGaugeOptions);

Where
-------
1) #phChart -> Any dom element. Chart will be attached to this element in the Dom tree
2) config -> Javascript object
    
Note: Call this in the page load complete event.
Complete example with Jquery on Dom ready (page load complete)
$("#phChart").gauge(myGaugeOptions);

*/
(function ($) {
    $.fn.gauge = function (config) {

        
        // Creating an instance     
        var _renderToContainer = $(this).selector.replace('#', '');
        config.myChart = new Highcharts.Chart({
            chart: {
                renderTo: _renderToContainer,
                type: config.gaugeChartOptions.Type,
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '<b>{point.Y}' + ' ' + config.gaugeChartOptions.TooltipValueSuffix + '</b>'
            },
            pane: {
                startAngle: parseInt(config.gaugeChartOptions.StartAngle),
                endAngle: parseInt(config.gaugeChartOptions.EndAngle),
                background: [{
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                    },
                    borderWidth: 0,
                    outerRadius: '115%'
                }, {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                    },
                    borderWidth: 1,
                    outerRadius: '107%'
                }, {
                    // default background
                }, {
                    backgroundColor: '#DDD',
                    borderWidth: 0,
                    outerRadius: '105%',
                    innerRadius: '103%'
                }]
            },

            // the value axis
            yAxis: {
                min: parseInt(config.gaugeChartOptions.MinValue),
                max: parseInt(config.gaugeChartOptions.MaxValue),
                minorTickInterval: 'auto',
                minorTickWidth: 1,
                minorTickLength: parseInt(config.gaugeChartOptions.TickLength),
                minorTickPosition: 'inside',
                minorTickColor: '#000000',
                tickPixelInterval: parseInt(config.gaugeChartOptions.TickPixelInterval),
                tickWidth: 1,
                tickPosition: 'inside',
                tickLength: 13,
                tickColor: '#000000',
                lineColor: '#919293',
                lineWidth: 2,
                labels: {
                    step: parseInt(config.gaugeChartOptions.yAxisLabelStep),
                    rotation: 'outside'
                },
                title: {
                    text: ''
                },
                plotBands: config.gaugeChartOptions.PlotBand
            },
            // the series 
            series: [{
                name: '',
                data: config.gaugeChartData,
                tooltip: { valueSuffix: config.gaugeChartOptions.TooltipValueSuffix },
                dataLabels: {
                    borderWidth: 0,
                    color: '#EA2026',
                    y: 28,
                    align: 'center',
                    useHTML: true, // If false, HTML tags will not work as expected
                    formatter: function () {
                        return '<span>' + this.y + '</span>';
                    }
                }
            }]

        });

        //appending to the calling control
        $(this).append(config.myChart);

        //Plot band options        
        $.each(config.gaugeChartOptions.PlotBand, function (i, o) {
            console.log(o.From)
            config.myChart.yAxis[0].addPlotBand({ "from": parseInt(o.From), "to": parseInt(o.To), "color": o.Color });
        });   //end for each        
    }
})(jQuery);


/*
---------------------------------------------------------------------------------
HighChart - Pie Chart
---------------------------------------------------------------------------------
Example Usage:

#1 Declare
-------
myPieChartData = [
    { "SliceText": "Requirement", "Value": "35.0" }, { "SliceText": "Design", "Value": "36.8" },
    { "SliceText": "Documentation", "Value": "8.2" },
    { "SliceText": "Coding", "Value": "9.8" }
];
myPieOptions = {
        "Title": "Activity"
        , "pieChartData": myPieChartData
        , "pieChartOptions":
				   {
				       "Type": "pie"
				       , "TitleText": ""
				   },
        "myChart": null
    }

#2 Call plugin
-------
$("#phChart").gauge(myPieOptions);

Where
-------
1) #phChart -> Any dom element. Chart will be attached to this element in the Dom tree
2) config -> Javascript object
    
Note: Call this in the page load complete event.
Complete example with Jquery on Dom ready (page load complete)
$("#phChart").gauge(myPieOptions);

*/
(function ($) {
    $.fn.pie = function (config) {        
            var tableHTML;
            tableHTML = '<div class="row-fluid">';
            tableHTML += '<table class="table table-bordered table-condensed">';
            tableHTML += '<tr class="'+config.alert +'">';
            tableHTML += '<td>';
            tableHTML += '<i class="red '+config.icon+'"></i>&nbsp;' + config.Title;
            tableHTML += '</td>';
            tableHTML += '</tr>';
            tableHTML += '<tr valign="top">';
            tableHTML += '<td>';
            tableHTML += '<div id="' + config.ContainerId + '" style="height:200px;width:132px">';
            tableHTML += '</div>';
            tableHTML += '</td>';
            tableHTML += '</tr>';
            tableHTML += '</table>';
            tableHTML += '</div>';
            $(this).html(tableHTML);
            //return;
        // Creating an instance     
        var _renderPieToContainer = config.ContainerId;
        
        
        // Radialize the colors -> reference URL: http://www.highcharts.com/demo/pie-gradient
		Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
		    return {
		        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		        stops: [
		            [0, color],
		            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
		        ]
		    };
		});
        
        config.myChart = new Highcharts.Chart({
		    chart: {
		        renderTo: _renderPieToContainer
		        ,plotBackgroundColor: null
		        ,plotBorderWidth: null                
		        ,plotShadow: false
                ,height: 200
                ,marginRight: 0
                ,marginBottom: 75                
		    },
		    title: {
		        text: ''
		    },
		    tooltip: {
                formatter: function ()
                {                    
                    if(config.pieChartOptions.ShowPercentage == "yes"){                        
                    	return '<b>' + this.point.name + ' : ' + this.point.percentage + '%</b>';
                    }
                    else{                        
                        return '<b>' + this.point.name + ' : ' + this.point.y + '</b>';
                    }                    
                }

		    },
		    plotOptions: {
		        pie: {
		            allowPointSelect: true,
		            cursor: 'pointer',
		            dataLabels: {
		                enabled: true
		            },
		            showInLegend: true                    
		        }
		    },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'bottom',
                x: 10,
                y: 15,
                floating: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },
		    series: [{
		        type: config.pieChartOptions.Type,
		        name: config.Title,
		        data: [],
		        // Format and align datalabel on top of the slice -> reference URL: http://www.highcharts.com/demo/pie-donut
		        dataLabels: {
		            //Format
		            formatter: function () {
                        if(config.pieChartOptions.ShowPercentage == "yes"){                        
		                    return this.y > 0 ? this.point.y + "%" : null;
                        }
                        else{
                            return this.y > 0 ? this.point.y : null;
                        }
		            },
		            color: 'white',
                    font:'1px arial,sans-serif',

		            //Specify the distance Align the datalabel(e.g 3%) from the circumference
		            distance: -15                    
		        }
		    }]
		});

        //appending to the calling control
        //$(this).append('<b>test</b>');
        
        
        //Plot series data
        var _seriesData = [];        
        $.each(config.pieChartData, function (index,object) {
                _seriesData.push([object.SliceText, parseInt(object.Value)]);                
         });   //end for each    

        //Set the data to the series
        config.myChart.series[0].setData(_seriesData, true);
   }
})(jQuery);



/*
---------------------------------------------------------------------------------
Status Box
---------------------------------------------------------------------------------
/*Example Usage:
var dataSource = [ {Icon:"Icon:-user" ,Count :1433, Title:"Personal Hygiene"},
{Icon:"Icon:-arrow-right" ,Count :16 , Title:"Goods Receiving"},
{Icon:"Icon:-repeat" ,Count :29 , Title:"Aircraft Loading"}]
$("#phStatBox").statBox(dataSource);
Where
1) #phStatBox -> Any dom element. statbox will be attached to this element in the Dom tree
2) config -> Javascript object  [ {Icon:"Icon:-user" ,Count :1433, Title:"Personal Hygiene"},
{Icon:"Icon:-arrow-right" ,Count :16 , Title:"Goods Receiving"},
{Icon:"Icon:-repeat" ,Count :29 , Title:"Aircraft Loading"}
]    
Note: Call this in the page load complete event.
Complete example with Jquery on Dom ready (page load complete)
$(function() {$("#phStatBox").statBox(dataSource);});
*/
(function ($) {
    $.fn.statBox = function (config) {
        this.each(function () {
            var spnStatBox = '<ul class="site-stats">';
            jQuery.each(config, function (key, value) {
                spnStatBox += '<li style="padding:1px;"><i class="' + value.Icon + '"></i>&nbsp;<strong style="padding:0px">' + value.Count + '</strong> <span class="text-info">' + value.Title + '</span></li>';
            });
            $(this).html(spnStatBox);
        });
    }
})(jQuery);

/*
---------------------------------------------------------------------------------
Container
---------------------------------------------------------------------------------
/*Example Usage:
#1.  Initialise Container
     ex:  <div id="divContainer" class="span3">            
     </div>
#2. Datasource
     ex:-var datasource={
                         "Title":"My Draft",
                         "List":[ {"icon":"icon-group",    "number":"REQ001","date":"03/08/2007","href":"#"},
                                  { "icon": "icon-pencil", "number": "REQ002", "date": "02/08/2007",  "href": "#" }],
                          "Alert":"info",
                          			 
                        }
#3 Call plugin
     ex:$("#divContainer").container(datasource);
-------
Where
1) #divContainer -> Any dom element. statbox will be attached to this element in the Dom tree
2) config -> Javascript object  
Note: Call this in the page load complete event.
Complete example with Jquery on Dom ready (page load complete)
$(function() {$("#divContainer").container(datasource));
*/
(function($) {
    $.fn.container = function (config) {
        this.each(function () {
            var html = '<table class="table table-bordered table-condensed"><tbody ><tr class="'+ config.Alert +'">';
                html+='<td>'+config.Title + '&nbsp;&nbsp;<span class="badge badge-inverse">'+config.List.length+'</span></td></tr><tr><td><div>';
                jQuery.each(config.List, function (key, item) {    
                    html +='<div class="row-fluid" id="'+ config.Id +'"><div class="span12"><i class="' + item.icon + '"></i>&nbsp;<a class="vm-dummy-ReqContainer" href="'+item.href+'"><span>'+item.number+'</span></a>';
                    html+= '&nbsp;&nbsp;' + item.date +'</div>';
            });
            //Modified by Swetha on 11-Jul-2013 to make it IE8 compatible
            //setTimeout(AttachSlimScroll, 0, config.Id, '200px');
            setTimeout( function(){AttachSlimScroll(config.Id,'200px')},10);
            html +='</div></td></tr></tbody></table>';
            $(this).html(html);
            
        });
       
    }
})(jQuery);



/*Form Group Title ()*/
(function($) {
$.fn.grouptitle = function(config) {
        var html = '<table class="vm-frm-title ' + config.classname + ' id=""><tbody><tr><td>' + config.title + '</td></tr></tbody></table>';
        $(this).append(html);
    };
})(jQuery);



/*
/*Section Title with ability to specify link in the right side extreme
Example:
        var m = $("#titleReq2");
        m.sectiontitle({ classname: "vm-frm-title-blue", title: m.data("title"), link: m.data("link") });
Prerequisite:
1) Should have a dom element like below
<div id="titleReq2" class="span12 vm-dummy-title" data-title="<b>Sam</b>" data-link-title="" data-link="" data-link-click="" data-link-id=""></div>
*/
(function($) {
$.fn.sectiontitle = function(config) {
        var html = '<table class="vm-frm-title {0} id=""><tbody><tr><td class="">{1}</td><td class="pull-right">{2}</td></tr></tbody></table>';        
        html = jQuery.validator.format(html,config.classname,config.title,config.link);       
        $(this).append(html);
    };
})(jQuery);



/*
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
vmGage
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
/*Example Usage:
#1.  Initialise div for gage
ex:      <div id="gage" ></div>          
#2. Datasource
ex:- var gageParams = { "width": "150px", "height": "120px", 'id': "Request", 
                       "info": "Void Requests", "alert": "error", "value": 56,
                       "min": 0, "max": 100, "title": "Requests", "levelColors": ["brown"],
                       "containerTable": "false" //if containerTable is set to true then the gage will be enclosed inside the table 
                     }
#3 Call plugin
ex:$("#gage").vmGage(gageDB);
-------
Where
1) #divContainer -> Any dom element. gage will be attached to this element in the Dom tree
2) config -> Javascript object  
Note: Call this in the page load complete event.
Complete example with Jquery on Dom ready (page load complete)
$(function() {$("#gage").vmGage(gageDB));
ref:http://justgage.com/
*/
(function ($) {
$.fn.vmGage = function (config) {    
this.each(function () {
var html="";
var gageDiv='<div id="divGage_'+config.id+'" style="width:'+ config.width +'; height:'+ config.height +'"></div>';
//if containerTable is set to true then the gage will be enclosed inside the table 
if(config.containerTable==true)
{  html='<table class="table table-bordered table-condensed"><tbody><tr class="' + config.alert + '"><td>' + config.info + '</td></tr><tr><td>';
    html+=(gageDiv+'</td></tr></tbody></table>');   
}
//if containerTable is set to false then only the gage will be attached 
else{html=gageDiv}
$(this).html(html);
});
var g = new JustGage({
                id: "divGage_"+config.id,           //container element id
                value: config.value,                //value gauge is showing
                min: config.min,                    //minimum value
                max: config.max,                    //maximum value
                title: config.title,                //gauge title text
                //gaugeColor:'Yellow',              //background color of gauge element
                //titleFontColor:'red'              //color title text
                //gaugeColor: 'Blue'                //background color of gauge element
                //valueFontColor:'red'              //color of value text
                levelColors: config.levelColors     //colors of indicator, from lower to upper, in hex format(array of strings)
            });
   }
})(jQuery);

/*-----------------------------------------------
// $("#some-div").quickLinks({"ds" : ds, "style" : {"type" : "simple", "caption" : "Links", "classname" : "red"} })
//-----------------------------------------------*/
(function($){
    $.fn.quickLinks = function (config) {
       if(config.style.type=='simple')
            {
            var html = '<table class="table table-bordered table-condensed"><tbody><tr><td><div>';
              jQuery.each(config.ds.Forms, function (key, item) {
                html += '<div class="row-fluid"><div class="span12">&nbsp;<a href="' + item.link + '"><span>' + item.acronym + '</span></a>';
            });
            html += '</div></td></tr></tbody></table>';
            $(this).html(html);
        }
        else
        {
        this.each(function () {
            var html = '<table class="table table-bordered table-condensed"><tbody><tr class="'+ config.style.classname +'">';
                html+='<td style="text-align:center;">'+config.style.caption + '&nbsp;&nbsp;</td></tr><tr><td><div>';
                 jQuery.each(config.ds.Forms, function (key, item) {
                html += '<div class="row-fluid"><div class="span12">&nbsp;<a href="' + item.link + '"><span>' + item.acronym + '</span></a>';
            });
            html += '</div></td></tr></tbody></table>';
            $(this).html(html);
        });

    }  
        }
    
})(jQuery);




/*
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
eventList
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
/*Example Usage:
#1.  Initialise div for eventList
ex:      <div id="event" ></div>          
#2. Datasource
ex:-  var event_details = {
        "event": [{ "Month": "FEB", "Day": "14", "Name": "Aero India(2013)", "Description": "Aircraft Exhibition show of an Indian Air Force", "Place": "Yelahanka Bengaluru" }
        , { "Month": "FEB", "Day": "14", "Name": "Aero India(2013)", "Description": "Aircraft Exhibition show of an Indian Air Force", "Place": "Yelahanka Bengaluru" }
          ]
    }
#3 Call plugin
ex:$("#event").eventList({ "ds": event_details, "color": "maroon" });
-------
Where
1) #divContainer -> Any dom element. eventList will be attached to this element in the Dom tree
2) config -> Javascript object  
Note: Call this in the page load complete event.
Complete example with Jquery on Dom ready (page load complete)
$(function() {$("#event").eventList({ "ds": event_details, "color": "maroon" });
*/

(function($){
    $.fn.eventList = function(config) {
    var html ='<table class="table  table-condensed"><div id="term-body">';
        jQuery.each(config.ds.event, function (key, item) {
                html += '<tr><td><div class="row-fluid"><div class="span2"><div style="font-size: .65em;padding: 5px 5px;border-left: 1px solid;border-bottom: 1px solid;border-right: 1px solid;color: white;text-align:center;font-weight: bold;line-height: 1;background: '+config.color+';border-color :'+config.color+';">'+ item.Month+'</div>';
                html += '<div style="background-color: white;border: 1px solid;font-size: 1em;color: #333;background: #fff;padding: 5px 5px;color: black;padding-top: 2px;text-align:center;font-weight: bold;line-height: 1;border-color :'+config.color+';">'+item.Day+'</div></div>';
                html +='<div class="span10"><span style="line-height: 1em;"><strong>'+ item.Name + '</strong></span><br /><span class="vm-text-stat" >'+ item.Description +'</span><br />';
                html +='<span class="vm-text-stat" style="line-height: 0.72em;">'+ item.Place + '</span></div></div></td></tr>';
           })   ;
    html += '</div></table>';
    $(this).html(html);  
    }  
  })(jQuery);
  /*--------------------------------------------------------------------------------------------------------------------------
    Passing a dataset as below will attach a list view decorated with calendar icon.
    Example:
    var nearing_newhires = { "Title": "Nearing New Hires", "BodyId": "nh-body", "CaleldarColor": "#3a87ad", "BadgeClass": "badge-important", "HeaderBackgroundClass": "error"
                            , "Details":
                            [
                                { "Month": "Jan", "Day": "25", "Name": "Gonsalves, Michelle", "DelayByDay": "2", "href": "#" },
                                { "Month": "Jan", "Day": "28", "Name": "Graves, Misty L", "DelayByDay": "5", "href": "#" },
			                    { "Month": "Jan", "Day": "29", "Name": "Ibarra, Miguel", "DelayByDay": "6", "href": "#" },
			                    { "Month": "Feb", "Day": "01", "Name": "Long, Mike", "DelayByDay": "8", "href": "#" },
			                    { "Month": "Feb", "Day": "01", "Name": "Castillo, Adela", "DelayByDay": "8", "href": "#" }
                            ]
    };       
    $("#NearingNewHires").calendarEventListView({ "ds": nearing_newhires, "Template": '/Contents/tpl/EmployeeNearingTermination.htm' });
    Swathi: removed hardcoded template and passing the template in config
  //--------------------------------------------------------------------------------------------------------------------------*/
  (function ($) {
    $.fn.calendarEventListView = function (config) {

       var cid = "#" + $(this)[0].id;
        $.get(_AbsolutePath + config.Template, function (data, textStatus, XMLHttpRequest) 
        {   
            $.template("calendarEventListView", data);
            $.tmpl("calendarEventListView", config.ds).appendTo(cid);
            $(".dummy-tooltip").tooltip();
            $(".dummy-tooltip-bottom").tooltip({ 'placement': 'bottom' });
            $(".dummy-tooltip-top").tooltip({ 'placement': 'top' });
            //Attach the scroll bar only if the count exceeds 3
            if(config.ds.Count>3){
                //Modified by Swetha on 11-Jul-2013 to make it IE8 compatible
                setTimeout( function(){AttachSlimScroll(config.ds.BodyId,'200px')},10);
            }
        });
    }

})(jQuery);
//--------------------------------------------------------------------------------------------------------------------------*/
//                                                      SURVEY PLUGIN (Concept picked up from http://www.surveygizmo.com/
//Example usage: $("#sodSurvey").survey({ "store": surveyDs, "elementid": "sodSurvey" });
// #sodSurvey - > Dom element (placeholder) where the plugin needs to be pinned
// surveyDs     -> JSON datasource
// elementid    -> Dom element (placeholder) id where the plugin needs to be pinned
// sample datasource: 
        /*[{ "code": "0001", "dependsOn": "", "acceptedResults": "Yes,No", "end": "No", "text": "Did you modify any thing in the source files?", "defaultDisplay": "" }
        , { "code": "0002", "dependsOn": "0001", "acceptedResults": "Yes,No", "end": "No", "text": "Did you make sure to check-in the modified file?", "defaultDisplay": "none" }
        , { "code": "0003", "dependsOn": "", "acceptedResults": "Yes", "end": "No", "text": "After the script execution, have you checked-in into the source control system using red gate?", "defaultDisplay": "" }
        , { "code": "0004", "dependsOn": "", "acceptedResults": "Yes", "end": "No", "text": "parent0004?", "defaultDisplay": "" }
        , { "code": "0005", "dependsOn": "0004", "acceptedResults": "Yes", "end": "No", "text": "01-child of 0004?", "defaultDisplay": "none" }
        , { "code": "0006", "dependsOn": "0004", "acceptedResults": "Yes,No", "end": "Yes", "text": "01-child of 0004?", "defaultDisplay": "none"}]*/
//--------------------------------------------------------------------------------------------------------------------------*/
(function ($) {
    $.fn.survey = function (config) {          
        var surveyHtmlTemplate = '<ul class="nav nav-list vm-survey">'
    + '<li  data-depends-on="${dependsOn}" data-code="${code}" data-accepted-results="${acceptedResults}" data-end="${end}" style="display: ${defaultDisplay};padding-top:2px;padding-bottom:2px;">'
    + '<div class="btn-group" data-toggle="buttons-radio">'
    + '<button type="button" class="btn">'
    + '<i class="icon-check-empty" style="color: green;"></i>&nbsp;Yes'
    + '</button>'
    + '<button type="button" class="btn">'
    + '<i class="icon-check-empty" style="color: Red;"></i>&nbsp;No'
    + '</button>'
    + '</div>'
    + '&nbsp;${text}</li>'
    + '</ul>'
    //Bind
    $.tmpl(surveyHtmlTemplate, config.store).appendTo("#" + config.elementid);

    $(".vm-survey").on("click", "button", function () {
        var curLi = $(this).closest("li");
        var visibleQuestions = $('.vm-survey li:visible');
        var allChildsOfCurQuestion = $("li[data-depends-on='" + curLi.data("code") + "']");
        var acceptedResults = curLi.data("accepted-results")
        var curQuestionIsLast = curLi.data("end")

        setTimeout(function () {
            $.each($(curLi).find('.btn'), function (i, o) {
                //alert($(o).attr('class'))
                if ($(o).attr('class').indexOf('active') > 0) {
                    $($(o).find('i')).removeClass('icon-check-empty').addClass('icon-check')
                    //$($(o).find('i')).addClass('icon-check-empty icon-check');
                } else {
                    $($(o).find('i')).removeClass('icon-check').addClass('icon-check-empty')
                }
                //$($(o).find('i')).toggleClass('icon-check-empty')
            });
        }, 100);

    //Show/hide childs
    if ($(this).text().trim() == 'Yes') {allChildsOfCurQuestion.show();} else {allChildsOfCurQuestion.hide();}

    /*Do not delete (start)*/
    //console.log("Code = [" + curLi.data("code") + "]");
    //console.log("acceptedResults = [" + acceptedResults + "]");
    //console.log("curQuestionIsLast = [" + curQuestionIsLast + "]");
    //console.log("Visible Questions count = [" + visibleQuestions.length + "]");
    //console.log("Visible Questions Answered = [" + $('.vm-survey li:visible').length + "]");
    /*Do not delete (end)*/

        if (curQuestionIsLast.trim() == 'Yes') {
            setTimeout(function () {
                $.each($('.vm-survey li:visible'), function (i, o) {
                    var selText = $(this).find('.btn-group button.btn.active').text();
                    if (selText.trim() == '') { alert("Debug alert !!!! All questions should be answered"); return false; }
                    console.log("Selected Text = " + selText);
                });
            }, 10);//timeout end
        }
        });
    };

    //Public function
    this.validate = function () {
        console.log("inside");
        alert('validate');
    };
    return this;
})(jQuery);