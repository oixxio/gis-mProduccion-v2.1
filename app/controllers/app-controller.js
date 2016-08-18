(function () {
    'use strict';
    angular.module('app.mapaprod').controller('appCtrl', appCtrl);
    function appCtrl ($location){
    	
    	var self = this;

    	//HEADER Inicializa header title
    	self.header = {};
    	self.header.title = "MAPA PRODUCTIVO FEDERAL";

		//HEADER Funcion para esconder el header cuando esta en landing
		self.hideHeader = function () {
			if($location.path() == '/'){
				return true
			}
		}

		//HEADER Funcion para setear el nombre del header desde cualquier lugar
		self.setHeaderTitle = function (newTitle) {
			self.header.title = newTitle;
		}

		//Funcion general de navegacion entre views
		self.goTo = function (data) {
			$location.path('/'+data);
		}

    }
})();