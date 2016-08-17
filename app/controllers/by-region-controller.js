(function () {
    'use strict';

    angular.module('app.mapaprod').
    controller('byRegionCtrl', ['$scope','$location','$http','databaseFactory',
                function($scope,$location,$http,databaseFactory){

//////INIT Ctrl
        $scope.searchList = [];

//////Declara Funciones
		$scope.initRegionTree = function() {
			for (var i = 0; i < $scope.regionTree.length; i++) {
				switch ($scope.regionTree[i].depth) {
					case '1': $scope.regionTree[i].depthName = "region"; break;
					case '2': $scope.regionTree[i].depthName = "provincia"; break;
					case '3': $scope.regionTree[i].depthName = "departamento"; break;
					case '4': $scope.regionTree[i].depthName = "localidad"; break;
					default: $scope.regionTree[i].depthName = ""; break;
				}
			}
		}

		$scope.changeColor = function(depth){
			var returnClass = '';
				switch (depth) {
					case '1': returnClass = "list-group-item-success"; break;
					case '2': returnClass = "list-group-item-info"; break;
					case '3': returnClass = "list-group-item-warning"; break;
					case '4': returnClass = "list-group-item-default"; break;
					default: returnClass = ""; break;
				}			
				return returnClass;
		}

        // gives another movie array on change
        $scope.updateMovies = function(typed){
            // MovieRetriever could be some service returning a promise
            $scope.newmovies = MovieRetriever.getmovies(typed);
            $scope.newmovies.then(function(data){
              $scope.movies = data;
            });
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


//////Ejecuta funciones



    }])
})();
