(function () {
    'use strict';
    angular.module('app.mapaprod').controller('dashboardCtrl', dashboardCtrl);
    function dashboardCtrl ($location, linkFactory, databaseFactory, parserFactory, $mdMedia, $scope) {

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

		

		//////////Inicializacion de plugins JS para front (mapa y charts)
	    angular.element(document).ready(function () {
			initMap(); 
			drawCharts();
			self.setCurrentCategory('empleo');
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
			databaseFactory.getScatter(self.currentNode.nodeID)
				.success(function(response){
					self.rawResponse.scatter = response;
					self.scatter.setOption(
						parserFactory.parseScatter(self.rawResponse.scatter,self.activeCategory,self.dashboardType)
					);		
				});

			//////////TREEMAP
			databaseFactory.getSectorTree()
				.success(function(response){
					self.rawResponse.sectorTree = response;
					databaseFactory.getTreemap(self.currentNode.nodeID)
						.success(function(response){
							self.rawResponse.treemap = response;
							self.treemap.setOption(
								parserFactory.parseTreemap(self.rawResponse.treemap,self.activeCategory)
							);
						})
				});
			
			//////////DATOS GENERALES
			databaseFactory.getGeneralData(self.currentNode.nodeID)
				.success(function(response){
					self.rawResponse.generalData = response;
					self.generalData = parserFactory.parseGeneralData(self.rawResponse.generalData);
				});
		}
		/*
        databaseFactory.getRegionAllSectorData(self.currentNode.nodeID)
        	.success(function(response){
        		self.nodeData = response;
        	});*/

    	//////////Mediaquerys para responsive 
		$scope.$watch( function() { return $mdMedia('sm'); },
			function() {
				self.complex.resize();
				self.treemap.resize();
				self.scatter.resize();
				map.setCenter(-40.3,-63.7);			
			}
		);
		$scope.$watch(function() { return $mdMedia('md'); },
			function() {
				self.complex.resize();
				self.treemap.resize();
				self.scatter.resize();
				map.setCenter(-40.3,-63.7);		
			}
		); 		            
	    
	    ///////////Botonera selector de categorias   
		self.setCurrentCategory = function (category) {
			self.activeCategory = category;
			setChartTitles(self.activeCategory, self.dashboardType);
			self.scatter.setOption(parserFactory.parseScatter(self.rawResponse.scatter,self.activeCategory,self.dashboardType));
			self.treemap.setOption(parserFactory.parseTreemap(self.rawResponse.treemap,self.activeCategory));			
		}
		///////////Botonera selector de categorias   

		////////////DATOS GENERALES

		////////////DATOS GENERALES
		
    	////////////MAPA
    	//MAP Init code
    	function initMap() {
			var styles = [{stylers: [{ saturation: -100 }]}];   
			var map = new GMaps({
			  el: '#map',
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

        ////////////CHARTS
        //Chart Init Code
        function drawCharts() {

        	//complex - Grafico de radar (RADAR)
	        
			var option1 = {
			    title : {
			    	show: false,
			        text: 'Chart 1',
			        subtext: 'Datos Generales'
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    calculable : true,
			    polar : [
			        {
			            indicator : [
			                {text : 'Ejemplo', max  : 100},
			                {text : 'Ejemplo', max  : 100},
			                {text : 'Ejemplo', max  : 100},
			                {text : 'Ejemplo', max  : 100},
			                {text : 'Ejemplo', max  : 100}
			            ],
			            radius : 160
			        }
			    ],
			    series : [
			        {
			            name: 'Datos Generales',
			            type: 'radar',
			            itemStyle: {
			                normal: {
			                    areaStyle: {
			                        type: 'default'
			                    }
			                }
			            },
			            data : [
			                {
			                    value : [97, 42, 88, 94, 30],
			                    name : 'Córdoba'
			                }		                
			            ]
			        }
			    ]
			};
        	self.complex.setOption(option1);
        }

        function setChartTitles(category, type) {
			if (type == 'region') {				
				if (category == 'empleo') {
					self.complex.title = 'Complejidad en empleo regional';
					self.treemap.title = 'Participación sectorial en empleo region (2015)';
					self.scatter.title = 'Matriz de clasificación de region según empleo (2007-2015)';
				} else if (category == 'export') {
					self.complex.title = 'Complejidad en exportacion regional';
					self.treemap.title = 'Participación sectorial en exportación region (2015)';
					self.scatter.title = 'Matriz de clasificación de region según exportaciones (2007-2015)';
				}
			} else if (type == 'sector') {
				if (category == 'empleo') {
					self.complex.title = 'Complejidad en empleo sectorial';
					self.treemap.title = 'Participación regional en empleo sectorial (2015)';
					self.scatter.title = 'Matriz de clasificación de sectores según empleo (2007-2015)';
				} else if (category == 'export') {
					self.complex.title = 'Complejidad en exportacion sectorial';
					self.treemap.title = 'Participación regional en exportación sectorial (2015)';
					self.scatter.title = 'Matriz de clasificación de sectores según exportaciones (2007-2015)';
				}				
			}
        }
        ////////////CHARTS



    }
})();