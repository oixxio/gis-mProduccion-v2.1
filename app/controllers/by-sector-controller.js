(function () {
    'use strict';

    angular.module('app.mapaprod').
    controller('bySectorCtrl', ['$scope','$location','$http','databaseFactory',
                function($scope,$location,$http,databaseFactory){

    	//INIT code
    	$scope.selectedNode = {};
    	$scope.currentSector = {nodeID:"0", nodeName:"Producción", parentID:"0", depth:"0"};
    	$scope.selectedNode.depth = "División";
    	$scope.hoveredName = "";

    	//Obtiene el sectorTree de la base de datos
		databaseFactory.getSectorTree().success(function(response){
			$scope.sectorTree = response;
		});

		//Esta funcion se llama cuando se selecciona un nodo de sector determinado. Se actualiza el 'nodo actualmente seleccionado'
		$scope.selectSector = function(selectedSector) {

			$scope.hoveredName = "";
			$scope.nodePath = getNodePath(selectedSector,$scope.sectorTree);

			//Si es un leaf node pasa de view, sino, sigue profundizando en el sectorTree
			for (var i = 0; i < $scope.sectorTree.length; i++) {
				if (selectedSector.nodeID == $scope.sectorTree[i].parentID) {
					switch (selectedSector.depth) {
						case '1': 
							$scope.selectedNode.depth = "Sector"
						 	break;
						case '2':
							$scope.selectedNode.depth = "Rama"
							break; 
						case '3':
							$scope.selectedNode.depth = "Actividad"
							break;
					}
					return $scope.currentSector = selectedSector;
				}
			}

			//TODO aca tiene que pasar de view y enviar el dato a la LINK factory
			$scope.currentSector = {nodeID:'0', nodeName:'Producción', parentID:'0', depth:'0'}; //TODO RESET
			$scope.selectedNode.depth = "División"; //TODO
			$scope.nodePath = []; //TODO RESET
		}

		//Funcion para actualizar el nombre en mouseover del sector
		$scope.mouseOverSector = function(hoveredSector) {
			$scope.hoveredName = hoveredSector.nodeName;
		}

		function getNodeById(id, arrayTree) {
			for (var i = 0; i < arrayTree.length; i++) {
				if (arrayTree[i].nodeID == id) {
					return arrayTree[i];
				}
			}
			return -1; //Si no lo encuentra, retorna '-1'
		}

		//Devuelve todo el path jerarquico para un nodo correspondiente en forma de array de strings ['ancestor','parent','child','grandchild']
		function getNodePath(node, arrayTree) {

			//INIT
			var nodePath = [];
			var nodes = [];
			var i = 0;
			nodes[0] = node;
			nodePath[0] = node.nodeName;

			while(nodes[i] != -1) {			
				nodes[i+1] = getNodeById(nodes[i].parentID, arrayTree);
				nodePath[i+1] = nodes[i+1].nodeName;
				i++;
			}
			nodePath.pop();
			return nodePath.reverse();
		}

    }])
})();