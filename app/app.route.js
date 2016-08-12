(function () {
    'use strict';
    angular.module('app.mapaprod')
    .config(['$routeProvider',function($routeProvider) {
		$routeProvider
			.when('/',{ templateUrl: 'app/views/landing.html', controller: 'landingCtrl'})
			.when('/fichas',{ templateUrl: 'app/views/fichas.html', controller: 'landingCtrl'})
			.when('/selector',{ templateUrl: 'app/views/select.html', controller: 'landingCtrl'})
			.when('/porRegion',{ templateUrl: 'app/views/by-region.html', controller: 'byRegionCtrl'})
			.when('/porSector',{ templateUrl: 'app/views/by-sector.html', controller: 'bySectorCtrl'})
			.otherwise({ redirectTo: '/404'});
	}]);
})();