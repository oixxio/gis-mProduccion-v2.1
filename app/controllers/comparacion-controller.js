(function () {
    'use strict';
    angular.module('app.mapaprod').controller('comparacionCtrl', comparacionCtrl);
    function comparacionCtrl ($location, linkFactory, databaseFactory, parserFactory, $mdMedia, $scope, $timeout) {

		//////////CTRL Init Code
		var self = this;
		self.nodeData = {};
		self.generalData = {};
		self.currentNode = {};
		self.dashboardType = 'region';
		self.activeCategory = 'empleo';
		self.rawResponse = {};
		self.complexA = echarts.init(document.getElementById('complexA'));
		self.treemapA = echarts.init(document.getElementById('treemapA'));
		self.scatterA = echarts.init(document.getElementById('scatterA'));
		self.complexB = echarts.init(document.getElementById('complexB'));
		self.treemapB = echarts.init(document.getElementById('treemapB'));
		self.scatterB = echarts.init(document.getElementById('scatterB'));
		self.alert= false;		
		self.mapObjectA = {};
		self.mapObjectB = {};
		initMap();

    	////////////MAPA
    	//MAP Init code
    	function initMap() {
			var styles = [{stylers: [{ saturation: -100 }]}];   
			self.mapObjectA = new GMaps({
			  el: '#mapA',
			  lat: -40.3,
			  lng: -63.7,
			  zoom: 4,
			  disableDefaultUI: true,
			  scrollwheel: false,
			  clickableIcons: false,
			  disableDoubleClickZoom: true,
			  draggable: false,
	          styles: styles
			});
			self.mapObjectB = new GMaps({
			  el: '#mapB',
			  lat: -40.3,
			  lng: -63.7,
			  zoom: 4,
			  disableDefaultUI: true,
			  scrollwheel: false,
			  clickableIcons: false,
			  disableDoubleClickZoom: true,
			  draggable: false,
	          styles: styles
			});					
    	}
        ////////////MAPA

		//////////Inicializacion de plugins JS para front (mapa y charts)
	    angular.element(document).ready(function () {
			initMap(); 
			$timeout(function(){self.setCurrentCategory('empleo');}, 100);
	    });

	    //////////Retrieve data from linkFactory
		self.dashboardType = linkFactory.getDashboardType();
		self.currentNode = linkFactory.getSelectedNode();

		//Si se quiere acceder directo al dashboard y no se hizo el path correspondiente, ni hay localstorage, redirecciona a selector
		if (self.dashboardType == null || self.currentNode == null) {
			$location.path('/selector');
		}

		//////////Populate from database
		fetchDashboardContent();

		//////////Retrieve data from database
		function fetchDashboardContent() {

			//////////SCATTER
			databaseFactory.getScatter(self.currentNode.nodeID,self.dashboardType)
				.success(function(response){
					self.rawResponse.scatter = response;
					self.scatterA.setOption(
						parserFactory.parseScatter(self.rawResponse.scatter,self.activeCategory,self.dashboardType)
					);						
					self.scatterB.setOption(
						parserFactory.parseScatter(self.rawResponse.scatter,self.activeCategory,self.dashboardType)
					);		
				});

			//////////TREEMAP
			databaseFactory.getTreemap(self.currentNode.nodeID,self.dashboardType)
				.success(function(response){
					self.rawResponse.treemap = response;
					self.treemapA.setOption(
						parserFactory.parseTreemap(self.rawResponse.treemap,self.activeCategory)
					);					
					self.treemapB.setOption(
						parserFactory.parseTreemap(self.rawResponse.treemap,self.activeCategory)
					);
				});
			
			//////////DATOS GENERALES
			databaseFactory.getGeneralData(self.currentNode.nodeID,self.dashboardType)
				.success(function(response){
					self.rawResponse.generalData = response;
					self.generalData = parserFactory.parseGeneralData(self.rawResponse.generalData);
				});
		}

    	//////////Mediaquerys para responsive 
		$scope.$watch( function() { return $mdMedia('xs'); },
			function(){
				$timeout(
					function() {
						self.complexA.resize();
						self.treemapA.resize();
						self.scatterA.resize();						
						self.mapObjectA.setCenter(-40.3,-63.7);	
						self.complexB.resize();
						self.treemapB.resize();
						self.scatterB.resize();
						self.mapObjectB.setCenter(-40.3,-63.7);			
					}, 100)
			}
		);    	
		$scope.$watch( function() { return $mdMedia('sm'); },
			function(){
				$timeout(
					function() {
						self.complexA.resize();
						self.treemapA.resize();
						self.scatterA.resize();						
						self.mapObjectA.setCenter(-40.3,-63.7);	
						self.complexB.resize();
						self.treemapB.resize();
						self.scatterB.resize();
						self.mapObjectB.setCenter(-40.3,-63.7);			
					}, 100)
			}
		);
		$scope.$watch(function() { return $mdMedia('md'); },
			function(){
				$timeout(
					function() {
						self.complexA.resize();
						self.treemapA.resize();
						self.scatterA.resize();						
						self.mapObjectA.setCenter(-40.3,-63.7);	
						self.complexB.resize();
						self.treemapB.resize();
						self.scatterB.resize();
						self.mapObjectB.setCenter(-40.3,-63.7);					
					}, 100)
			}
		); 		
		$scope.$watch( function() { return $mdMedia('landscape'); },
			function(){
				$timeout(
					function() {
						self.complexA.resize();
						self.treemapA.resize();
						self.scatterA.resize();						
						self.mapObjectA.setCenter(-40.3,-63.7);	
						self.complexB.resize();
						self.treemapB.resize();
						self.scatterB.resize();
						self.mapObjectB.setCenter(-40.3,-63.7);				
					}, 100)
			}
		);		 		            
	    
	    ///////////Botonera selector de categorias   
		self.setCurrentCategory = function (category) {
			self.activeCategory = category;
			setChartTitles(self.activeCategory, self.dashboardType);
			self.scatterA.setOption(parserFactory.parseScatter(self.rawResponse.scatter,self.activeCategory,self.dashboardType));
			self.scatterB.setOption(parserFactory.parseScatter(self.rawResponse.scatter,self.activeCategory,self.dashboardType));
			self.treemapA.setOption(parserFactory.parseTreemap(self.rawResponse.treemap,self.activeCategory));
			self.treemapB.setOption(parserFactory.parseTreemap(self.rawResponse.treemap,self.activeCategory));						
		}
		///////////Botonera selector de categorias   

		////////////DATOS GENERALES

		////////////DATOS GENERALES
		


        ////////////CHARTS
        function setChartTitles(category, type) {
        	if (type == 'region') {				
				if (category == 'empleo') {
					//self.complex.title = 'Complejidad en empleo regional';
					self.treemapA.title = self.treemapB.title = 'Participación sectorial en empleo region (2015)';
					self.scatterA.title = self.scatterB.title = 'Matriz de clasificación de region según empleo (2007-2015)';
				} else if (category == 'export') {
					//self.complex.title = 'Complejidad en exportacion regional';
					self.treemapA.title = self.treemapB.title = 'Participación sectorial en exportación region (2015)';
					self.scatterA.title = self.scatterB.title = 'Matriz de clasificación de region según exportaciones (2007-2015)';
				}
			} else if (type == 'sector') {
				if (category == 'empleo') {
					//self.complex.title = 'Complejidad en empleo sectorial';
					self.treemapA.title = self.treemapB.title = 'Participación regional en empleo sectorial (2015)';
					self.scatterA.title = self.scatterB.title = 'Matriz de clasificación de sectores según empleo (2007-2015)';
				} else if (category == 'export') {
					//self.complex.title = 'Complejidad en exportacion sectorial';
					self.treemapA.title = self.treemapB.title = 'Participación regional en exportación sectorial (2015)';
					self.scatterA.title = self.scatterB.title = 'Matriz de clasificación de sectores según exportaciones (2007-2015)';
				}				
			}
        }
        ////////////CHARTS



    }
})();