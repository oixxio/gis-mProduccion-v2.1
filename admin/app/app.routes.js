(function () {
    'use strict';
    angular.module('app.dashboard')
    .config(['$routeProvider',function($routeProvider) {
		$routeProvider.
	    when('/adminDashboard',{
			templateUrl: 'app/views/adminDashboard.html'
		}).
		when('/',{
			templateUrl: 'app/views/menuLogin.html'
		}).
		when('/initLoading',{
			templateUrl: 'app/views/initLoading.html'
		})
		.otherwise({ redirectTo: '/'})
		;
	}]);
})(); 