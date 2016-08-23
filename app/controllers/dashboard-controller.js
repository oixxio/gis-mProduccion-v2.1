(function () {
    'use strict';
    angular.module('app.mapaprod').controller('dashboardCtrl', dashboardCtrl);
    function dashboardCtrl (linkFactory, databaseFactory, $mdMedia, $interval) {

		var self = this;

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
        if ($mdMedia('xs')) {
        	map.setOptions({
        		zoom:3
        	});
        }
        ////////////MAPA

        ////////////CHARTS
        self.chart1 = echarts.init(document.getElementById('chart1'));
        self.chart2 = echarts.init(document.getElementById('chart2')); 
        self.chart3 = echarts.init(document.getElementById('chart3')); 
        self.chart4 = echarts.init(document.getElementById('chart4')); 

        reload();
        ////////////CHARTS




        function reload() {
		    var option1 = {
		        tooltip: {
		            show: true
		        },
		        legend: {
		            data:['Sales']
		        },
		        xAxis : [
		            {
		                type : 'category',
		                data : ["Shirts", "Sweaters", "Chiffon Shirts", "Pants", "High Heels", "Socks"]
		            }
		        ],
		        yAxis : [
		            {
		                type : 'value'
		            }
		        ],
		        series : [
		            {
		                "name":"Sales",
		                "type":"bar",
		                "data":[Math.random()*100, Math.random()*100, Math.random()*100, Math.random()*100, Math.random()*100, Math.random()*100]
		            }
		        ]
		    };        	
        	self.chart1.setOption(option1);
			var option2 = {
			    title : {
			        text: 'Chart 1',
			        subtext: 'Datos Generales'
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    legend: {
			        x : 'center',
			        data:['Córdoba']
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
			                    value : [97, 42, 88, 94, 90, 86],
			                    name : 'Córdoba'
			                }		                
			            ]
			        }
			    ]
			};
        	self.chart2.setOption(option2);
                     	
			var option3 = {
			    title : {
			        text: 'Gráfico de Áreas',
			        subtext: 'Participación de Empleo Provincial'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{b}: {c}"
			    },
			    calculable : false,
			    series : [
			        {
			            name:'手机占有率',
			            type:'treemap',
			            itemStyle: {
			                normal: {
			                    label: {
			                        show: true,
			                        formatter: "{b}"
			                    },
			                    borderWidth: 1,
			                    borderColor: '#ccc'
			                },
			                emphasis: {
			                    label: {
			                        show: true
			                    },
			                    color: '#cc99cc',
			                    borderWidth: 3,
			                    borderColor: '#996699'
			                }
			            },
			            data:[
			                {
			                    name: '三星',
			                    itemStyle: {
			                        normal: {
			                            color: '#99cccc',
			                        }
			                    },
			                    value: 6,
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
			                    name: '小米',
			                    itemStyle: {
			                        normal: {
			                            color: '#99ccff',
			                        }
			                    },
			                    value: 4,
			                    children: [
			                        {
			                            name: '小米3',
			                            value: 6
			                        },
			                        {
			                            name: '小米4',
			                            value: 6
			                        },
			                        {
			                            name: '红米',
			                            value: 4
			                        }
			                    ]
			                },
			                {
			                    name: '苹果',
			                    itemStyle: {
			                        normal: {
			                            color: '#9999cc',
			                        }
			                    },
			                    value: 4,
			                    children: [
			                        {
			                            name: 'iPhone 5s',
			                            value: 6
			                        },
			                        {
			                            name: 'iPhone 6',
			                            value: 3
			                        },
			                        {
			                            name: 'iPhone 6+',
			                            value: 3
			                        }
			                    ]
			                },
			                {
			                    name: '魅族',
			                    itemStyle: {
			                        normal: {
			                            color: '#ccff99',
			                        }
			                    },
			                    value: 1,
			                    children: [
			                        {
			                            name: 'MX4',
			                            itemStyle: {
			                                normal: {
			                                    color: '#ccccff',
			                                }
			                            },
			                            value: 6
			                        },
			                        {
			                            name: 'MX3',
			                            itemStyle: {
			                                normal: {
			                                    color: '#99ccff',
			                                }
			                            },
			                            value: 6
			                        },
			                        {
			                            name: '魅蓝note',
			                            itemStyle: {
			                                normal: {
			                                    color: '#9999cc',
			                                }
			                            },
			                            value: 4
			                        },
			                        {
			                            name: 'MX4 pro',
			                            itemStyle: {
			                                normal: {
			                                    color: '#99cccc',
			                                }
			                            },
			                            value: 3
			                        }
			                    ]
			                },
			                {
			                    name: '华为',
			                    itemStyle: {
			                        normal: {
			                            color: '#ccffcc',
			                        }
			                    },
			                    value: 2
			                },
			                {
			                    name: '联想',
			                    itemStyle: {
			                        normal: {
			                            color: '#ccccff',
			                        }
			                    },
			                    value: 2
			                },
			                {
			                    name: '中兴',
			                    itemStyle: {
			                        normal: {
			                            color: '#ffffcc',
			                        }
			                    },
			                    value: 1,
			                    children: [
			                        {
			                            name: 'V5',
			                            value: 16
			                        },
			                        {
			                            name: '努比亚',
			                            value: 6
			                        },
			                        {
			                            name: '功能机',
			                            value: 4
			                        },
			                        {
			                            name: '青漾',
			                            value: 4
			                        },
			                        {
			                            name: '星星',
			                            value: 4
			                        },
			                        {
			                            name: '儿童机',
			                            value: 1
			                        }
			                    ]
			                }
			            ]
			        }
			    ]
			};                    	
        	self.chart3.setOption(option3);

			var option4 = {
				title : {
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
                    textStyle: {
                    	color: '#00F0FF',
                    	fontSize: 16,
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
			            max: 100
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value',
			            splitNumber: 4,
			            scale: true,
			            min: -100,
			            max: 100
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
							        		color: '#aaaaff'
							        	}
							        }
							    },
			            		{
							        name: 'Córdoba',
							        value : [19,23,230],
							        itemStyle:{
							        	normal: {
							        		color: '#ffaaaa'
							        	}
							        }
							    }]
			        },
			    ]
			};
        	self.chart4.setOption(option4);
        }


    }
})();