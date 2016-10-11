(function () {
    'use strict';
    angular.module('app.mapaprod').controller('sectorSelectorCtrl', sectorSelectorCtrl);
    function sectorSelectorCtrl (linkFactory, databaseFactory, $log, $timeout, $location){

    	var self = this;

    	self.done = false;
    	self.selectedNode = {};
    	self.currentSector = {nodeID:"0", nodeName:"Producción", parentID:"0", depth:"0"};
    	self.selectedNode.depth = "División";
    	self.hoveredName = "";
    	self.nodePath = [];

    	//Obtiene el sectorTree de la base de datos
		databaseFactory.getSectorTree().success(function(response){
			self.sectorTree = response;
		});

		//Llama a la link factory y cambia de view
		self.setSector = function(selectedSector){
			$log.info('Item selected: ' + JSON.stringify(selectedSector));
			linkFactory.setSelectedNode(selectedSector,self.identifier);
			linkFactory.setDashboardType('sector');
			self.done = true;
		}

		//Esta funcion se llama cuando se selecciona un nodo de sector determinado. Se actualiza el 'nodo actualmente seleccionado'
		self.selectSector = function(selectedSector){

			//Se actualiza el hoveredName y el nodePath
			self.hoveredName = "";
			self.nodePath = getNodePath(selectedSector,self.sectorTree);
			//Si es un leaf node pasa de view, sino, sigue profundizando en el sectorTree
			for (var i = 0; i < self.sectorTree.length; i++) {
				if (selectedSector.nodeID === self.sectorTree[i].parentID) {
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
			self.setSector(selectedSector);
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
			nodePath[0] = node;

			while(nodes[i] != -1) {			
				nodes[i+1] = getNodeById(nodes[i].parentID, arrayTree);
				nodePath[i+1] = nodes[i+1];
				i++;
			}
			nodePath.pop();
			return nodePath.reverse();
		}

    };
})();