(function () {
    'use strict';
    angular.module('app.mapaprod').controller('landingCtrl', landingCtrl);
    function landingCtrl ($http, $window) {

		var self = this;

        self.buttonDescription = "El Mapa Productivo Federal es una plataforma que contiene información socioeconómica georreferenciada a nivel territorial y sectorial.";

        self.sendMail = function (mail) {
			 $http.post('https://formspree.io/gpsproduc@gmail.com',mail)
			 	.success(function () {
			 	 	$window.alert("Muchas gracias por tu opinion, tu mensaje a sido enviado.");
			 	 });
        }
        
    }
})();