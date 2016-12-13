(function () {
    'use strict';
    angular.module('app.mapaprod').controller('notFoundCtrl', notFoundCtrl);
    function notFoundCtrl ($window){
    	
    	$window.location.href = "http://www.produccion.gob.ar/404";

    }
})();