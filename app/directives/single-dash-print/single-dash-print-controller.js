(function () {
    'use strict';
    angular.module('app.mapaprod').controller('singleDashPrintCtrl', singleDashPrintCtrl);
    function singleDashPrintCtrl ($location, linkFactory, databaseFactory, parser, $mdMedia, $scope, $timeout, $rootScope, common, $window) {



		//console.log(linkFactory.getDashboardType(),linkFactory.getPrintInfo()[0]);

		//////////CTRL Init Code
		var self = this;
		self.done = false;	//Este Done se usa para cuando se carga la primera vez, para notificar afuera del la directiva y al progress-circular (spinner)
		self.doneB = false; //Este se usa para esconder y mostrar la barrita propia de la directiva. Se comporta diferente al 'self.done'
		self.nodeData = {};
		self.generalData = {};
		self.currentNode = {};
		self.regionPolygons = [];
		self.dashboardType = 'region';
		self.dashboardContraType = 'sector';
		self.activeCategory = 'empleo';
		self.rawResponse = {};
		self.parsedResponse = {};
		self.mapObject = {};
		self.isReady = {
			scatter: false,
			treemap: false,
			scatter2: false,
			treemap2: false,
			generalData: false,
			map: false,
			mapObject: false,
			check: function() {
				return (this.scatter && this.treemap && this.scatter2 && this.treemap2 && this.generalData && this.map && this.mapObject)
			}
		};
		self.isLayerDone = true;

	    //////////Init Code
		self.dashboardType = linkFactory.getDashboardType();
		self.dashboardContraType = (self.dashboardType === 'region') ? 'sector' : 'region';		
		self.currentNode = linkFactory.getSelectedNode(self.identifier);
		

		/////////////////////////////////SINCRONISMO
	    //Funcion que me permite mantener el sincronismo para poder imprimir el PDF
	    function printAndRedirect(callbackRedirect, callbackPrint){
		    //callbackRedirect();
		    callbackPrint();
		}

		function populateAll(){
			console.log("populateAllL");
			populateCharts();
			populateGeneralData();
			if (self.dashboardType == 'region') {
				populateMap();
			} else if (self.dashboardType == 'sector') {
				populateHeatMap();
			}
			$timeout(resetSizes(), 100);
			self.done = true;
			self.doneB = true;
		};

		function print(){

			console.log("print");					
			html2canvas(document.body,{'useCORS':true}).then(function(canvas) {
			    var win=window.open();
			    win.document.write("<img style='height: 100%' src='"+canvas.toDataURL()+"'/>");
			    win.print();
			    //Esto hay que tocarlo cuando pase a produccion
			    window.location.href = '/gis-mProduccion-v2.1/#/dashboard';				    			    			    
			    win.close();
			    			    
			});			
		};


		function redirect(){
			console.log("redirect",self.parsedResponse.comparison);
			if(self.parsedResponse.comparison == true){
				$location.path('/comparacion');
				// $window.close();
			}else{
				$location.path('/dashboard');
			}
		};

		/////////////////////////////////SINCRONISMO

		////////Si se quiere acceder directo al dashboard y no se hizo el path correspondiente,
		////////ni hay localstorage, redirecciona a selector
		if (self.dashboardType == null || self.currentNode == null) {
			$location.path('/selector');
		}
		////////

    	//////////Mediaquerys para responsive  
		function resetSizes() {
			$timeout(
				function() {
					if (self.isReady.check()) {
						//initLayout();
						self.treemap.resize();
						self.scatter.resize();
						self.treemap2.resize();
						self.scatter2.resize();
						console.log(self.identifier + '|' + 'Resized');
					}
				}, 100)
		}		 		            
	    //////////Mediaquerys para responsive 


		//////////Similar a Document.ready
	    angular.element(document).ready(function () {


			var treemapID = self.identifier + 'treemap';
			var scatterID = self.identifier + 'scatter';
			self.treemap = echarts.init(document.getElementById(treemapID));
			self.scatter = echarts.init(document.getElementById(scatterID));

			var treemapID2 = self.identifier + 'treemap2';
			var scatterID2 = self.identifier + 'scatter2';
			self.treemap2 = echarts.init(document.getElementById(treemapID2));
			self.scatter2 = echarts.init(document.getElementById(scatterID2));

			initMap();
			self.isReady.scatter= true;
			self.isReady.treemap= true;
			self.isReady.scatter2= true;
			self.isReady.treemap2= true;
			self.isReady.generalData= true;
			self.isReady.map= true;
			self.isReady.mapObject= true;

			if (linkFactory.getPrintInfo()[0]) {
				self.parsedResponse = linkFactory.getPrintInfo()[0];
				self.rawResponse = linkFactory.getPrintInfo()[1];
				self.currentNode = linkFactory.getPrintInfo()[2];
				fetchAndParseMap();
			}else{
				self.parsedResponse = linkFactory.getPrintInfo();
				populateAll();
				$timeout(function() {
			        printAndRedirect( redirect ,print );
			        console.log('update with timeout fired');			        
			    }, 650);
			}
	    });
	    //////////

		function fetchAndParseMap() {
	        databaseFactory.getSectorTree()
	    		.success(function(response){
	    			self.rawResponse.sectorTree = response;
					databaseFactory.getRegionTree()
			    		.success(function(response){
			    			self.rawResponse.regionTree = response;
					        ////////////MAPA & HEATMAP
					        if (self.dashboardType == 'region') {
					        	databaseFactory.getMapData(self.currentNode,self.rawResponse.regionTree,self.dashboardType)
						        	.success(function(response){
						    			self.rawResponse.map = response;
						    			self.parsedResponse.map = parser.parseMap(self.rawResponse.map,self.rawResponse.regionTree,self.identifier,self.currentNode);
					    				console.log(self.identifier + '|' + "READY databaseFactory.getMapData");
					    				console.log(self.parsedResponse.map);
					    				self.isReady.map = true;
					    				populateAll();
										$timeout(function() {
									        printAndRedirect( redirect ,print );
									        console.log('update with timeout fired');
									    }, 450);
						    		});	//END databaseFactory.getMapData
						    } else if (self.dashboardType == 'sector') {
				    			//Selecciona todas las provincias. Depth=2
				    			var provincias = [];
				    			for (var i = 0; i < self.rawResponse.regionTree.length; i++) {
				    				if (self.rawResponse.regionTree[i].depth == 2) {
				    					provincias.push(self.rawResponse.regionTree[i].kmlID);
				    				}
				    			}
				    			databaseFactory.getMapData('','',self.dashboardType)
						        	.success(function(response){
						    			self.rawResponse.map = response;
										databaseFactory.getResults(self.currentNode.nodeID,'sector',self.currentNode.depth) //Heatmap tiene los mismos datos que el scatter
											.success(function(response){
												self.rawResponse.heatMap = response;
												console.log(response);
												self.parsedResponse.heatMap.empleo = parser.parseHeatMap(self.rawResponse.map,self.rawResponse.heatMap,self.rawResponse.regionTree,'empleo');
												self.parsedResponse.heatMap.export = parser.parseHeatMap(self.rawResponse.map,self.rawResponse.heatMap,self.rawResponse.regionTree,'export');
								    			console.log(self.identifier + '|' + "READY HeatMap databaseFactory.getResults");
								    			self.isReady.map = true;
								    			populateAll();
												$timeout(function() {
											        printAndRedirect( redirect ,print );
											        console.log('update with timeout fired');
											    }, 450);
											}); // END databaseFactory.getResults
						    		});	// END databaseFactory.getMapData
						    }//END MAPA & HEATMAP
						});//END databaseFactory.getRegionTree
				});//END databaseFactory.getSectorTree
		}

    	//MAP Init code
    	function initMap() {
			var styles = [
						{
					  		'featureType': 'all',
					  		'elementType': 'all',
					  		'stylers': [{'visibility': 'on'}]
						},
						{
							'featureType': 'landscape',
							'elementType': 'geometry',
							'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
						},
						{
							'featureType': 'administrative',
							'elementType': 'labels',
							'stylers': [{'visibility': 'on'}]
						},						
						{
							'featureType': 'water',
							'elementType': 'labels',
							'stylers': [{'visibility': 'off'}]
						},
						{
							'featureType': 'water',
							'elementType': 'geometry',
							'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
						}];

	        var myOptions = {
				zoom: 4,
				center: new google.maps.LatLng(-40.3, -63.7),
				disableDefaultUI: true,
				scrollwheel: false,
				clickableIcons: false,
				disableDoubleClickZoom: true,
				draggable: false,
				styles: styles,
				mapTypeId: google.maps.MapTypeId.ROADMAP
	        };

	        var mapID = self.identifier + 'map';
	        self.mapObject = new google.maps.Map(document.getElementById(mapID),
	            myOptions);

			google.maps.event.addListener(self.mapObject, 'idle', function(){
			    console.log(self.identifier + '|' + 'READY google.maps.event.addListener');
			    self.isReady.mapObject = true;
			    $scope.$apply();   
			});

	        console.log("initMap");
    	}

		///////////Funciones para popular todos los elementos del dashboard
		function populateCharts() {
			setChartTitles(self.activeCategory, self.dashboardType);

			self.scatter.setOption(self.parsedResponse.scatter['empleo'],true);
			self.scatter2.setOption(self.parsedResponse.scatter['export'],true);
			self.isReady.scatter = false;
			self.isReady.scatter2 = false;

			self.treemap.setOption(self.parsedResponse.treemap['empleo'],true);
			self.treemap2.setOption(self.parsedResponse.treemap['export'],true);
			self.isReady.treemap = false;
			self.isReady.treemap2 = false;				
		}

		function populateGeneralData() {
			self.generalData = self.parsedResponse.generalData;
			self.isReady.generalData = false;
		}

		function populateMap() {
			// self.parentName = common.getNodeById(self.currentNode.parentID, self.rawResponse.regionTree).nodeName;

			var coordinates = {};
			for (var i = 0; i < self.regionPolygons.length; i++) {
				self.regionPolygons[i].setMap(null);
			}		
				
			self.regionPolygons = self.parsedResponse.map;		
			//Auto-zoom y posicionamiento
			var latlngbounds = new google.maps.LatLngBounds();
			for (var i = 0; i < self.regionPolygons.length; i++) {
				coordinates = self.regionPolygons[i].getPath().getArray();
				for (var j = 0; j < coordinates.length; j++) {
					latlngbounds.extend(coordinates[j]);
				}
			}
			self.mapObject.fitBounds(latlngbounds);	
			//Dibuja los polygonos en el mapa
			for (var i = 0; i < self.regionPolygons.length; i++) {
				self.regionPolygons[i].setMap(self.mapObject);
			}		
			self.isReady.map = false;			
				console.log("populateMap");
		}

		function populateHeatMap() {
			//Borra los poligonos ya dibujados
			for (var i = 0; i < self.regionPolygons.length; i++) {
				self.regionPolygons[i].setMap(null);
			}			
			console.log(self.activeCategory);
			self.regionPolygons = self.parsedResponse.heatMap[self.activeCategory];
			//Dibuja los polygonos en el mapa
			for (var i = 0; i < self.regionPolygons.length; i++) {
				self.regionPolygons[i].setMap(self.mapObject);
			}			
			self.isReady.map = false;
		}

        ////////////HEATMAP
        //Para esconder/mostrar la escala del HeatMap
        self.isHeatMapScaleVisible = function(type){
        	if (type == 'sector') {
        		return true;
        	} else {
        		return false;
        	}
        }
        ////////////HEATMAP


        ////////////CHARTS
        function setChartTitles(category, type) {
        	if (type == 'region') {				
				if (category == 'empleo') {
					self.treemap.title = 'Participación sectorial en empleo region (2015)';
					self.scatter.title = 'Matriz de clasificación de Empleo por Región (2007-2015)';
				} else if (category == 'export') {
					self.treemap.title = 'Participación sectorial en exportación region (2015)';
					self.scatter.title = 'Matriz de clasificación de Export. por Región (2007-2015)';
				}
			} else if (type == 'sector') {
				if (category == 'empleo') {
					self.treemap.title = 'Participación regional en empleo sectorial (2015)';
					self.scatter.title = 'Matriz de clasificación de Empleo por Sector (2007-2015)';
				} else if (category == 'export') {
					self.treemap.title = 'Participación regional en exportación sectorial (2015)';
					self.scatter.title = 'Matriz de clasificación de Export. por Sector (2007-2015)';
				}				
			}
			if (category == 'empleo') {
				self.scatter.xAxis = 'Coef. de especialización Empleo';
				self.scatter.yAxis = 'Grado de dinámica Empleo';
			} else if (category == 'export') {
				self.scatter.xAxis = 'Coef. de especialización Exportación';
				self.scatter.yAxis = 'Grado de dinámica Exportación';
			}
        }
        ////////////CHARTS


    }
})();