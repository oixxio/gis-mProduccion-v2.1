angular.module('app.mapaprod').factory('databaseFactory', databaseFactory);

function databaseFactory ($http){ 

    var database = {};

    database.getSectorTree = function(){
        return $http.get('api/getSectorTree.php');
    };

    database.getRegionTree = function(){
        return $http.get('api/getRegionTree.php');
    };

    database.getGeoAllSectorData = function(regionId){
        return $http.post('api/getGeoAllSectorData.php', regionId);
    };

    database.getSectorAllGeoData = function(sectorId){
        return $http.post('api/getSectorAllGeoData.php', sectorId);
    };            

	return database;
};