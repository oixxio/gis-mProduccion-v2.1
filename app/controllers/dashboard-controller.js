(function () {
    'use strict';
    angular.module('app.mapaprod').controller('dashboardCtrl', dashboardCtrl);
    function dashboardCtrl (linkFactory, databaseFactory, $mdMedia, $timeout, $scope) {

		var self = this;

		$scope.chart = {};

		//CTRL Init Code
		self.nodeData = {};
		self.currentNode = {};
		self.currentNode.nodeID = 1;

		//Retrieve data from database
		//self.currentNode = linkFactory.getSelectedNode();
        databaseFactory.getGeoAllSectorData(self.currentNode.nodeID)
        	.success(function(response){
        		self.nodeData = response;
        		console.log(self.nodeData);
        	});

    	////////////MAPA
    	//MAP Init code
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
		//cambia el zoom para tamaño 'xs'
		//TODO meter watcher
        if ($mdMedia('sm')) {
        	
        }
        ////////////MAPA

        ////////////CHARTS
        self.chart1 = echarts.init(document.getElementById('chart1')); 
        self.chart2 = echarts.init(document.getElementById('chart2')); 
        self.chart3 = echarts.init(document.getElementById('chart3')); 


		$scope.$watch(function() { return $mdMedia('sm'); }, function() {
			$timeout(
				function(){
						self.chart1.resize();
						self.chart2.resize();
						self.chart3.resize();
						map.setOptions({
							lat: -40.3,
							lng: -63.7,
							zoom: 3
						});						
				},200);
		});

		$scope.$watch(function() { return $mdMedia('md'); }, function() {
			$timeout(
				function(){
						self.chart1.resize();
						self.chart2.resize();
						self.chart3.resize();
						map.setOptions({
							lat: -40.3,
							lng: -63.7,
							zoom: 4
						});						
				},200);
		}); 		            

        //Timeout para esperar a que se cargue la fuente
		$timeout(function(){loadCharts()}, 200);        
        ////////////CHARTS


        function loadCharts() {
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
        	self.chart1.setOption(option1);
                     	
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
			                            value: 3
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
        	self.chart2.setOption(option2);

			var option3 = {
				title : {
					show: false,
			        text: 'Gráfico de Dispersión',
			        subtext: 'Empleo'
			    },
			    tooltip : {
	                trigger: 'axis',
	                showDelay : 0,
	                formatter : function (params) {
	                    if (params.value.length > 1) {
	                        return params.name + '<br/>'
	                           + params.value[0] + '% ' 
	                           + params.value[1]+'%';
	                    }
	                    else {
	                        return params.seriesName + '<br/>'
	                           + params.name + ' : '
	                           + params.value + '%';
	                    }
	                },                
	                axisPointer:{
	                    show: true,
	                    type : 'cross',
	                    lineStyle: {
	                        type : 'dashed',
	                        width : 1
	                    }
	                }
	            },
			    xAxis : [
			        {
			            type : 'value',
			            splitNumber: 4,
			            scale: true,
			            min: -100,
			            max: 100,
				        axisLabel : {
	                        formatter: '{value} %'
	                    }    
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value',
			            splitNumber: 4,
			            scale: true,
			            min: -100,
			            max: 100,
			            axisLabel : {
	                        formatter: '{value} %'
	                    }   
			        }
			    ],
			    series : [
			        {
			            name:'scatter1', 
			            type:'scatter',
			            symbolSize: function (value){
			                return Math.round(value[2] / 5);
			            },
			            data: [
			            		{
							        name: 'Tucumán',
							        value : [1,1,100],
							        itemStyle:{
							        	normal: {
							        		color: '#FF00ff'
							        	}
							        }
							    },
			            		{
							        name: 'Córdoba',
							        value : [19,23,230],
							        itemStyle:{
							        	normal: {
							        		color: '#ffFF00'
							        	}
							        }
							    }]
			        },
			    ]
			};
        	self.chart3.setOption(option3);
        }


    }
})();