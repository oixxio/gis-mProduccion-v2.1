(function () {
    'use strict';

    angular.module('app.dashboard').
    factory('loginFactory', ['$http', function($http){
    	var login = {};

        login.setLoggedUser = function (data) {
            login = data;
        }

        login.getLoggedUser = function () {
            return login;
        }        
    	
        login.userRole = function () {
    		var role = 'admin'; 
    		return  role
    	}

        login.get = function(userData){
            return $http.post('api/login.php',userData);
        }
    	return login;
    }]);

})();