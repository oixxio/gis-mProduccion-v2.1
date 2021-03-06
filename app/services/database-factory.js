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
    database.getResults = function(id, type, depth){
        var data = { id: id, type: type, depth: depth};
        return $http.post('api/getResults.php', data);
    }
    database.getEntries = function(){
        return $http.get('api/getEntries.php');
    };
    database.getAllRegionGeneralData = function(){
        return $http.get('api/getAllRegionGeneralData.php');
    };
    database.getAllSectorGeneralData = function(){
        return $http.get('api/getAllSectorGeneralData.php');
    };              

    database.getMapData = function(node,regionTree,type){
        var query;
        var kmlIds, kmlIds;

        if (type == 'region') {
            if (node.depth == 0) {
                kmlIds = getChildrenKmlIdById(0,regionTree);
                kmlIds = kmlIds.join(', ');
                kmlIds = '(' + kmlIds + ')';
                query = 'SELECT INDRA as indra, KML as kml '
                      + 'FROM 1QbLLjQkeATABWMPQWir-wnASFiZnBG8nUGUqIjR6 '
                      + 'WHERE INDRA IN ' + kmlIds + ' ORDER BY INDRA' ;
            }else if (node.depth == 1) {
                kmlIds = getChildrenKmlIdById(node.nodeID,regionTree);
                kmlIds = kmlIds.join(', ');
                kmlIds = '(' + kmlIds + ')';
                query = 'SELECT INDRAproCodigoProvincia as indra, KML as kml '
                      + 'FROM 1PgWjH-wcqDYw-j-AlNhjuV_g0DntaEprDOPJIH3F '
                      + 'WHERE INDRAproCodigoProvincia IN ' + kmlIds + ' ORDER BY INDRAproCodigoProvincia' ;
            } else if (node.depth == 2) {
                kmlIds = getChildrenKmlIdById(node.nodeID,regionTree);
                kmlIds = kmlIds.join(', ');
                kmlIds = '(' + kmlIds + ')';
                //Provincias    
                query = 'SELECT INDRA as indra, KML as kml '
                      + 'FROM 1pwVmSmzuUg0GJsYt9eBjIJ08n75WtaifybZTakA '
                      + 'WHERE INDRA IN ' + kmlIds + ' ORDER BY INDRA' ;
            } else if (node.depth == 3) {
                kmlIds = '('+node.kmlID+')';
                //Departamentos
                query = 'SELECT INDRA as indra, KML as kml '
                      + 'FROM 1pwVmSmzuUg0GJsYt9eBjIJ08n75WtaifybZTakA '
                      + 'WHERE INDRA IN ' + kmlIds + ' ORDER BY INDRA' ;
            }
        } else if (type == 'sector') {
            kmlIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]; //para el caso de sector siempre levanta solo las provincias
            kmlIds = kmlIds.join(', ');
            kmlIds = '(' + kmlIds + ')';
            //Provincias    
            query = 'SELECT INDRAproCodigoProvincia as indra, KML as kml '
                  + 'FROM 1PgWjH-wcqDYw-j-AlNhjuV_g0DntaEprDOPJIH3F '
                  + 'WHERE INDRAproCodigoProvincia IN ' + kmlIds + ' ORDER BY INDRAproCodigoProvincia' ;
        }
        var url = ['https://www.googleapis.com/fusiontables/v2/query?'];
        url.push('sql=');
        var encodedQuery = encodeURIComponent(query);
        url.push(encodedQuery);
        url.push('&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ');
        url = url.join('');
        return $http.get(url);
    }

    function getChildrenKmlIdById(id, arrayTree) {
        var children = [];
        var idsString;
        for (var i = 0; i < arrayTree.length; i++) {
            if (arrayTree[i].parentID == id) {
                children.push(arrayTree[i].kmlID);
            }
        }
        return children;
    }

    /////////ALL SET FUNCTIONS
    database.editEntry = function(entry){
        return $http.post('api/updateEntry.php', entry);
    }    
    database.addEntry = function(entry){
        return $http.post('api/insertEntry.php', entry);
    }   
    database.deleteEntry = function(entry){
        return $http.post('api/deleteEntry.php', entry);
    }        
    database.editRegionGeneralData = function(entry){
        return $http.post('api/updateRegionGeneralData.php', entry);
    }
    database.editSectorGeneralData = function(entry){
        return $http.post('api/updateSectorGeneralData.php', entry);
    }      

    database.login = function(mail, pass){
        var data = { mail: mail, pass: pass};
        return $http.post('api/login.php', data);
    }


	return database;
};