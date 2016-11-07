(function () {
    'use strict';
    angular.module('app.mapaprod')
    .config(['$routeProvider',function($routeProvider) {
		$routeProvider
			.when('/',{ templateUrl: 'app/views/landing.html', controller: 'landingCtrl as LC'})
			.when('/fichas',{ templateUrl: 'app/views/fichas.html', controller: 'fichasCtrl as FC'})
			.when('/selector',{ templateUrl: 'app/views/select.html'})
			.when('/porRegion',{ templateUrl: 'app/views/by-region.html', controller: 'byRegionCtrl as bRC'})
			.when('/porSector',{ templateUrl: 'app/views/by-sector.html', controller: 'bySectorCtrl as bSC'})
			.when('/dashboard',{ templateUrl: 'app/views/dashboard.html', controller: 'dashboardCtrl as DC'})
			.when('/comparacion',{ templateUrl: 'app/views/comparacion.html', controller: 'comparacionCtrl as CC'})
			.when('/adminGraficos',{ templateUrl: 'app/views/adminGraficos.html', controller: 'adminGraficosCtrl as AGC'})
			.when('/adminRegiones',{ templateUrl: 'app/views/adminRegiones.html', controller: 'adminRegionesCtrl as ARC'})
			.when('/adminSectores',{ templateUrl: 'app/views/adminSectores.html', controller: 'adminSectoresCtrl as ASC'})
			.when('/adminLogin',{ templateUrl: 'app/views/adminLogin.html', controller: 'adminLoginCtrl as ALC'})
			.otherwise({ redirectTo: '/404'});
	}]);
})();