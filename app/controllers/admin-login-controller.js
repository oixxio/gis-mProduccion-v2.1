(function () {
    'use strict';
    angular.module('app.mapaprod').controller('adminLoginCtrl', adminLoginCtrl);
    function adminLoginCtrl (databaseFactory,$location){

    	var self = this;
    	self.mail = '';
    	self.pass = '';

    	self.login = function () {
    		databaseFactory.login(self.mail, self.pass)
    			.success(function(response){
    				console.log(response);
    				if (response == 'logged OK') {
    					sessionStorage.setItem('isLogged',response)
    					$location.path('/adminGraficos');
    				} else {
    					alert('Usuario/Contraseña Incorrectos');
    				}
    			})
    	}

    };
})();