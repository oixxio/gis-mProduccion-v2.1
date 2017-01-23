angular.module('app.dashboard').factory('linkFactory', linkFactory);

function linkFactory (){ 

    var link = {};
    var modalDgSector = modalDgRegion = modalT = modalS = {};
    var nodeName = "";

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
    link.setModalDgSector = function(data){
        modalDgSector = data;
    }
    link.setModalDgRegion = function(data){
        modalDgSector = data;
    }
    link.setModalT = function(data){
        modalT = data;
    }
    link.setModalS = function(data){
        modalS = data;
    }
    link.getModalDG = function(){
        return modalDG;
    }
    link.getModalT = function(){
        return modalT;
    }
    link.getModalS = function(){
        return modalS;
    }
    link.setNodeName = function(name){
        nodeName = name;
    }
    link.getNodeName = function(){
        return nodeName;
    }
	return link;
};