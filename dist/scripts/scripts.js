"use strict";angular.module("axisJSApp",["ngAnimate","ngResource","ngSanitize","ui","ui.router","ui.bootstrap","minicolors","cn.offCanvas"]).config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){$urlRouterProvider.otherwise("/"),$stateProvider.state("index",{url:"/",templateUrl:"partials/main.html",controller:"MainCtrl",resolve:{appConfig:["configProvider","$rootScope",function(configProvider,$rootScope){return $rootScope.version="1.0.2",configProvider}]}})}]),angular.module("axisJSApp").controller("HeadCtrl",["configProvider","$scope",function(configProvider,$scope){configProvider.then(function(appConfig){$scope.conf=appConfig,$scope.stylesheet="undefined"!=typeof appConfig.stylesheet?appConfig.stylesheet:"",$scope.fonts="undefined"!=typeof appConfig.fonts?appConfig.fonts:[]})}]),angular.module("axisJSApp").controller("MainCtrl",["chartProvider","inputService","configChooser","appConfig","$scope",function(chartProvider,inputService,configChooser,appConfig,$scope){$scope.appConfig=appConfig,$scope.appConfig.toggleChooser=configChooser.toggle,$scope.inputs={},$scope.columns=[],$scope.chartData={},$scope.config=chartProvider(appConfig).config,$scope.chartTypes=chartProvider(appConfig).chartTypes,$scope.axesConfig=chartProvider(appConfig).axesConfig,$scope.config.background=appConfig.background?appConfig.background:!1,$scope.config.backgroundColor=appConfig.backgroundColor?appConfig.backgroundColor:"white";var input=inputService(appConfig);if($scope.updateData=function(){return input.input($scope)},$scope.validateData=function(value){return input.validate(value)},$scope.setGlobalType=function(type){for(var key in $scope.config.data.types)$scope.config.data.types.hasOwnProperty(key)&&($scope.config.data.types[key]="series"!==type?type:"line")},$scope.setGroups=function(){$scope.config.data.groups=[];for(var group in $scope.config.groups)$scope.config.groups.hasOwnProperty(group)&&("undefined"==typeof $scope.config.data.groups[$scope.config.groups[group]]&&($scope.config.data.groups[$scope.config.groups[group]]=[]),$scope.config.data.groups[$scope.config.groups[group]].push(group))},window.getConfig=function(){console.dir($scope),window.chartConfig=$scope.config},"undefined"!=typeof parent.tinymce&&"undefined"!=typeof parent.tinymce.activeEditor.windowManager.getParams().axisJS){var fromWP=angular.fromJson(window.atob(parent.tinymce.activeEditor.windowManager.getParams().axisJS));$scope.config=fromWP,$scope.inputs.csvData=input.convert($scope.config.data.columns),$scope.config.axis.x.tick.format=function(b){return"series"===$scope.config.chartGlobalType&&"category"!==$scope.config.axis.x.type?$scope.config.axis.x.prefix+b.toFixed($scope.config.axis.x.accuracy).toString()+$scope.config.axis.x.suffix:b},$scope.config.axis.y.tick.format=function(b){return"series"===$scope.config.chartGlobalType&&"category"!==$scope.config.axis.y.type?$scope.config.axis.y.prefix+b.toFixed($scope.config.axis.y.accuracy).toString()+$scope.config.axis.y.suffix:b},$scope.config.axis.y2.tick.format=function(b){return"series"===$scope.config.chartGlobalType&&"category"!==$scope.config.axis.y2.type?$scope.config.axis.y2.prefix+b.toFixed($scope.config.axis.y2.accuracy).toString()+$scope.config.axis.y2.suffix:b},$scope.config.donut.label.format=function(b,c){return(100*c).toFixed($scope.config.chartAccuracy)+"%"},$scope.config.pie.label.format=function(b,c){return(100*c).toFixed($scope.config.chartAccuracy)+"%"},$scope.config.gauge.label.format=function(b,c){return(100*c).toFixed($scope.config.chartAccuracy)+"%"},$scope.updateData()}else $scope.inputs.csvData=input.defaultData.csvData,$scope.updateData()}]),angular.module("axisJSApp").directive("buildChart",["chartProvider","$timeout",function(chartProvider,$timeout){return{restrict:"A",link:function(scope,element){function doTitles(){var titlesGroup,chartTitle,chartCredit,chartSource,svg=d3.select("svg"),svgWidth=svg.attr("width");null!==svg.select("text.titles")[0][0]?(titlesGroup=svg.select("text.titles"),chartTitle=titlesGroup.select("tspan.chartTitle"),chartCredit=titlesGroup.select("tspan.chartCredit"),chartSource=titlesGroup.select("tspan.chartSource")):(titlesGroup=svg.insert("text").attr("class","titles").attr("text-anchor",scope.appConfig.titles.align),chartTitle=titlesGroup.insert("tspan").attr("class","chartTitle"),chartCredit=titlesGroup.insert("tspan").attr("class","chartCredit"),chartSource=titlesGroup.insert("tspan").attr("class","chartSource")),chartTitle.text(scope.config.chartTitle).attr("font-size",scope.appConfig.titles["title size"]),chartCredit.text(scope.config.chartCredit).attr("font-size",scope.appConfig.titles["credit size"]);var sourceText=(scope.appConfig.titles["append source"]&&scope.config.chartSource?"Source: ":"")+scope.config.chartSource;chartSource.text(sourceText).attr({"font-size":scope.appConfig.titles["source size"],"font-style":scope.appConfig.titles["source style"]});var chartTitleTranslateY="undefined"!=typeof scope.appConfig.titles["title translateY"]?scope.appConfig.titles["title translateY"]:0;chartTitle.attr({dy:chartTitleTranslateY,x:0});var chartCreditTranslateY="undefined"!=typeof scope.appConfig.titles["credit translateY"]?scope.appConfig.titles["credit translateY"]:32;chartCredit.attr({dy:chartCreditTranslateY,x:0});var chartSourceTranslateY="undefined"!=typeof scope.appConfig.titles["source translateY"]?scope.appConfig.titles["source translateY"]:30;for(chartSource.attr({dy:chartSourceTranslateY,x:0});chartTitle.node().getComputedTextLength()>svgWidth||chartCredit.node().getComputedTextLength()>svgWidth||chartSource.node().getComputedTextLength()>svgWidth;){var newTitleSize=parseInt(chartTitle.attr("font-size").replace("px",""))-1,newCreditSize=parseInt(chartCredit.attr("font-size").replace("px",""))-1,newSourceSize=parseInt(chartSource.attr("font-size").replace("px",""))-1;chartTitle.attr("font-size",newTitleSize+"px"),chartCredit.attr("font-size",newCreditSize+"px"),chartSource.attr("font-size",newSourceSize+"px"),chartCredit.attr({dy:newTitleSize,x:0}),chartSource.attr({dy:newCreditSize,x:0})}if(scope.appConfig.titles["title background"]&&chartTitle.text().length>0){chartTitle.attr("fill","white");var bbox=chartTitle.node().getBBox(),padding=scope.appConfig.titles["background padding"],rect=d3.select(chartTitle.node().parentNode.parentNode).insert("rect","text.titles");rect.attr("x",0).attr("y",0).attr("class","title-background").attr("width",bbox.width+2*padding).attr("height",18+2*padding).style("fill",scope.config.data.colors[scope.config.data.columns[0][0]]),chartTitle.attr({x:0+padding,dy:chartTitleTranslateY+padding})}var translateGroupX="undefined"!=typeof scope.appConfig.titles.translateX?scope.appConfig.titles.translateX:svgWidth/2,translateGroupY="undefined"!=typeof scope.appConfig.titles.translateY?scope.appConfig.titles.translateY:350;titlesGroup.attr("width",svgWidth).attr("transform","translate("+translateGroupX+","+translateGroupY+")"),svg.attr("height",svg.node().getBBox().height+"px")}function redraw(){chart=chartProvider(scope.appConfig).generate(element[0].id,scope.config),$timeout(function(){doTitles()})}element.children("svg").attr("transform","scale(2)");var chart;redraw(),scope.$watch("config.data.columns",function(newValues){redraw(),scope.config.data.colors={},"object"==typeof scope.config.data.types?angular.forEach(scope.config.data.types,function(v,key){for(var i=0;i<newValues.length;i++)if(newValues[i][0]===key)return;delete scope.config.data.types[key]}):scope.config.data.types={},scope.config.data.axes={},angular.forEach(scope.columns,function(column){scope.config.data.axes[column]||(scope.config.data.axes[column]=scope.appConfig.defaults["y axis"]?scope.appConfig.defaults["y axis"]:"y"),scope.config.data.colors[column]=chart.data.colors()[column],"series"===scope.config.chartGlobalType?scope.config.data.types[column]||(scope.config.data.types[column]="line"):scope.config.data.types[column]=scope.config.chartGlobalType})},!0),scope.$watch("config.data.colors",function(){chart.data.colors(scope.config.data.colors)},!0),scope.$watch("config.data.types",function(){redraw()},!0),scope.$watch("config.axis",function(newValues){for(var key in newValues)if(newValues.hasOwnProperty(key)){if(newValues[key].hasOwnProperty("label")){var axis={};axis[key]=newValues[key].label,chart.axis.labels(axis)}(newValues[key].hasOwnProperty("show")||newValues[key].hasOwnProperty("max")||newValues[key].hasOwnProperty("min"))&&redraw(),(newValues[key].hasOwnProperty("prefix")||newValues[key].hasOwnProperty("suffix")||newValues[key].hasOwnProperty("accuracy"))&&(scope.config.axis[key].prefix="undefined"==typeof newValues[key].prefix?"":newValues[key].prefix,scope.config.axis[key].suffix="undefined"==typeof newValues[key].suffix?"":newValues[key].suffix,scope.config.axis[key].accuracy="undefined"==typeof newValues[key].accuracy?0:newValues[key].accuracy)}},!0),scope.$watchGroup(["config.data.x","config.data.y","config.data.y2"],function(newValues){newValues.forEach(function(v,i){var axis=0===i?"x":1===i?"y":2===i?"y2":"";scope.config.data.columns.forEach(function(column){for(var i=1;i<column.length;i++){if(isNaN(column[i])&&column[0]===v){scope.config.axis[axis].type="category",scope.config.axis[axis].tick=void 0;break}column[0]===v&&(scope.config.data.axes[v]=axis)}})}),redraw()}),scope.$watchGroup(["config.chartTitle","config.chartCredit","config.chartSource","config.chartAccuracy","config.legend.position","config.legend.show"],function(){redraw()}),scope.$watch("config.data.groups",function(){redraw()},!0),scope.$watch("config.background",function(val){val===!0?d3.select("svg").insert("rect",":first-child").attr("class","chart-bg").attr("width","100%").attr("height","100%").attr("fill",scope.config.backgroundColor):d3.select(".chart-bg").remove()})}}}]),angular.module("axisJSApp").directive("exportChart",["outputService",function(outputService){return{restrict:"A",scope:"@",link:function(scope,element,attrs){element.on("click",function(){createChartImages(scope.config.chartWidth),"save"!==attrs.exportChart&&outputService(scope,attrs.exportChart)});var styles,createChartImages=function(width){angular.element("defs").remove(),inlineAllStyles();var canvas=angular.element("#canvas").empty()[0];if(width){var scaleFactor=width/angular.element("#chart").width();angular.element("#chart > svg").attr("transform","scale("+scaleFactor+")"),canvas.width=angular.element("#chart > svg").width()*scaleFactor,canvas.height=angular.element("#chart > svg").height()*scaleFactor}else angular.element("#chart > svg").attr("transform","scale(2)"),canvas.width=2*angular.element("#chart > svg").width(),canvas.height=2*angular.element("#chart > svg").height();var canvasContext=canvas.getContext("2d"),svg=document.getElementsByTagName("svg")[0],serializer=new XMLSerializer;svg=serializer.serializeToString(svg),canvasContext.drawSvg(svg,0,0);for(var filename=[],i=0;i<scope.columns.length;i++)filename.push(scope.columns[i]);scope.chartTitle&&filename.unshift(scope.chartTitle),filename=filename.join("-").replace(/[^\w\d]+/gi,"-"),angular.element(".savePNG").attr("href",canvas.toDataURL("png")).attr("download",function(){return filename+"_axisJS.png"});var svgContent=createSVGContent(angular.element("#chart > svg")[0]);$(".saveSVG").attr("href","data:text/svg,"+svgContent.source[0]).attr("download",function(){return filename+"_axisJS.svg"})},inlineAllStyles=function(){for(var chartStyle,selector,i=0;i<=document.styleSheets.length-1;i++)document.styleSheets[i].href&&-1!==document.styleSheets[i].href.indexOf("c3.css")&&(chartStyle=void 0!==document.styleSheets[i].rules?document.styleSheets[i].rules:document.styleSheets[i].cssRules);if(null!==chartStyle&&void 0!==chartStyle){var changeToDisplay=function(){("hidden"===angular.element(this).css("visibility")||"0"===angular.element(this).css("opacity"))&&angular.element(this).css("display","none")};for(i=0;i<chartStyle.length;i++)1===chartStyle[i].type&&(selector=chartStyle[i].selectorText,styles=makeStyleObject(chartStyle[i]),angular.element("svg *").each(changeToDisplay),angular.element(selector).not(".c3-chart path").css(styles)),angular.element(".c3-chart path").filter(function(){return"none"===angular.element(this).css("fill")}).attr("fill","none"),angular.element(".c3-chart path").filter(function(){return"none"!==angular.element(this).css("fill")}).attr("fill",function(){return angular.element(this).css("fill")})}},makeStyleObject=function(rule){var s,styleDec=rule.style,output={};for(s=0;s<styleDec.length;s++)output[styleDec[s]]=styleDec[styleDec[s]];return output},createSVGContent=function(svg){var prefix={xmlns:"http://www.w3.org/2000/xmlns/",xlink:"http://www.w3.org/1999/xlink",svg:"http://www.w3.org/2000/svg"},doctype='<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';svg.setAttribute("version","1.1");var styleEl=document.createElement("style");styleEl.setAttribute("type","text/css"),svg.removeAttribute("xmlns"),svg.removeAttribute("xlink"),svg.hasAttributeNS(prefix.xmlns,"xmlns")||svg.setAttributeNS(prefix.xmlns,"xmlns",prefix.svg),svg.hasAttributeNS(prefix.xmlns,"xmlns:xlink")||svg.setAttributeNS(prefix.xmlns,"xmlns:xlink",prefix.xlink);var source=(new XMLSerializer).serializeToString(svg).replace("</style>","<![CDATA["+styles+"]]></style>");return source=source.replace(/\sfont-.*?: .*?;/gi,""),source=source.replace(/\sclip-.*?="url\(http:\/\/.*?\)"/gi,""),source=source.replace(/\stransform="scale\(2\)"/gi,""),source=source.replace(/<defs xmlns="http:\/\/www.w3.org\/1999\/xhtml">/gi,"<defs>"),{svg:svg,source:[doctype+source]}}}}}]),angular.module("axisJSApp").directive("addColors",["$timeout",function($timeout){return{restrict:"A",link:function(scope,element){$timeout(function(){element.children("option").each(function(){var elm=angular.element(this);elm.attr("data-color",elm.text())}),element.colorselector()},500)}}}]),angular.module("axisJSApp").directive("maintainFocus",function(){return{restrict:"A",link:function(scope,element){element.on("keydown",function(e){if(9===e.keyCode){var val=this.value,start=this.selectionStart,end=this.selectionEnd;return this.value=val.substring(0,start)+"	"+val.substring(end),this.selectionStart=this.selectionEnd=start+1,!1}})}}}),angular.module("axisJSApp").factory("configChooser",["cnOffCanvas",function(cnOffCanvas){return cnOffCanvas({controller:function(){this.name="Choose Configuration"},controllerAs:"ConfigCtrl",templateUrl:"partials/configChooser.html"})}]),angular.module("axisJSApp").provider("configProvider",function(){var userConfigFile="config.yaml";return{setConfigFile:function(value){userConfigFile=value},$get:["$http","$q",function($http,$q){var defaultConfig=$http.get("default.config.yaml"),userConfig=$http.get(userConfigFile).then(function(response){return response.data},function(response){return 404===response.status?(response.data={},response):$q.reject(response)});return $q.all([defaultConfig,userConfig]).then(function(values){var defaultConfigYaml=jsyaml.safeLoad(values[0].data),userConfigYaml=jsyaml.safeLoad(values[1]);return userConfigYaml="undefined"!==userConfigYaml?userConfigYaml:{},angular.extend(defaultConfigYaml,userConfigYaml)})}]}}).config(["configProviderProvider",function(configProviderProvider){var config=window.location.href.match(/config=([a-z]+)/i);config&&config.length>0&&configProviderProvider.setConfigFile("themes/"+config[1]+".config.yaml")}]),angular.module("axisJSApp").factory("GenericOutput",[function(){return this.serviceConfig={type:"save",label:""},this.preprocess=function(scope){return scope},this.process=function(payload){return payload},this.complete=function(output){return output},this["export"]=function(scope){var payload=this.preprocess(scope),output=this.process(payload);return this.complete(output)},this}]),angular.module("axisJSApp").factory("wordpressOutput",["GenericOutput","$http","$timeout",function(GenericOutput,$http){var wordpress=angular.copy(GenericOutput);return wordpress.serviceConfig={type:"export",label:"Save to WordPress"},wordpress.preprocess=function(scope){var chartConfig=angular.copy(scope.config);chartConfig.axis.x.tick.format=chartConfig.axis.x.tick.format.toString(),chartConfig.axis.y.tick.format=chartConfig.axis.y.tick.format.toString(),chartConfig.axis.y2.tick.format=chartConfig.axis.y2.tick.format.toString(),chartConfig.pie.label.format=chartConfig.pie.label.format.toString(),chartConfig.donut.label.format=chartConfig.donut.label.format.toString(),chartConfig.gauge.label.format=chartConfig.gauge.label.format.toString();var axisConfig=String(angular.toJson(chartConfig)),axisChart=String(angular.element(".savePNG").attr("href")),axisWP=parent.tinymce.activeEditor.windowManager.getParams().axisWP;return{action:"insert_axis_attachment",axisConfig:axisConfig,axisChart:axisChart,parentID:axisWP.parentID}},wordpress.process=function(payload){$http.post(parent.ajaxurl,payload,{headers:{"Content-Type":"application/x-www-form-urlencoded"},transformRequest:function(obj){var str=[];for(var key in obj)if(obj[key]instanceof Array)for(var idx in obj[key]){var subObj=obj[key][idx];for(var subKey in subObj)str.push(encodeURIComponent(key)+"["+idx+"]["+encodeURIComponent(subKey)+"]="+encodeURIComponent(subObj[subKey]))}else str.push(encodeURIComponent(key)+"="+encodeURIComponent(obj[key]));return str.join("&")}}).success(function(res){res=angular.fromJson(res),parent.tinymce.activeEditor.insertContent('<div class="mceNonEditable"><img width="100%" src="'+res.attachmentURL+"?"+(new Date).getTime()+"\" data-axisjs='"+window.btoa(angular.toJson(res))+'\' class="mceItem axisChart" /></div><br />'),parent.tinymce.activeEditor.windowManager.close()}).error(function(data,status,headers,config){console.dir([data,status,headers,config])})},wordpress["export"]=function(scope){var payload=wordpress.preprocess(scope);wordpress.process(payload),wordpress.complete()},wordpress}]),angular.module("axisJSApp").service("outputService",["configProvider","$injector",function(configProvider,$injector){return function(scope,type){var output=$injector.get(type+"Output");return output["export"](scope)}}]),angular.module("axisJSApp").service("chartProvider",["$injector",function($injector){return function(appConfig){var framework=$injector.get(appConfig.framework+"Service"),config=framework.getConfig(appConfig);return config.generate=framework.generate,config}}]),angular.module("axisJSApp").factory("c3Service",function(){return{generate:function(selectorID,config){var chartConfig=angular.extend({bindto:"#"+selectorID},config);return c3.generate(chartConfig)},getConfig:function(appConfig){var defaultColors=[];angular.forEach(appConfig.colors,function(color){defaultColors.push(color.value)});var config={data:{x:"",y:"",y2:"",columns:[["data1",30,200,100,400,150,250],["data2",50,20,10,40,15,25]],axes:{data1:appConfig.defaults["y axis"],data2:appConfig.defaults["y axis"]},groups:{},type:"",types:{data1:"line",data2:"line"},colors:{data1:appConfig.colors[0].value,data2:appConfig.colors[1].value}},grid:{x:{show:"undefined"!=typeof appConfig.defaults["grid x"]?appConfig.defaults["grid x"]:!1},y:{show:"undefined"!=typeof appConfig.defaults["grid y"]?appConfig.defaults["grid y"]:!1}},axis:{x:{show:"undefined"!=typeof appConfig.defaults["axis x"]?appConfig.defaults["axis x"]:!0},y:{show:"undefined"!=typeof appConfig.defaults["axis y"]?appConfig.defaults["axis y"]:!0},y2:{show:"undefined"!=typeof appConfig.defaults["axis y2"]?appConfig.defaults["axis y2"]:!1}},point:{show:"undefined"!=typeof appConfig.defaults.point?appConfig.defaults.point:!1},legend:{position:"undefined"!=typeof appConfig.defaults["legend position"]?appConfig.defaults["legend position"]:"bottom",show:"undefined"!=typeof appConfig.defaults.legend?appConfig.defaults.legend:!0},color:{pattern:defaultColors}},chartTypes=["line","step","area","area-step","scatter","bar","spline"],axesConfig=[{value:"x",label:"Bottom"},{value:"y",label:"Left"},{value:"y2",label:"Right"}];return config.groups={},config.axis.x.accuracy=0,config.axis.y.accuracy=0,config.axis.y2.accuracy=0,config.axis.x.prefix="",config.axis.y.prefix="",config.axis.y2.prefix="",config.axis.x.suffix="",config.axis.y.suffix="",config.axis.y2.suffix="",config.axis.x.tick={format:function(d){return"series"===config.chartGlobalType&&"category"!==config.axis.x.type?config.axis.x.prefix+d.toFixed(config.axis.x.accuracy).toString()+config.axis.x.suffix:d}},config.axis.y.tick={format:function(d){return"series"===config.chartGlobalType&&"category"!==config.axis.y.type?config.axis.y.prefix+d.toFixed(config.axis.y.accuracy).toString()+config.axis.y.suffix:d}},config.axis.y2.tick={format:function(d){return"series"===config.chartGlobalType&&"category"!==config.axis.y2.type?config.axis.y2.prefix+d.toFixed(config.axis.y2.accuracy).toString()+config.axis.y2.suffix:d}},config.chartTitle="",config.chartCredit="",config.chartSource="",config.chartWidth=1e3,config.chartHeight=500,config.chartGlobalType="series",config.chartAccuracy=1,config.cms="undefined"!=typeof parent.tinymce?!0:!1,config.pie={label:{format:function(val,percentage){return(100*percentage).toFixed(config.chartAccuracy)+"%"}}},config.donut={label:{format:function(val,percentage){return(100*percentage).toFixed(config.chartAccuracy)+"%"}}},config.gauge={label:{format:function(val,percentage){return(100*percentage).toFixed(config.chartAccuracy)+"%"}}},{config:config,chartTypes:chartTypes,axesConfig:axesConfig,dependencies:this.getExternalDependencies()}},getExternalDependencies:function(){return{css:["//cdnjs.cloudflare.com/ajax/libs/c3/0.4.7/c3.min.css"],js:["//cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js","//cdnjs.cloudflare.com/ajax/libs/c3/0.4.7/c3.min.js"]}}}}),angular.module("axisJSApp").service("inputService",["configProvider","$injector",function(configProvider,$injector){return function(appConfig){return $injector.get(appConfig.input+"Input")}}]),angular.module("axisJSApp").factory("csvInput",function(){var validateCSV=function(value){var parserConfig={header:!0};value.match("	")&&(parserConfig.delimiter="	");var csv=Papa.parse(value,parserConfig),noDelimiter=/^[^,\t\s]*\n[^,\t\s]*$/gm;return csv.errors.length>0&&!value.match(noDelimiter)?!1:!0},defaultCSV="data1	data2\n30	50\n200	20\n100	10\n400	40\n150	15\n250	25",parseCSV=function(scope){if(scope.inputs.csvData){scope.chartData=[],scope.columns=[],scope.config.data.columns=[];var parserConfig={header:!0};scope.inputs.csvData.match("	")&&(parserConfig.delimiter="	"),scope.chartData=Papa.parse(scope.inputs.csvData,parserConfig).data,scope.chartData.length>0&&(scope.columns=Object.keys(scope.chartData[0]),angular.forEach(scope.columns,function(colName){var column=[];column.push(colName),angular.forEach(scope.chartData,function(datum){column.push(datum[colName])}),scope.config.data.columns.push(column)}))}return scope},convertColsToCSV=function(columns){for(var data=[],headers=[],i=0;i<columns.length;i++){headers.push(columns[i].shift());for(var j=0;j<columns[i].length;j++)data[j]||(data[j]=[]),data[j][i]=columns[i][j]}return Papa.unparse({fields:headers,data:data},{delimiter:"	"})};return{validate:function(value){return validateCSV(value)},defaultData:{csvData:defaultCSV},input:function(scope){return parseCSV(scope)},convert:function(data){return convertColsToCSV(data)}}}),angular.module("axisJSApp").factory("embedcodeOutput",["GenericOutput","chartProvider","$modal",function(GenericOutput,chartProvider,$modal){var embed=angular.copy(GenericOutput);return embed.serviceConfig={type:"export",label:"Generate embed code"},embed.preprocess=function(scope){var chartConfig=angular.copy(scope.config);return chartConfig.bindto="#chart-"+Math.floor(1e4*Math.random()+1),{config:chartConfig,dependencies:chartProvider(scope.appConfig).dependencies}},embed.process=function(payload){var output=[],config=btoa(JSONfn.stringify(payload.config));return output.push('<div id="'+payload.config.bindto.replace("#","")+'"></div>'),angular.forEach(payload.dependencies.css,function(v){output.push('<link rel="stylesheet" href="'+v+'" />')}),angular.forEach(payload.dependencies.js,function(v){output.push('<script src="'+v+'"></script>')}),output.push('<script type="text/javascript">(function(){var configJSON = JSON.parse(atob("'+config+'"));var fixJson = function(obj){for(var i in obj)obj.hasOwnProperty(i)&&("string"==typeof obj[i]&&obj[i].match(/^function/)?obj[i]=eval("("+obj[i]+")"):"object"==typeof obj[i]&&fixJson(obj[i]));return obj};var config = fixJson(configJSON);c3.generate(config);})();</script>'),output.join("\n")},embed.complete=function(output){$modal.open({template:'<h1 style="text-align: center;">Embed code: <br /><small style="text-align: center;">Copy and paste this into a new HTML document</small></h1> <textarea width="100%" height="400" class="form-control">{{output}}</textarea>',controller:["$scope",function($scope){$scope.output=output}]})},embed}]),angular.module("axisJSApp").service("pdfOutput",["GenericOutput",function(GenericOutput){var pdf=angular.copy(GenericOutput);return pdf.preprocess=function(scope){return{data:document.getElementById("canvas").toDataURL(),margins:scope.appConfig["print margins"]?scope.appConfig["print margins"]:void 0}},pdf.process=function(payload){var doc=new jsPDF("l","pt");return doc.addImage(payload.data,"PNG",0,0),doc},pdf.complete=function(output){output.save("axis.pdf")},pdf}]),angular.module("axisJSApp").directive("saveButton",function(){return{templateUrl:"partials/saveButton.html",scope:{buttonType:"@type",config:"="}}});