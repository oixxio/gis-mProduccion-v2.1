angular.module('app.dashboard').factory('databaseFactory', databaseFactory);

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
    database.updateGeneralData = function(dg, type){
        var data = { data: dg, type: type};
        return $http.post('api/updateGeneralData.php', data);
    }
    database.updateGeneralDataSector = function(data){
        return $http.post('api/updateGeneralDataSector.php', data);
    }
    database.updateTreemap = function(dg, type){
        var data = { data: dg, type: type};
        return $http.post('api/updateTreemap.php', data);
    }
    database.updateScatter = function(dg, type){
        var data = { data: dg, type: type};
        return $http.post('api/updateScatter.php', data);
    }
    database.getScatter = function(region_id, sector_id){
        var data = { region_id: region_id, sector_id: sector_id};
        return $http.post('api/getScatter.php', data);
    }
    database.getTreemap = function(region_id, sector_id){
        var data = { region_id: region_id, sector_id: sector_id};
        return $http.post('api/getTreemap.php', data);
    }
    database.logEvent = function(user,event) {
        var data = { user: user, event: event};
        return $http.post('api/logEvent.php', data);
    }
    return database;
};