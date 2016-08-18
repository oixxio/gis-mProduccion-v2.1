(function () {
    'use strict';
    angular.module('app.mapaprod').controller('bySectorCtrl', bySectorCtrl);
    function bySectorCtrl (linkFactory, databaseFactory){

    	var self = this;

    	self.selectedNode = {};
    	self.currentSector = {nodeID:"0", nodeName:"Producción", parentID:"0", depth:"0"};
    	self.selectedNode.depth = "División";
    	self.hoveredName = "";

    	//Obtiene el sectorTree de la base de datos
		databaseFactory.getSectorTree().success(function(response){
			self.sectorTree = response;
		});

		//Esta funcion se llama cuando se selecciona un nodo de sector determinado. Se actualiza el 'nodo actualmente seleccionado'
		self.selectSector = function(selectedSector) {

			self.hoveredName = "";
			self.nodePath = getNodePath(selectedSector,self.sectorTree);

			//Si es un leaf node pasa de view, sino, sigue profundizando en el sectorTree
			for (var i = 0; i < self.sectorTree.length; i++) {
				if (selectedSector.nodeID == self.sectorTree[i].parentID) {
					switch (selectedSector.depth) {
						case '1': 
							self.selectedNode.depth = "Sector"
						 	break;
						case '2':
							self.selectedNode.depth = "Rama"
							break; 
						case '3':
							self.selectedNode.depth = "Actividad"
							break;
					}
					return self.currentSector = selectedSector;
				}
			}

			//TODO aca tiene que pasar de view y enviar el dato a la LINK factory
			self.currentSector = {nodeID:'0', nodeName:'Producción', parentID:'0', depth:'0'}; //TODO RESET
			self.selectedNode.depth = "División"; //TODO
			self.nodePath = []; //TODO RESET
			self.goTo('');
		}

		//Funcion para actualizar el nombre en mouseover del sector
		self.mouseOverSector = function(hoveredSector) {
			self.hoveredName = hoveredSector.nodeName;
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

    };
})();