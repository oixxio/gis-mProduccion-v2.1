angular.module('app.mapaprod').service('common', common);

//Son funciones comunes que se utilizan en varios lados de la app

function common (){ 

        this.getNodeById = function(id, arrayTree) {
            for (var i = 0; i < arrayTree.length; i++) {
                if (arrayTree[i].nodeID == id) {
                    return arrayTree[i];
                }
            }
            return -1; //Si no lo encuentra, retorna '-1'
        }   

        this.getNodePath = function(node, arrayTree) {

            //INIT
            var nodePath = [];
            var nodes = [];
            var i = 0;
            nodes[0] = node;
            nodePath[0] = node;

            while(nodes[i] != -1) {         
                nodes[i+1] = this.getNodeById(nodes[i].parentID, arrayTree);
                nodePath[i+1] = nodes[i+1];
                i++;
            }
            nodePath.pop();
            return nodePath.reverse();
        }
        
        this.getNodePathString = function(node,arrayTree) {
            var nodePath = [];
            var nodePathString = "";

            nodePath = this.getNodePath(node,arrayTree);
            if (nodePath.length != 1 && nodePath.lenght != 0) {
                nodePath.pop();
            }
            nodePathString = nodePath[0].nodeName;

            for (var i = 1; i < nodePath.length; i++) {
                nodePathString += " > " + nodePath[i].nodeName;
            }

            return nodePathString;
        }

};