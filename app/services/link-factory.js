angular.module('app.mapaprod').factory('linkFactory', linkFactory);

function linkFactory (){ 

    var link = {};

    // get/set del nodo seleccionado en region/by-sector
    link.setSelectedNode = function(selectedNode){
        link.selectedNode = selectedNode;
        localStorage.setItem('selectedNode',JSON.stringify(selectedNode));
    };
    link.getSelectedNode = function(){
    	return link.selectedNode ? link.selectedNode : JSON.parse(localStorage.getItem('selectedNode'));
    };

    // get/set para el flag de tipo de dashboard, sirve para parametrizar el dashboard dependiendo si es REGION o SECTOR
    link.setDashboardType = function(type){
    	link.dashboardType = type;
    	localStorage.setItem('dashboardType',JSON.stringify(type));
    };  
    link.getDashboardType = function(){
    	return link.dashboardType ? link.dashboardType : JSON.parse(localStorage.getItem('dashboardType'));
    };     

	return link;
};