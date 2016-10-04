(function () {
    'use strict';
    angular.module('app.mapaprod').controller('dashboardCtrl', dashboardCtrl);
    function dashboardCtrl ($location, linkFactory, databaseFactory, parserFactory, $mdMedia, $scope, $timeout) {

		//////////CTRL Init Code
		var self = this;
		self.nodeData = {};
		self.generalData = {};
		self.currentNode = {};
		self.dashboardType = 'region';
		self.activeCategory = 'empleo';
		self.rawResponse = {};
		self.complex = echarts.init(document.getElementById('complex'));
		self.treemap = echarts.init(document.getElementById('treemap'));
		self.scatter = echarts.init(document.getElementById('scatter'));
		self.mapObject = {};



		//////////Inicializacion de plugins JS para front (mapa y charts)
	    angular.element(document).ready(function () {
			initMap(); 
			fetchDashboardContent();
			$timeout(function(){self.setCurrentCategory('empleo');}, 100);
	    });

	    //////////Retrieve data from linkFactory
		self.dashboardType = linkFactory.getDashboardType();
		self.currentNode = linkFactory.getSelectedNode();

		//Si se quiere acceder directo al dashboard y no se hizo el path correspondiente, ni hay localstorage, redirecciona a selector
		if (self.dashboardType == null || self.currentNode == null) {
			$location.path('/selector');
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
				//scrollwheel: false,
				clickableIcons: false,
				//disableDoubleClickZoom: true,
				//draggable: false,
				styles: styles,
				mapTypeId: google.maps.MapTypeId.ROADMAP
	        };

	        self.mapObject = new google.maps.Map(document.getElementById('map'),
	            myOptions);
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
				});

			//////////TREEMAP
			databaseFactory.getTreemap(self.currentNode.nodeID,self.dashboardType)
				.success(function(response){
					self.rawResponse.treemap = response;
					self.treemap.setOption(
						parserFactory.parseTreemap(self.rawResponse.treemap,self.activeCategory)
					);
				});
			
			//////////DATOS GENERALES
			databaseFactory.getGeneralData(self.currentNode.nodeID,self.dashboardType)
				.success(function(response){
					self.rawResponse.generalData = response;
					self.generalData = parserFactory.parseGeneralData(self.rawResponse.generalData);
				});

	        ////////////MAPA
	        if (self.dashboardType == 'region') {
		        databaseFactory.getMapData([self.currentNode.kmlID], self.currentNode.depth)
		        	.success(function(response){
		    			self.rawResponse.map = response;

		    			var regions = [];
		    			var coordinates = {};
		    			regions = parserFactory.parseMap(self.rawResponse.map,self.activeCategory,self.dashboardType);

		    			//Auto-zoom y posicionamiento
		    			coordinates = regions[0].getPath().getArray();
	    				var latlngbounds = new google.maps.LatLngBounds();
		    			for (var i = 0; i < regions.length; i++) {
		    				coordinates = regions[i].getPath().getArray();
		    				for (var i = 0; i < coordinates.length; i++) {
		    					latlngbounds.extend(coordinates[i]);
		    				}
		    			}
	    				self.mapObject.fitBounds(latlngbounds);

		    			for (var i = 0; i < regions.length; i++) {
		    				regions[i].setMap(self.mapObject);
		    			}
		    		});	
		    } else if (self.dashboardType == 'sector') {
		    	//alcuar
		    	databaseFactory.getMapData([self.currentNode.kmlID], self.currentNode.depth)
		        	.success(function(response){
		    			self.rawResponse.map = response;

		    			var regions = [];
		    			var coordinates = {};
		    			regions = parserFactory.parseMap(self.rawResponse.map,self.activeCategory,self.dashboardType);

		    			//Auto-zoom y posicionamiento

		    			for (var i = 0; i < regions.length; i++) {
		    				regions[i].setMap(self.mapObject);
		    			}
		    		});	
		    }
		}

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
				}, 100)
		}		 		            
	    //////////Mediaquerys para responsive 


	    ///////////Botonera selector de categorias   
		self.setCurrentCategory = function (category) {
			self.activeCategory = category;
			setChartTitles(self.activeCategory, self.dashboardType);
			self.scatter.setOption(parserFactory.parseScatter(self.rawResponse.scatter,self.activeCategory,self.dashboardType));
			self.treemap.setOption(parserFactory.parseTreemap(self.rawResponse.treemap,self.activeCategory));			
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



    }
})();