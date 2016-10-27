(function () {
    'use strict';
    angular.module('app.mapaprod').controller('singleDashCtrl', singleDashCtrl);
    function singleDashCtrl ($location, linkFactory, databaseFactory, parser, $mdMedia, $scope, $timeout) {

		//////////CTRL Init Code
		var self = this;
		self.done = false;
		self.nodeData = {};
		self.generalData = {};
		self.currentNode = {};
		self.regionPolygons = [];
		self.dashboardType = 'region';
		self.dashboardContraType = 'sector';
		self.activeCategory = 'empleo';
		self.rawResponse = {};
		self.parsedResponse = {
			scatter: new Object(),
			treemap: new Object(),
			generalData: new Object(),
			map: new Object(),
			heatMap: new Object()
		};
		self.mapObject = {};
		self.isReady = {
			scatter: false,
			treemap: false,
			generalData: false,
			map: false,
			mapObject: false,
			check: function() {
				return (this.scatter && this.treemap && this.generalData && this.map && this.mapObject)
			}
		};

	    //////////Retrieve data from linkFactory
		self.dashboardType = linkFactory.getDashboardType();
		self.dashboardContraType = (self.dashboardType === 'region') ? 'sector' : 'region';		
		self.currentNode = linkFactory.getSelectedNode(self.identifier);
		console.log(self.identifier + '|' + 'selected: ' + self.currentNode.nodeName);
		initLayout();  	
		//////////


		/////////////////////////////////SINCRONISMO
	    //Se ejecuta cuando todos los componentes se terminaron de cargar
		$scope.$watch(angular.bind(self, function() { return self.isReady.check();}),
			function(){
				populateCharts();
				populateGeneralData();
				if (self.dashboardType == 'region') {
					populateMap();
				} else if (self.dashboardType == 'sector') {
					populateHeatMap();
				}
				console.log(self.identifier + '|' + "READY ALL");
				$timeout(resetSizes(), 100);
				self.done = true;
			});
		/////////////////////////////////SINCRONISMO


		////////Si se quiere acceder directo al dashboard y no se hizo el path correspondiente,
		////////ni hay localstorage, redirecciona a selector
		if (self.dashboardType == null || self.currentNode == null) {
			$location.path('/selector');
		}
		////////

    	//////////Mediaquerys para responsive  
		$scope.$watch( function() { return $mdMedia('xs'); 		  	}, resetSizes);    	
		$scope.$watch( function() { return $mdMedia('sm'); 		  	}, resetSizes);
		$scope.$watch( function() { return $mdMedia('md'); 			}, resetSizes); 		
		$scope.$watch( function() { return $mdMedia('landscape'); 	}, resetSizes);
		function resetSizes() {
			$timeout(
				function() {
					if (self.isReady.check()) {
						initLayout();
						self.treemap.resize();
						self.scatter.resize();
						console.log(self.identifier + '|' + 'Resized');
					}
				}, 100)
		}		 		            
	    //////////Mediaquerys para responsive 


		//////////Similar a Document.ready
	    angular.element(document).ready(function () {
	    	var complexID = self.identifier + 'complex'
			var treemapID = self.identifier + 'treemap';
			var scatterID = self.identifier + 'scatter';
			self.complex = echarts.init(document.getElementById(complexID));
			self.treemap = echarts.init(document.getElementById(treemapID));
			self.scatter = echarts.init(document.getElementById(scatterID));
			initMap();
			fetchAndParseAll();
			console.log(self.identifier + '|' + "READY angular.element(document).ready");
	    });
	    //////////

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

	        console.log(self.identifier + '|' + 'READY initMap()');
    	}

		//////////Retrieve data from database
		function fetchAndParseAll() {


			//////////TREEMAP
			databaseFactory.getSectorTree()
	    		.success(function(response){
	    			self.rawResponse.sectorTree = response;
					databaseFactory.getRegionTree()
			    		.success(function(response){
			    			self.rawResponse.regionTree = response;

			    			////////////TREEMAP & SCATTER
							databaseFactory.getResults(self.currentNode.nodeID,self.dashboardType,self.currentNode.depth)
								.success(function(response){
									self.rawResponse.entries = response;
									self.parsedResponse.treemap.empleo = parser.parseTreemap(self.rawResponse.entries,self.rawResponse[self.dashboardContraType+'Tree'],'empleo');
									self.parsedResponse.treemap.export = parser.parseTreemap(self.rawResponse.entries,self.rawResponse[self.dashboardContraType+'Tree'],'export');
									self.isReady.treemap = true;
									self.parsedResponse.scatter.empleo = parser.parseScatter(self.rawResponse.entries,self.rawResponse[self.dashboardContraType+'Tree'],'empleo',self.dashboardType)
									self.parsedResponse.scatter.export = parser.parseScatter(self.rawResponse.entries,self.rawResponse[self.dashboardContraType+'Tree'],'export',self.dashboardType)									
									console.log(self.identifier + '|' + "READY databaseFactory.getResults");
									self.isReady.scatter = true;
								});//END databaseFactory.getResults

					        ////////////MAPA & HEATMAP
					        if (self.dashboardType == 'region') {
					        	databaseFactory.getMapData([self.currentNode.kmlID], self.currentNode.depth)
						        	.success(function(response){
						    			self.rawResponse.map = response;
						    			self.parsedResponse.map = parser.parseMap(self.rawResponse.map);
					    				console.log(self.identifier + '|' + "READY databaseFactory.getMapData");
					    				self.isReady.map = true;
						    		});	//END databaseFactory.getMapData
						    } else if (self.dashboardType == 'sector') {
				    			//Selecciona todas las provincias. Depth=2
				    			var provincias = [];
				    			for (var i = 0; i < self.rawResponse.regionTree.length; i++) {
				    				if (self.rawResponse.regionTree[i].depth == 2) {
				    					provincias.push(self.rawResponse.regionTree[i].kmlID);
				    				}
				    			}
				    			databaseFactory.getMapData(provincias, 2)
						        	.success(function(response){
						    			self.rawResponse.map = response;
						    			console.log("READY HeatMap databaseFactory.getMapData");
										databaseFactory.getResults(self.currentNode.nodeID,'sector',self.currentNode.depth) //Heatmap tiene los mismos datos que el scatter
											.success(function(response){
												self.rawResponse.heatMap = response;
												self.parsedResponse.heatMap.empleo = parser.parseHeatMap(self.rawResponse.map,self.rawResponse.heatMap,self.rawResponse.regionTree,'empleo');
												self.parsedResponse.heatMap.export = parser.parseHeatMap(self.rawResponse.map,self.rawResponse.heatMap,self.rawResponse.regionTree,'export');
								    			console.log(self.identifier + '|' + "READY HeatMap databaseFactory.getResults");
								    			self.isReady.map = true;
											}); // END databaseFactory.getResults
						    		});	// END databaseFactory.getMapData
						    }//END MAPA & HEATMAP

						});//END databaseFactory.getRegionTree
				});//END databaseFactory.getSectorTree
			
			//////////DATOS GENERALES
			databaseFactory.getGeneralData(self.currentNode.nodeID,self.dashboardType)
				.success(function(response){
					self.rawResponse.generalData = response;
					self.parsedResponse.generalData = parser.parseGeneralData(self.rawResponse.generalData);
					console.log(self.identifier + '|' + "READY databaseFactory.getGeneralData");
					self.isReady.generalData = true;
				});

		}


		///////////Funciones para popular todos los elementos del dashboard
		function populateCharts() {
			setChartTitles(self.activeCategory, self.dashboardType);
			self.scatter.setOption(self.parsedResponse.scatter[self.activeCategory]);
			self.treemap.setOption(self.parsedResponse.treemap[self.activeCategory]);	
		}

		function populateGeneralData() {
			self.generalData = self.parsedResponse.generalData;
		}

		function populateMap() {
			var coordinates = {};
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
		}
		///////////Funciones para popular todos los elementos del dashboard


	    ///////////Botonera selector de categorias   
		self.setActiveCategory = function (category) {
			self.activeCategory = category;
			populateCharts();
			if (self.dashboardType == 'sector') {
				populateHeatMap();
			}
			console.log(self.identifier + '|' + "READY Category changed: "+category);
		}
		///////////Botonera selector de categorias   


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
					self.scatter.title = 'Matriz de clasificación de region según empleo (2007-2015)';
				} else if (category == 'export') {
					self.treemap.title = 'Participación sectorial en exportación region (2015)';
					self.scatter.title = 'Matriz de clasificación de region según exportaciones (2007-2015)';
				}
			} else if (type == 'sector') {
				if (category == 'empleo') {
					self.treemap.title = 'Participación regional en empleo sectorial (2015)';
					self.scatter.title = 'Matriz de clasificación de sectores según empleo (2007-2015)';
				} else if (category == 'export') {
					self.treemap.title = 'Participación regional en exportación sectorial (2015)';
					self.scatter.title = 'Matriz de clasificación de sectores según exportaciones (2007-2015)';
				}				
			}
        }
        ////////////CHARTS


		function initLayout() {
			if (self.layoutMode == 'compact') {
				self.generalSize = 100;
				self.topDivLayout = 'column';
			}
			else { //Normal layout-mode
				if ($mdMedia('gt-sm')) {
					self.generalSize = 50;
					self.topDivLayout = 'row';
				}
				else {
					self.generalSize = 100;
					self.topDivLayout = 'column';	
				}
			}
			console.log(self);
		}

    }
})();