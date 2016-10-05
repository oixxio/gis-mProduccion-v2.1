(function () {
    'use strict';
    angular.module('app.mapaprod').controller('dashboardCtrl', dashboardCtrl);
    function dashboardCtrl ($location, linkFactory, databaseFactory, parserFactory, $mdMedia, $scope, $timeout) {

		//////////CTRL Init Code
		var self = this;
		var promises = [];
		self.nodeData = {};
		self.generalData = {};
		self.currentNode = {};
		self.regionTree = [];
		self.regionPolygons = [];
		self.dashboardType = 'region';
		self.activeCategory = 'empleo';
		self.rawResponse = {};
		self.complex = echarts.init(document.getElementById('complex'));
		self.treemap = echarts.init(document.getElementById('treemap'));
		self.scatter = echarts.init(document.getElementById('scatter'));
		self.mapObject = {};
		self.isReady = {
			scatter: false,
			treemap: false,
			generalData: false,
			map: false,
			mapObject: false,
			check: function() {
				console.log(this)
				return (this.scatter && this.treemap && this.generalData && this.map && this.mapObject)
			}
		};

	    //////////Retrieve data from linkFactory
		self.dashboardType = linkFactory.getDashboardType();
		self.currentNode = linkFactory.getSelectedNode();
		//////////


		/////////////////////////////////SINCRONISMO
	    //Se ejecuta cuando todos los componentes se terminaron de cargar
		$scope.$watch( function() { return self.isReady.check();},
			function(){
				if (self.isReady.check()) {
					console.log("READY ALL ALL ALL");
					setChartTitles(self.activeCategory,self.dashboardType)
					resetSizes();
				}
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
					self.treemap.resize();
					self.scatter.resize();
					console.log('Resized');
				}, 100)
		}		 		            
	    //////////Mediaquerys para responsive 


		//////////Inicializacion de plugins JS para front (mapa y charts)
	    angular.element(document).ready(function () {
	    	initMap(); 
			fetchDashboardContent();
			console.log("READY angular.element(document).ready");
	    });

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
				//scrollwheel: false,
				clickableIcons: false,
				//disableDoubleClickZoom: true,
				//draggable: false,
				styles: styles,
				mapTypeId: google.maps.MapTypeId.ROADMAP
	        };

	        self.mapObject = new google.maps.Map(document.getElementById('map'),
	            myOptions);

			google.maps.event.addListener(self.mapObject, 'idle', function(){
			    console.log('READY google.maps.event.addListener');
			    self.isReady.mapObject = true;
			    $scope.$apply();
			});

	        console.log('READY initMap()');
    	}

		//////////Retrieve data from database
		function fetchDashboardContent() {

			//////////SCATTER
			databaseFactory.getScatter(self.currentNode.nodeID,self.dashboardType)
				.success(function(response){
					self.rawResponse.scatter = response;
					self.scatter.setOption(
						parserFactory.parseScatter(self.rawResponse.scatter,self.activeCategory,self.dashboardType)
					);
					console.log("READY databaseFactory.getScatter");
					self.isReady.scatter = true;		
				});

			//////////TREEMAP
			databaseFactory.getTreemap(self.currentNode.nodeID,self.dashboardType)
				.success(function(response){
					self.rawResponse.treemap = response;
					self.treemap.setOption(
						parserFactory.parseTreemap(self.rawResponse.treemap,self.activeCategory)
					);
					console.log("READY databaseFactory.getTreemap");
					self.isReady.treemap = true;
				});
			
			//////////DATOS GENERALES
			databaseFactory.getGeneralData(self.currentNode.nodeID,self.dashboardType)
				.success(function(response){
					self.rawResponse.generalData = response;
					self.generalData = parserFactory.parseGeneralData(self.rawResponse.generalData);
					console.log("READY databaseFactory.getGeneralData");
					self.isReady.generalData = true;
				});

	        ////////////MAPA
	        if (self.dashboardType == 'region') {
	        	console.log("Start databaseFactory.getMapData");
		        databaseFactory.getMapData([self.currentNode.kmlID], self.currentNode.depth)
		        	.success(function(response){
		    			self.rawResponse.map = response;

		    			var coordinates = {};
		    			self.regionPolygons = parserFactory.parseMap(self.rawResponse.map);

		    			//Auto-zoom y posicionamiento
		    			var latlngbounds = new google.maps.LatLngBounds();
		    			for (var i = 0; i < self.regionPolygons.length; i++) {
		    				coordinates = self.regionPolygons[i].getPath().getArray();
		    				for (var j = 0; j < coordinates.length; j++) {
		    					latlngbounds.extend(coordinates[j]);
		    				}
		    			}
	    				self.mapObject.fitBounds(latlngbounds);

		    			for (var i = 0; i < self.regionPolygons.length; i++) {
		    				self.regionPolygons[i].setMap(self.mapObject);
		    			}
	    			console.log("READY databaseFactory.getMapData");
	    			self.isReady.map = true;
		    		});	
		    } else if (self.dashboardType == 'sector') {
		    	console.log("Start HeatMap databaseFactory.getRegionTree");
		    	databaseFactory.getRegionTree()
		    		.success(function(response){
		    			self.regionTree = response;
		    			//Selecciona todas las provincias. Depth=2
		    			var provincias = [];
		    			for (var i = 0; i < self.regionTree.length; i++) {
		    				if (self.regionTree[i].depth == 2) {
		    					provincias.push(self.regionTree[i].kmlID);
		    				}
		    			}
		    			console.log("READY HeatMap databaseFactory.getRegionTree");
		    			console.log("Start HeatMap databaseFactory.getMapData");
		    			databaseFactory.getMapData(provincias, 2)
				        	.success(function(response){
				    			self.rawResponse.map = response;
				    			console.log("READY HeatMap databaseFactory.getMapData");
				    			console.log("Start HeatMap databaseFactory.getScatter");
								databaseFactory.getScatter(self.currentNode.nodeID,'sector') //Heatmap tiene los mismos datos que el scatter
									.success(function(response){
										self.rawResponse.heatMap = response;
						    			var coordinates = {};
						    			self.regionPolygons = parserFactory.parseHeatMap(self.rawResponse.map,self.rawResponse.heatMap,self.regionTree,self.activeCategory);
						    			for (var i = 0; i < self.regionPolygons.length; i++) {
						    				self.regionPolygons[i].setMap(self.mapObject);
						    			}
						    			console.log("READY HeatMap databaseFactory.getScatter");
						    			self.isReady.map = true;
									});
				    		});	
	        	});
		    }
		}

	    ///////////Botonera selector de categorias   
		self.setCurrentCategory = function (category) {
			self.activeCategory = category;
			setChartTitles(self.activeCategory, self.dashboardType);
			self.scatter.setOption(parserFactory.parseScatter(self.rawResponse.scatter,self.activeCategory,self.dashboardType));
			self.treemap.setOption(parserFactory.parseTreemap(self.rawResponse.treemap,self.activeCategory));
			if (self.dashboardType == 'sector') {
				//Borra los poligonos ya dibujados
				for (var i = 0; i < self.regionPolygons.length; i++) {
					self.regionPolygons[i].setMap(null);
				}	
				//Reemplaza por los nuevos y los dibuja
				self.regionPolygons = parserFactory.parseHeatMap(self.rawResponse.map,self.rawResponse.heatMap,self.regionTree,self.activeCategory);
				for (var i = 0; i < self.regionPolygons.length; i++) {
					self.regionPolygons[i].setMap(self.mapObject);
				}
			}
			console.log("READY Category changed: "+category);
		}
		///////////Botonera selector de categorias   


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


        ////////////MAP
        //Para esconder/mostrar la escala del HeatMap
        self.isHeatMapScaleVisible = function(type){
        	if (type == 'sector') {
        		return true;
        	} else {
        		return false;
        	}
        }
        ////////////MAP


    }
})();