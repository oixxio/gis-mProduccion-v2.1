angular.module('app.mapaprod').factory('linkFactory', linkFactory);

function linkFactory (){ 

    var link = {};

    // get/set del nodo seleccionado en region/by-sector
    link.setSelectedNode = function(selectedNode, identifier){ 
        console.log(selectedNode, identifier);
        link.selectedNode = selectedNode;
        localStorage.setItem('selectedNode-'+identifier,JSON.stringify(selectedNode));
    };
    link.getSelectedNode = function(identifier){
        console.log(identifier);
    	return link.selectedNode ? link.selectedNode : JSON.parse(localStorage.getItem('selectedNode-'+identifier));
    };

    // get/set del layer activo en region/by-sector
    link.setToggleLayerActive = function(toggleLayerActive){
        link.toggleLayerActive = toggleLayerActive;
        localStorage.setItem('toggleLayerActive',JSON.stringify(toggleLayerActive));
    };
    link.getToggleLayerActive = function(){
        console.log(JSON.parse(localStorage.getItem('toggleLayerActive')));
        return JSON.parse(localStorage.getItem('toggleLayerActive'));
    };

    // get/set para el flag de tipo de dashboard, sirve para parametrizar el dashboard dependiendo si es REGION o SECTOR
    link.setDashboardType = function(type){
    	link.dashboardType = type;
    	localStorage.setItem('dashboardType',JSON.stringify(type));
    };  
    link.getDashboardType = function(){
    	return link.dashboardType ? link.dashboardType : JSON.parse(localStorage.getItem('dashboardType'));
    };     

    // get/set para el flag de tipo de dashboard, sirve para parametrizar el dashboard dependiendo si es REGION o SECTOR
    link.setPrintInfo = function(parsedResponse,rawResponse,currentNode){
        console.log("link");
        link.parsedResponse = parsedResponse;
        link.rawResponse = rawResponse;
        link.currentNode = currentNode;

        if (parsedResponse.comparison) {
            console.log("comparison");
            delete link.parsedResponse.map;  
            localStorage.setItem('printInfo',JSON.stringify([link.parsedResponse,link.rawResponse,link.currentNode]));  
        }
    };  


    link.getPrintInfo = function(){
        if (link.parsedResponse) {  
            console.log("link");
            return link.parsedResponse;
        }else{
            console.log("comparison");
            return JSON.parse(localStorage.getItem('printInfo')); 
        }  
    }; 

	return link;
};