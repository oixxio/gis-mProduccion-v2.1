angular.module('app.mapaprod').factory('databaseFactory', databaseFactory);

function databaseFactory ($http){ 

    var database = {};

    //Get trees with indexes of all nodes in REGION & SECTOR
    database.getRegionTree = function(){
        return $http.get('api/getRegionTree.php');
    };    
    database.getSectorTree = function(){
        return $http.get('api/getSectorTree.php');
    };

    //All GET functions
    database.getGeneralData = function(id, type){
        var data = { id: id, type: type};
        return $http.post('api/getGeneralData.php', data);
    }
    database.getScatter = function(id, type){
        var data = { id: id, type: type};
        return $http.post('api/getScatter.php', data);
    }
    database.getTreemap = function(id, type){
        var data = { id: id, type: type};
        return $http.post('api/getTreemap.php', data);
    }

	return database;
};