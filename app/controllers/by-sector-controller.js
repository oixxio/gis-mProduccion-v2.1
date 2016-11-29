(function () {
    'use strict';
    angular.module('app.mapaprod').controller('bySectorCtrl', bySectorCtrl);
    function bySectorCtrl ($timeout, $scope, $location, linkFactory, databaseFactory,$log, $mdMedia, common){

    	var self = this;

		self.done = false;
    	self.selectedNode = {};
		self.selectedNode.depth = "División";


		$scope.$watch( 
			function() { return self.sectorSelected; },
			function() { 
				if (self.sectorSelected == true) {
		          /* el TIMEOUT es un parche para solucionar un bug que se cuelga la view despues de seleccionar un autocomplete
		    		sacada de 'https://github.com/angular/material/issues/3287'*/
			      $timeout(function(){$location.path('/dashboard')}, 10);
				}
			}
		);	

		var parsedTree = [];
		var treeb; 
		//Obtiene el sectorTree de la base de datos
		databaseFactory.getSectorTree().success(function(response){
			self.sectorTree = response;
			treeb = angular.copy(self.sectorTree);
	        var map = {};
	        var node = {};
	        for (var i = 0; i < treeb.length; i += 1) {
	            node = treeb[i];
	            node.children = [];
	            node.label = node.child_id + " - " +node.nodeName + "  ";
	            node.ref = node.nodeName;
	            delete node.nodeName;
	            map[node.nodeID] = i; // use map to look-up the parents
	            if (node.parentID != "0") {
	                treeb[map[node.parentID]].children.push(node);
	            } else {
	                parsedTree.push(node);
	            }
	        }
		});



	    var apple_selected, tree, treedata_avm, treedata_geography;
	    
	    $scope.my_tree_handler = function(branch) {
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

	    // $scope.try_changing_the_tree_data = function() {
	    //   if ($scope.my_data === treedata_avm) {
	    //     return $scope.my_data = treedata_geography;
	    //   } else {
	    //     return $scope.my_data = treedata_avm;
	    //   }
	    // };

	    $scope.my_tree = tree = {};

	    // $scope.try_async_load = function() {
	    //   $scope.my_data = [];
	    //   $scope.doing_async = true;
	    //   return $timeout(function() {
	    //     if (Math.random() < 0.5) {
	    //       $scope.my_data = treedata_avm;
	    //     } else {
	    //       $scope.my_data = treedata_geography;
	    //     }
	    //     $scope.doing_async = false;
	    //     return tree.expand_all();
	    //   }, 1000);
	    // };
	    
	    // return $scope.try_adding_a_branch = function() {
	    //   var b;
	    //   b = tree.get_selected_branch();
	    //   return tree.add_branch(b, {
	    //     label: 'New Branch',
	    //     data: {
	    //       something: 42,
	    //       "else": 43
	    //     }
	    //   });
	    // };

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
			linkFactory.setSelectedNode(aux,self.identifier);
			linkFactory.setDashboardType('sector');
			self.done = true;
		}
    };
})();