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

    //All GET functions for REGION data
    /* DEPRECATED
    database.getRegionAllSectorData = function(regionId){
        return $http.post('api/getGeoAllSectorData.php', regionId);
    };*/    
    database.getRegionGeneralData = function(regionId){
        return $http.post('api/getRegionGeneralData.php', regionId);
    }
    database.getRegionScatter = function(regionId){
        //return $http.post('api/getRegionScatter.php', regionId);
    }
    database.getRegionTreemap = function(regionId){
        //return $http.post('api/getRegionTreemapgetRegionGeneralData.php', regionId);
    }

    //All GET functions for SECTOR data
    /* DEPRECATED
    database.getSectorAllGeoData = function(sectorId){
        return $http.post('api/getSectorAllGeoData.php', sectorId);
    };*/       
    database.getSectorGeneralData = function(sectorId){
        //return $http.post('api/getSectorGeneralData.php', sectorId);
    }
    database.getSectorScatter = function(sectorId){
        //return $http.post('api/getSectorScatter.php', sectorId);
    }
    database.getSectorTreemap = function(sectorId){
        //return $http.post('api/getSectorTreemap.php', sectorId);
    }            

	return database;
};