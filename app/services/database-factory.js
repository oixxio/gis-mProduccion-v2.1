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
    database.getMapData = function(ids, depth){
        var query;
        
        ids = ids.join(', ');
        ids = '(' + ids + ')';

        if (depth != 3) {
            //Provincias    
            query = 'SELECT INDRAproCodigoProvincia as indra, KML as kml '
                  + 'FROM 1swzY7Y4oqQ7GIpVaend3xSrN6Oo59Kpbk1enwCE '
                  + 'WHERE INDRAproCodigoProvincia IN ' + ids ;
        } else if (depth == 3) {
            //Departamentos
            query = 'SELECT INDRA as indra, KML as kml '
                  + 'FROM 1pwVmSmzuUg0GJsYt9eBjIJ08n75WtaifybZTakA '
                  + 'WHERE INDRA IN ' + ids ;
              console.log(query);
        }

        var url = ['https://www.googleapis.com/fusiontables/v2/query?'];
        url.push('sql=');
        var encodedQuery = encodeURIComponent(query);
        url.push(encodedQuery);
        url.push('&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ');
        url = url.join('');
        console.log(url);
        return $http.get(url);
    }

	return database;
};