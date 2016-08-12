(function () {
    'use strict';

    angular.module('app.mapaprod').
    controller('appCtrl', ['$scope','$location','$http', '$route',
                function($scope,$location,$http, $route){


    	//HEADER Inicializa header title
    	$scope.header = {};
    	$scope.header.title = "MAPA PRODUCTIVO FEDERAL";

		//HEADER Funcion para esconder el header cuando esta en landing
		$scope.hideHeader = function () {
			if($location.path() == '/'){
				return true
			}
		}

		//Funcion general de navegacion entre views
		$scope.goTo = function(data){
			$location.path('/'+data);
		}

    }])

})();