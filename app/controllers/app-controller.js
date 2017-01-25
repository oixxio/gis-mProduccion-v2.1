(function () {
    'use strict';
    angular.module('app.mapaprod').controller('appCtrl', appCtrl);
    function appCtrl ($location, $timeout, linkFactory, $scope){
    	
    	var self = this;

    	//HEADER Inicializa header title
    	self.header = {};
    	self.header.title = "GPS DE ECONOMÍAS REGIONALES";

    	self.goToArgentinaDashboard = function() {
			//CODIGO PARA SALTEAR EL BUSCADOR E IR DERECHO AL DASHBOARD DE ARGENTINA
			linkFactory.setSelectedNode(
							{"nodeID":"0","nodeName":"Argentina","parentID":"-1","depth":"0","kmlID":"1000000","color":"8080FF","value":"argentina","path":"Argentina","depthName":"A"},
							'dash');
			linkFactory.setDashboardType('region');
			console.log("paso");
			$timeout(function(){$location.path('/dashboard')}, 10);    		
    	}


		//HEADER Funcion para esconder el header cuando esta en landing
		self.hideHeader = function () {
			if($location.path() == '/' || $location.path() == '/contactUs' || $location.path() == '/adminLogin' || $location.path() == '/adminGraficos' || $location.path() == '/adminRegiones' || $location.path() == '/adminSectores'){
				return true
			}

		}

		//Funcion general de navegacion entre views
		self.goTo = function (data) {
			$location.path('/'+data);
		}

    }
})();