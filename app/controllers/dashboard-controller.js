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

	    var option = {
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
	                "data":[5, 20, 40, 10, 10, 20]
	            }
	        ]
	    };
	    self.chart1.setOption(option);
	    self.chart2.setOption(option);
	    self.chart3.setOption(option);  
	    self.chart4.setOption(option);
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
        	self.chart2.setOption(option1);
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
        	self.chart3.setOption(option1);
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
        	self.chart4.setOption(option1);
        }

        $interval(reload, 300, 0);

    }
})();