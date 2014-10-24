require([
  "dojo/parser",
  "dojo/ready",
  "dojo/dom",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/dom-style",
  "dojo/_base/array",
  "dijit/registry",
  "dojo/on",
  "dojo/query",
  "dojo/dom-prop",
  "dojo/io-query",
  "esri/arcgis/Portal",
  "esri/config",
  "esri/lang",
  "esri/IdentityManager",
  "dojox/widget/ColorPicker", //adding color picker from dojo to replace jQuery spectrum
  "dijit/form/RadioButton",
  "dojo/_base/lang",
  "dojox/lang/aspect",
  "dijit/Dialog",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "dijit/layout/TabContainer",
  "dijit/layout/ContentPane",
  "dijit/layout/BorderContainer",
  "dojo/promise/all"
], function(
  parser, ready, dom, domAttr, domClass, domConstruct, domStyle, array, registry, on, query, domProp, ioQuery,
  arcgisPortal, config, esriLang, IdentityManager, ColorPicker, RadioButton, dojoLang, aspect, Dialog, Query, QueryTask, TabContainer,ContentPane,BorderContainer,all) {


  ready(function() {
    parser.parse();
    processQueryParameters();
    init();
  });

  function isSet(str) {
    // helper method which determines if a string is defined and is not empty
    return esriLang.isDefined(str) && str.length > 0;
  }

  function processQueryParameters() {
    var queryParams = ioQuery.queryToObject(window.location.search.slice(1)),
        parcelID = queryParams["pin"];
    if(isSet(parcelID)) {
      appConfig.parcelID = parcelID;
    }
  }

  function init() {
	if (appConfig.parcelID != "") {
		dom.byId("parcelNumber").innerHTML = "Information for Parcel: " + appConfig.parcelID;
		registry.byId("instrumentsPane").set("content", "Retrieving Data...");
		var improvementsQT = new QueryTask(appConfig.improvementsLayer);
		var instrumentsQT = new QueryTask(appConfig.instrumentsLayer);
		var landQT = new QueryTask(appConfig.landLayer);
		var improvementsQuery = new Query();
			improvementsQuery.returnGeometry = false;
			improvementsQuery.outFields = appConfig.improvementsOutFieldNames;
			improvementsQuery.where = appConfig.improvementsParcelIdFieldName + " = '" + appConfig.parcelID + "'";
		var q1 = improvementsQT.execute(improvementsQuery);
		
		var instrumentsQuery = new Query();
			instrumentsQuery.returnGeometry = false;
			instrumentsQuery.outFields = appConfig.instrumentsOutFieldNames;
			instrumentsQuery.where = appConfig.instrumentsParcelIdFieldName + " = '" + appConfig.parcelID + "'";
		var q2 = instrumentsQT.execute(instrumentsQuery);
		
		var landQuery = new Query();
			landQuery.returnGeometry = false;
			landQuery.outFields = appConfig.landOutFieldNames;
			landQuery.where = appConfig.landParcelIdFieldName + " = '" + appConfig.parcelID + "'";
		var q3 = landQT.execute(landQuery);

		all([q1, q2, q3]).then(function(results){
		// results will be an Array
			console.log(results[0]);
			var theString = "";
			var headerString = "";
			require(["dojo/_base/array"], function(array){
			  array.forEach(results[0].features, function(feature, i){
				console.debug(feature.attributes, "at index", i);
				theString += "<tr>";
				headerString = "";
				for (var property in feature.attributes) {
					if (feature.attributes.hasOwnProperty(property)) {
						console.log(property);
						//theString += property + ": " + feature.attributes[property] + "<br/>";
						theString += "<td>" + feature.attributes[property] + "</td>";
						headerString += "<th>" +property+ "</th>";
					}
				}
				theString+="</tr>";
			  });
			});
			registry.byId("improvementsPane").set("content", "<table>" + headerString + theString + "</table>");
			
			console.log(results[1]);
			var theString = "";
			var headerString = "";
			require(["dojo/_base/array"], function(array){
			  array.forEach(results[1].features, function(feature, i){
				console.debug(feature.attributes, "at index", i);
				theString += "<tr>";
				headerString = "";
				for (var property in feature.attributes) {
					if (feature.attributes.hasOwnProperty(property)) {
						console.log(property);
						//theString += property + ": " + feature.attributes[property] + "<br/>";
						if (array.indexOf(appConfig.instrumentsOutDateFields, property) != -1) {
							
							if (feature.attributes[property]) {
								require(["dojo/date/locale"], function(locale){
									var _dStr = locale.format(new Date(feature.attributes[property] + (new Date().getTimezoneOffset() * 60000)),{
										selector: "date",
										formatLength: "short"
									});
									theString += "<td>" + _dStr + "</td>";
									headerString += "<th>" +property+ "</th>";
								})
							} else {
								theString += "<td>" + "" + "</td>";
								headerString += "<th>" +property+ "</th>";
							}

						} else {
							theString += "<td>" + feature.attributes[property] + "</td>";
							headerString += "<th>" +property+ "</th>";
						}
					}
				}
				theString+="</tr>";
			  });
			});
			registry.byId("instrumentsPane").set("content", "<table>" + headerString + theString + "</table>");
			
			console.log(results[2]);
			var theString = "";
			var headerString = "";
			require(["dojo/_base/array"], function(array){
			  array.forEach(results[2].features, function(feature, i){
				console.debug(feature.attributes, "at index", i);
				theString += "<tr>";
				headerString = "";
				for (var property in feature.attributes) {
					if (feature.attributes.hasOwnProperty(property)) {
						console.log(property);
						//theString += property + ": " + feature.attributes[property] + "<br/>";
						theString += "<td>" + feature.attributes[property] + "</td>";
						headerString += "<th>" +property+ "</th>";
					}
				}
				theString+="</tr>";
			  });
			});
			registry.byId("landPane").set("content", "<table>" + headerString + theString + "</table>");
		});
		
		
		
	} else {
		dom.byId("parcelNumber").innerHTML = "You must provide a PIN";
	}
  }
});