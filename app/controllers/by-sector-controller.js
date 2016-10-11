(function () {
    'use strict';
    angular.module('app.mapaprod').controller('bySectorCtrl', bySectorCtrl);
    function bySectorCtrl ($timeout, $scope, $location){

    	var self = this;

		$scope.$watch( 
			function() { return self.sectorSelected; },
			function() { 
				if (self.sectorSelected == true) {
		          /* el TIMEOUT es un parche para solucionar un bug que se cuelga la view despues de seleccionar un autocomplete
		    		sacada de 'https://github.com/angular/material/issues/3287'*/
			      $timeout(function(){$location.path('/dashboard')}, 10);
				}
			}
		);		    	

    };
})();