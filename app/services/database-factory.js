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
    database.getTreemap = function(id, type, depth){
        var data = { id: id, type: type, depth: depth};
        return $http.post('api/getResults.php', data);//'api/getTreemap.php', data);
    }
    database.getMapData = function(ids, depth){
        var query;
        var idsString;
        idsString = ids.join(', ');
        idsString = '(' + idsString + ')';

        if (depth == 1) { 
            var aux = ids[0]; //Este ID no refiere  REGION como cualquier nodo, sino a una region de depth=1
            switch(aux){
                case '100000': idsString = '(13,18,19)'; break;
                case '200000': idsString = '(1,2)'; break;
                case '300000': idsString = '(5,6,9,14)'; break;
                case '400000': idsString = '(3,10,12,17,22,23)'; break;
                case '500000': idsString = '(4,8,11,21)'; break;
                case '600000': idsString = '(7,15,16,20,24)'; break;
               default: idsString = '(2)';     break;
            }
            query = 'SELECT INDRAproCodigoProvincia as indra, KML as kml '
                  + 'FROM 1swzY7Y4oqQ7GIpVaend3xSrN6Oo59Kpbk1enwCE '
                  + 'WHERE INDRAproCodigoProvincia IN ' + idsString ;
        } else if (depth == 2) {
            //Provincias    
            query = 'SELECT INDRAproCodigoProvincia as indra, KML as kml '
                  + 'FROM 1swzY7Y4oqQ7GIpVaend3xSrN6Oo59Kpbk1enwCE '
                  + 'WHERE INDRAproCodigoProvincia IN ' + idsString ;
        } else if (depth == 3) {
            //Departamentos
            query = 'SELECT INDRA as indra, KML as kml '
                  + 'FROM 1pwVmSmzuUg0GJsYt9eBjIJ08n75WtaifybZTakA '
                  + 'WHERE INDRA IN ' + idsString ;
        }

        var url = ['https://www.googleapis.com/fusiontables/v2/query?'];
        url.push('sql=');
        var encodedQuery = encodeURIComponent(query);
        url.push(encodedQuery);
        url.push('&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ');
        url = url.join('');
        return $http.get(url);
    }

	return database;
};