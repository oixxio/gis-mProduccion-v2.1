(function () {
    'use strict';
    angular.module('app.mapaprod').controller('sectorSelectorCtrl', sectorSelectorCtrl);
    function sectorSelectorCtrl (linkFactory, databaseFactory, $log, $mdMedia, common, $timeout, $scope, $location, $window){

    	var self = this;

    	self.done = false;
    	self.selectedNode = {};
    	self.currentSector = {nodeID:"0", nodeName:"Producción", parentID:"0", depth:"0"};
    	self.selectedNode.depth = "División"; 
    	self.hoveredName = "";
    	self.nodePath = [];
    	self.selectedNode = {};  
		self.selectedNode.depth = "División";
		
		var parsedTree = [];
		var treeb;  

    	initLayout(); //Inicializa el tamaño

    	//Obtiene el sectorTree de la base de datos
		databaseFactory.getSectorTree().success(function(response){
			self.sectorTree = response;
		});

		//Llama a la link factory y cambia de view
		self.setSector = function(selectedSector){
			console.log(selectedSector);
			$log.info('Item selected: ' + JSON.stringify(selectedSector));
			linkFactory.setSelectedNode(selectedSector,self.identifier);
			linkFactory.setDashboardType('sector');
			self.done = true;
		}

		//Esta funcion se llama cuando se selecciona un nodo de sector determinado. Se actualiza el 'nodo actualmente seleccionado'
		self.selectSector = function(selectedSector){
			console.log(selectedSector);	
			//Se actualiza el hoveredName y el nodePath
			self.hoveredName = "";
			self.nodePath = common.getNodePath(selectedSector,self.sectorTree);
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

		function initLayout() {
			if (self.layoutMode == 'compact') {
				self.buttonSize = 100;
				self.wrapperSize = 100;
				self.wrapperOffsetSize = 0;
			}
			else { //Normal layout-mode
				if ($mdMedia('gt-sm')) {
					self.buttonSize = 30;
					self.wrapperSize = 90;
					self.wrapperOffsetSize = 5;
				}
				else {
					self.buttonSize = 100;
					self.wrapperSize = 100;
					self.wrapperOffsetSize = 0;
				}
			}
		}			


		//Obtiene el sectorTree de la base de datos
		databaseFactory.getSectorTree().success(function(response){
			self.sectorTree = response; 
			console.log(response);

			treeb = angular.copy(self.sectorTree);
	        var map = {};
	        var node = {};
	        for (var i = 0; i < treeb.length; i += 1) {
	            node = treeb[i];
	            node.children = [];
	            node.label = node.nodeName + "  ";  //node.child_id + " - " +
	            node.ref = node.nodeName;
	            delete node.nodeName;
	            map[node.nodeID] = i; // use map to look-up the parents
	            if (node.parentID != "0") {
	                treeb[map[node.parentID]].children.push(node);
	            } else {
	                parsedTree.push(node);
	            }
	        }
	        self.doneSC = true;
	         $scope.my_data = parsedTree; 
		});


	    var apple_selected, tree, treedata_avm, treedata_geography;
	    
	    $scope.my_tree_handler = function(branch) {
	    console.log("response");
	      var _ref;
	      $scope.output = "You selected: " + branch.label;
	      if ((_ref = branch.data) != null ? _ref.description : void 0) {
	        return $scope.output += '(' + branch.data.description + ')';
	      }
	      self.setSector(branch);
	    };

	    apple_selected = function(branch) {
	      return $scope.output = "APPLE! : " + branch.label;
	    };

	    $scope.my_data = parsedTree; //treedata_avm;
	    console.log(parsedTree);

	    $scope.my_tree = tree = {};


	    //Llama a la link factory y cambia de view
		self.setSector = function(selectedSector){
			var aux = {};
			aux.child_id = selectedSector.child_id ;
			aux.color = selectedSector.color ;
			aux.depth = selectedSector.depth ;
			aux.nodeID = selectedSector.nodeID ;
			aux.nodeName = selectedSector.ref ;
			aux.parentID = selectedSector.parentID ;
			aux.parent_id = selectedSector.parent_id ;
			$log.info('Item selected: ' + JSON.stringify(aux));
			linkFactory.setSelectedNode(aux,'dash');
			linkFactory.setDashboardType('sector');
			self.done = true;
		}	

    };
})();