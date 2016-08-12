angular.module('app.mapaprod')
.factory('databaseFactory', ['$http', function($http){ 

    var database = {};

    database.getSectorTree = function(){
        return $http.get('api/getSectorTree.php');
    };

    database.getRegionTree = function(){
        return $http.get('api/getRegionTree.php');
    };    

	return database;
}]);