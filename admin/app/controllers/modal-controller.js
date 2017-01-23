(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('modalController', [
        '$scope','$location','loginFactory','$http','$rootScope','databaseFactory','linkFactory','$uibModal','$uibModalInstance',
    	function($scope,$location,loginFactory,$http,$rootScope,databaseFactory,linkFactory,$uibModal,$uibModalInstance){

    	$scope.eDG = linkFactory.getModalDG()[0];
    	$scope.eT = linkFactory.getModalT()[0];
    	$scope.eS = linkFactory.getModalS()[0];
    	$scope.nodeName = linkFactory.getNodeName();
    	$scope.saveDG = function(){
    		console.log($scope.eDG)
    		databaseFactory.updateGeneralData($scope.eDG,'region').then(function(response){
    			console.log(response.data)
    			if (response.data == "200") {
                    databaseFactory.logEvent(sessionStorage.getItem("userName"),'change DG')
    				alert("Cambios registrados correctamente")
    			}
    		});
    	}
    	$scope.saveT = function(){
    		console.log($scope.eT)
    		databaseFactory.updateTreemap($scope.eT,'region').then(function(response){
    			console.log(response)
    			if (response.data == "200") {
                    databaseFactory.logEvent(sessionStorage.getItem("userName"),'change T')
    				alert("Cambios registrados correctamente")
    			}
    		});
    	}
    	$scope.saveS = function(){
    		console.log($scope.eDG)
    		databaseFactory.updateScatter($scope.eS,'region').then(function(response){
    			console.log(response)
    			if (response.data == "200") {
                    databaseFactory.logEvent(sessionStorage.getItem("userName"),'change S')
    				alert("Cambios registrados correctamente")
    			}
    		});
    	}
    	$scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		  };
    }])

})();