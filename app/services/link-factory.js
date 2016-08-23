angular.module('app.mapaprod').factory('linkFactory', linkFactory);

function linkFactory (){ 

    var link = {};

    link.setSelectedNode = function(selectedNode){
        link.selectedNode = selectedNode;
    };

    link.getSelectedNode = function(){
        return link.selectedNode;
    };    

	return link;
};