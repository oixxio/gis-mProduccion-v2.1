(function () {
    'use strict';
    angular.module('app.mapaprod').controller('fichasCtrl', fichasCtrl);
    function fichasCtrl ($window, $timeout, $scope, $location){

    	var self = this;

		$scope.$watch( 
			function() { return self.provSelected; },
			function() { 
				console.log('Selected: ' + self.provSelected);
				switch (self.provSelected) {
					case 'CABA' :                alert('Lo sentimos, esta ficha aún no está disponible.'); break;
					case 'Buenos Aires' :        alert('Lo sentimos, esta ficha aún no está disponible.'); break;
					case 'Catamarca' :           $window.open("fichas/Catamarca.pdf"); break;
					case 'Córdoba' :             alert('Lo sentimos, esta ficha aún no está disponible.'); break;
					case 'Corrientes' :          $window.open("fichas/Corrientes.pdf"); break;
					case 'Chaco' :               $window.open("fichas/Chaco.pdf"); break;
					case 'Chubut' :              alert('Lo sentimos, esta ficha aún no está disponible.'); break;
					case 'Entre Ríos' :          alert('Lo sentimos, esta ficha aún no está disponible.'); break;
					case 'Formosa' :             $window.open("fichas/Formosa.pdf"); break;
					case 'Jujuy' :               $window.open("fichas/Jujuy.pdf"); break;
					case 'La Pampa' :            alert('Lo sentimos, esta ficha aún no está disponible.'); break;
					case 'La Rioja' :            $window.open("fichas/La Rioja.pdf"); break;
					case 'Mendoza' :             $window.open("fichas/Mendoza.pdf"); break;
					case 'Misiones' :            $window.open("fichas/Misiones.pdf"); break;
					case 'Neuquén' :             $window.open("fichas/Neuquen.pdf"); break;
					case 'Río Negro' :           alert('Lo sentimos, esta ficha aún no está disponible.'); break;
					case 'Salta' :               $window.open("fichas/Salta.pdf"); break;
					case 'San Juan' :            alert('Lo sentimos, esta ficha aún no está disponible.'); break;
					case 'San Luis' :            alert('Lo sentimos, esta ficha aún no está disponible.'); break;
					case 'Santa Cruz' :          alert('Lo sentimos, esta ficha aún no está disponible.'); break;
					case 'Santa Fe' :            alert('Lo sentimos, esta ficha aún no está disponible.'); break;
					case 'Santiago del Estero' : $window.open("fichas/Santiago del Estero.pdf"); break;
					case 'Tucumán' :             $window.open("fichas/Tucuman.pdf"); break;
					case 'Tierra de Fuego' :     alert('Lo sentimos, esta ficha aún no está disponible.'); break;
				}
			}
		);		    	

    };
})();