(function () {
    'use strict';

    angular.module('app.dashboard').
    factory('devAppInfoFactory', ['$http', function($http){
    	var AppInfo = {};

        AppInfo.setLoggedUser = function (data) {
            AppInfo = data;
        }

        AppInfo.getLoggedUser = function () {
            return AppInfo;
        }        
    	
    	return AppInfo;
    }]);

})();