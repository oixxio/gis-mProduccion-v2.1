(function () {
    'use strict';

    angular.module('app.dashboard', [
    	'ngRoute',
    	'ngResource',
    	'ngMaterial'
    	]).
    config(function($mdThemingProvider){
    	$mdThemingProvider.theme('default')
            .primaryPalette('indigo')
    })


})();
