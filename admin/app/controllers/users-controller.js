(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('userController', ['$scope','$location','$http','$resource', '$window','dataFactory',
    			function($scope,$location,$http,$resource,$window,dataFactory){
        /*Obtengo todos los proyectos con sus clientes y devs*/
        var applications = dataFactory.getApplications();
        $scope.users = dataFactory.getUsers()
        
        for (var i = 0; i < applications.length; i++) {
        	
        }

    }])
})();