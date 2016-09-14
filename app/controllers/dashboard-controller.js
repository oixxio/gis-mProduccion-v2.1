(function () {
    'use strict';
    angular.module('app.mapaprod').controller('dashboardCtrl', dashboardCtrl);
    function dashboardCtrl ($location, linkFactory, databaseFactory, chartParserFactory, $mdMedia, $scope) {

		//////////CTRL Init Code
		var self = this;
		self.nodeData = {};
		self.generalData = {};
		self.currentNode = {};
		self.dashboardType = '';
		self.activeCategory = 'export';
		self.rawResponse;
		self.complex = echarts.init(document.getElementById('complex'));
		self.treemap = echarts.init(document.getElementById('treemap'));
		self.scatter = echarts.init(document.getElementById('scatter'));

		

		//////////Inicializacion de plugins JS para front (mapa y charts)
	    angular.element(document).ready(function () {
			initMap();    	
	    	initCharts();
	    });

	    //////////Retrieve data from linkFactory
		self.dashboardType = linkFactory.getDashboardType();
		self.currentNode = linkFactory.getSelectedNode();

		//Si se quiere acceder directo al dashboard y no se hizo el path correspondiente, ni hay localstorage, redirecciona a selector
		if (self.dashboardType == null || self.currentNode == null) {
			$location.path('/selector');
		}

		//////////Populate from database
		populateDashboard();

		//////////Retrieve data from database
		function populateDashboard() {
			if (self.dashboardType == 'region') {
				console.log("GET datos Scatter REGION");
				databaseFactory.getRegionScatter(self.currentNode.nodeID)
					.success(function(response){
						self.rawResponse = response;
						self.scatter.setOption(
							chartParserFactory.parseScatter(self.rawResponse,self.activeCategory,self.dashboardType)
						);
					});				
				console.log("GET datos Treemap REGION");
				console.log("GET datos Datos Generales REGION");
				databaseFactory.getRegionGeneralData(self.currentNode.nodeID)
					.success(function(response){
						self.generalData = parseGeneralData(response[0]);
					});
			} else if (self.dashboardType == 'sector') {
				console.log("GET datos Scatter SECTOR");
				console.log("GET datos Treemap SECTOR");
				console.log("GET datos Datos Generales SECTOR");
			}
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
			if (self.dashboardType == 'region') {				
				if (self.activeCategory == 'empleo') {
					self.complex.title = 'Complejidad en empleo regional';
					self.treemap.title = 'Participación sectorial en empleo region (2015)';
					self.scatter.title = 'Matriz de clasificación de region según empleo (2007-2015)';
				} else if (self.activeCategory == 'exportacion') {
					self.complex.title = 'Complejidad en exportacion regional';
					self.treemap.title = 'Participación sectorial en exportación region (2015)';
					self.scatter.title = 'Matriz de clasificación de region según exportaciones (2007-2015)';
				}
			} else if (self.dashboardType == 'sector') {
				if (self.activeCategory == 'empleo') {
					self.complex.title = 'Complejidad en empleo sectorial';
					self.treemap.title = 'Participación regional en empleo sectorial (2015)';
					self.scatter.title = 'Matriz de clasificación de sectores según empleo (2007-2015)';
				} else if (self.activeCategory == 'exportacion') {
					self.complex.title = 'Complejidad en exportacion sectorial';
					self.treemap.title = 'Participación regional en exportación sectorial (2015)';
					self.scatter.title = 'Matriz de clasificación de sectores según exportaciones (2007-2015)';
				}				
			}
			self.scatter.setOption(chartParserFactory.parseScatter(self.rawResponse,self.activeCategory,self.dashboardType));
		}
		//self.setCurrentCategory('empleo');
		///////////Botonera selector de categorias   

		////////////DATOS GENERALES
		function parseGeneralData(data) {
			data.poblacion        = parseFloat(data.poblacion).toLocaleString();
			data.poblacion_part   = parseFloat(data.poblacion_part*100).toFixed(2);
			data.pbg 			  = parseFloat(data.pbg).toLocaleString();
			data.pbg_part 		  = parseFloat(data.pbg_part*100).toFixed(2);
			data.empleo_pub 	  = parseFloat(data.empleo_pub).toLocaleString();
			data.empleo_pub_part  = parseFloat(data.empleo_pub_part*100).toFixed(2);
			data.export 	      = parseFloat(data.export).toLocaleString();
			data.export_part 	  = parseFloat(data.export_part*100).toFixed(2);
			data.export_destinos  = data.export_destinos;
			data.export_productos = data.export_productos;
			return data;
		}
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
        function initCharts() {

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
			                {text : 'Empleo', max  : 100},
			                {text : 'Exportacion', max  : 100},
			                {text : 'Salario', max  : 100},
			                {text : 'Producción', max  : 100},
			                {text : 'Empleo Público', max  : 100},
			                {text : 'Producción', max  : 100},
			                {text : 'Empleo Público', max  : 100},
			                {text : 'PBG', max  : 100}
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
			                    value : [97, 42, 88, 94, 90, 23, 51, 86],
			                    name : 'Córdoba'
			                }		                
			            ]
			        }
			    ]
			};
        	self.complex.setOption(option1);

    		//treemap - Grafico de Áreas (TREEMAP)
	        var option2 = {
			    title : {
			    	show: false,
			        text: 'Gráfico de Áreas',
			        subtext: 'Participación de Empleo Provincial'
			    },
	            tooltip : {
	                trigger: 'item',
	                showDelay: 0,
	                hideDelay: 0,
	                x: 'center',
	                zlevel: 8,
	                formatter: "{b}: {c}%",
	                enterable: true
	            },
			    //calculable : false,
			    hoverable : true,
			    series : [
			        {
			            name:'Volver a Empleo Nacional',
			            type:'treemap',
	                    itemStyle: {
	                        normal: {
	                            label: {
	                                show: true,
	                                position:'outer',
	                                formatter: "{b}: {c}%"
	                            },                            
	                            borderWidth: 1
	                        },
	                        emphasis: {
	                        	label: {
	                                show: true
	                            },
                                color: 'transparent',
                                borderWidth: 3,
								borderColor: '#bbbbff'
	                        }
	                    },
			            data:[
			                {
			                    name: 'Produccion de madera y fabricacion',
			                    value: 8,
			                    children: [
			                        {
			                            name: 'Galaxy S4',
			                            value: 2
			                        },
			                        {
			                            name: 'Galaxy S5',
			                            value: 0
			                        },
			                        {
			                            name: 'Galaxy S6',
			                            value: 3
			                        },
			                        {
			                            name: 'Galaxy Tab',
			                            value: 1
			                        }
			                    ]
			                },
			                {
			                    name: 'Produccion de madera y fabricacion de productos de madera y corcho excepto muebles',
			                    value: 6,
			                    children: [
			                        {
			                            name: 'S4',
			                            value: 6
			                        },
			                        {
			                            name: 'note 3',
			                            value: 6
			                        },
			                        {
			                            name: 'S5',
			                            value: 4
			                        },
			                        {
			                            name: 'S6',
			                            value: 3
			                        }
			                    ]
			                }
			            ]
			        }
			    ]
			};                    	
        	self.treemap.setOption(option2);

        	//scatter - Gráfico de dispersión (SCATTER)

        }
        ////////////CHARTS



    }
})();