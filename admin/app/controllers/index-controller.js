(function () {
    'use strict';
    angular.module('app.dashboard').
    controller('indexController', [
        '$scope','$location','loginFactory','$http','$rootScope','databaseFactory','linkFactory',
                function($scope,$location,loginFactory,$http,$rootScope,databaseFactory,linkFactory){
        /*------------------------------------------------Variables--------------------------------------------------------*/
        $scope.$on('$locationChangeStart', function(event) {
            if (sessionStorage.getItem('userName')) {
                $scope.userName = sessionStorage.getItem('userName');
            }else{
                $location.path('/')
            }
            
        })
        var deptoSelected;
        var sectorSelected;
        /*-----------------------------------------------------------------------------------------------------------------*/
        /**
         * Obtiene el path de un nodo y lo convierte a string en forma 'Name1>Name2>Name3'
         */
        function getNodeById(id, arrayTree) {
            for (var i = 0; i < arrayTree.length; i++) {
                if (arrayTree[i].nodeID == id) {
                    return arrayTree[i];
                }
            }
            return -1; //Si no lo encuentra, retorna '-1'
        }     
        function getNodePath(node, arrayTree) {
            //INIT
            var nodePath = [];
            var nodes = [];
            var i = 0;
            nodes[0] = node;
            nodePath[0] = node.nodeName;

            while(nodes[i] != -1) {         
                nodes[i+1] = getNodeById(nodes[i].parentID, arrayTree);
                nodePath[i+1] = nodes[i+1].nodeName;
                i++;
            }
            nodePath.pop();
            return nodePath.reverse();
        }
        function getNodePathString(node,arrayTree) {
            var nodePath = [];
            var nodePathString = "";

            nodePath = getNodePath(node,arrayTree);
            nodePath.pop();
            nodePathString = nodePath[0];

            for (var i = 1; i < nodePath.length; i++) {
                nodePathString += " > " + nodePath[i];
            }

            return nodePathString;
        }
        $scope.getAllRegions = function(){
            databaseFactory.getRegionTree().then(function(response){
                //console.log(response.data)
                var regions = new Array;
                var provs = new Array;
                var deps = new Array;
                var pathRegion = new Array;
                var pathProv = new Array;
                var pathDep = new Array;
                var regionName = "";
                var provName = "";
                var depName = "";
                for (var i = 0; i < response.data.length; i++) {
                    //path = getNodePath(response.data[i],response.data)
                    switch(response.data[i].depth){
                        case "1":
                            pathRegion = getNodePath(response.data[i],response.data)
                            regionName = pathRegion[0];
                            regions.push({id: response.data[i].nodeID, name: regionName});
                        break;
                        case "2":
                            pathProv = getNodePath(response.data[i],response.data)
                            provName = pathProv[1];
                            provs.push({id: response.data[i].nodeID, name: provName, parent: response.data[i].parentID});
                        break;
                        case "3":
                            pathDep = getNodePath(response.data[i],response.data)
                            depName = pathDep[2];
                            deps.push({id: response.data[i].nodeID, name: depName, parent: response.data[i].parentID});
                        break;
                    }
                }       
                $scope.regions = regions;
                $scope.provs = provs;
                $scope.deps = deps;    

                //$scope.departamentos = deptos;
            })  
        }
        $scope.getAllRegions();
        /*filtros de selectores: seguro se puede hacer en una funcion pero ni ganas*/
        $scope.filterRegion = function(region){
            $scope.regSelect = region;
            $scope.regFilter = region.id
            $scope.showProv = true;
        }
        $scope.filterProv = function(prov){
            //console.log(prov)
            $scope.provSelect = prov;
            $scope.provFilter = prov.id
            $scope.showDep = true;
        }
        $scope.selectDep = function(dep){
            $scope.depSelect = dep;
            $scope.depFilter = dep.id
            deptoSelected = true;
            if(deptoSelected && sectorSelected){
                console.log($scope.depSelect,$scope.lvl4Select)
                $scope.getNodeData($scope.depSelect,$scope.lvl4Select)
            }
        }
        /*[Start] funcion que trae todos los sectores de la base de datos*/
        $scope.getAllSectors = function(){
            databaseFactory.getSectorTree().then(function(response){
                var level1 = new Array;
                var level2 = new Array;
                var level3 = new Array;
                var level4 = new Array;
                var pathLevel1 = new Array;
                var pathLevel2 = new Array;
                var pathLevel3 = new Array;
                var pathLevel4 = new Array;
                var level1Name = "";
                var level2Name = "";
                var level3Name = "";
                var level4Name = "";
                for (var i = 0; i < response.data.length; i++) {
                    switch(response.data[i].depth){
                        case "1":
                            pathLevel1 = getNodePath(response.data[i],response.data)
                            level1Name = pathLevel1[0];
                            level1.push({id: response.data[i].nodeID, name: level1Name});
                        break;
                        case "2":
                            pathLevel2 = getNodePath(response.data[i],response.data)
                            level2Name = pathLevel2[1];
                            level2.push({id: response.data[i].nodeID, name: level2Name, parent: response.data[i].parentID});
                        break;
                        case "3":
                            pathLevel3 = getNodePath(response.data[i],response.data)
                            level3Name = pathLevel3[2];
                            level3.push({id: response.data[i].nodeID, name: level3Name, parent: response.data[i].parentID});
                        break;
                        case "4":
                            pathLevel4 = getNodePath(response.data[i],response.data)
                            level4Name = pathLevel4[3];
                            level4.push({id: response.data[i].nodeID, name: level4Name, parent: response.data[i].parentID});
                        break;
                    }
                }       
                $scope.lvl1 = level1;
                $scope.lvl2 = level2;
                $scope.lvl3 = level3;
                $scope.lvl4 = level4; 
                //console.log(level4)      
            })  
        }
        /*[Start] Filtros de selectores de región*/
        $scope.getAllSectors();
        $scope.filterLvl1 = function(lvl1){
            $scope.lvl1Select = lvl1;
            $scope.lvl1Filter = lvl1.id
            $scope.showLvl2 = true
            
        }
        $scope.filterLvl2 = function(lvl2){
            $scope.lvl2Select = lvl2;
            $scope.lvl2Filter = lvl2.id
            $scope.showLvl3 = true
        }
        $scope.filterLvl3 = function(lvl3){
            $scope.lvl3Select = lvl3;
            $scope.lvl3Filter = lvl3.id
            //console.log(lvl3)
            $scope.showLvl4 = true
        }
        $scope.selectLvl4 = function(lvl4){
            $scope.lvl4Select = lvl4;
            $scope.lvl4Filter = lvl4.id
            sectorSelected = true;
            if(deptoSelected && sectorSelected){
                $scope.getNodeData($scope.depSelect,$scope.lvl4Select)
            }
        }
        /*[End] filtros de selectores de región*/   

        $scope.getNodeData = function(deptoNode, sectorNode){
            var regionId = deptoNode.id;
            var sectorId = sectorNode.id;
            $scope.eDgReg = {}
            $scope.eDgSect = {}
            $scope.eT = {}
            $scope.eS = {}
            databaseFactory.getGeneralData(regionId,'region').then(function(response){
                if (response.data[0] != undefined) {
                        $scope.eDgReg = response.data[0];
                        //console.log(JSON.stringify(response.data[0])) 
                    }else{
                        $scope.eDgReg = {}   
                    }

                databaseFactory.getGeneralData(sectorId,'sector').then(function(response){
                    if (response.data != undefined) {
                       $scope.eDgSect = response.data[0];
                        //console.log(JSON.stringify(response.data[0])) 
                    }else{
                        $scope.eDgSect = {}   
                    }

                    console.log(regionId)
                    databaseFactory.getTreemap(regionId,sectorId).then(function(response){
                        if (response.data != undefined) {
                           $scope.eT = response.data[0]
                            console.log(JSON.stringify(response.data[0])) 
                        }else{
                            $scope.eT = {}   
                        }

                        databaseFactory.getScatter(regionId,sectorId).then(function(response){
                            if (response.data != undefined) {
                               $scope.eS = response.data[0]
                                //console.log(JSON.stringify(response.data[0])) 
                            }else{
                                $scope.eS = {}   
                            }
                        })
                    })
                })
            })
        }
        $scope.saveDgReg = function(dg){
            var data = {
                id: $scope.depSelect.id,
                poblacion: dg.poblacion,
                poblacion_part: dg.poblacion_part,
                pbg: dg.pbg,
                pbg_part: dg.pbg_part,
                empleo_pub: dg.empleo_pub,
                empleo_pub_part: dg.empleo_pub_part,
                export: dg.export,
                export_part: dg.export_part,
                export_destinos: dg.export_destinos,
                export_productos: dg.export_productos
            }
            databaseFactory.updateGeneralData(data,'region').then(function(response){
                //console.log(response.data)
                if (response.data == "200") {
                    databaseFactory.logEvent(sessionStorage.getItem("userName"),'change DG')
                    alert("Cambios registrados correctamente")
                    //Lo agregue porque sino cuando guardaba no me actualizaba mas los campos
                }
            });
        }
        $scope.saveDgSect = function(dg){
            var data = {
                id: $scope.lvl4Select.id,
                empleo: dg.empleo,
                empleo_part: dg.empleo_part,
                export: dg.export,
                export_part: dg.export_part
            }
            databaseFactory.updateGeneralDataSector(data).then(function(response){
                console.log(response.data)
                if (response.data == "200") {
                    databaseFactory.logEvent(sessionStorage.getItem("userName"),'change DGS')
                    alert("Cambios registrados correctamente")
                    //Lo agregue porque sino cuando guardaba no me actualizaba mas los campos
                }
            });
        }
        $scope.saveT = function(t){
            var data = {
                region_id: $scope.depSelect.id,
                sector_id: $scope.lvl4Select.id,
                empleo_part: t.empleo_part,
                export_part: t.export_part
            }
            //console.log(data)
            databaseFactory.updateTreemap(data,'region').then(function(response){
                //console.log(response.data)
                if (response.data == "200") {
                    databaseFactory.logEvent(sessionStorage.getItem("userName"),'change DG')
                    alert("Cambios registrados correctamente")
                    //Lo agregue porque sino cuando guardaba no me actualizaba mas los campos
                }
            });
        }
        $scope.saveS = function(s){
            var data = {
                region_id: $scope.depSelect.id,
                sector_id: $scope.lvl4Select.id,
                empleo_var: s.empleo_var,
                empleo_coef_esp: s.empleo_coef_esp,
                empleo_part: s.empleo_part,
                export_var: s.export_var,
                export_coef_esp: s.export_coef_esp,
                export_part: s.export_part
            }
            //console.log(data)
            databaseFactory.updateScatter(data,'region').then(function(response){
                //console.log(response.data)
                if (response.data == "200") {
                    databaseFactory.logEvent(sessionStorage.getItem("userName"),'change S')
                    alert("Cambios registrados correctamente")
                    //Lo agregue porque sino cuando guardaba no me actualizaba mas los campos
                }
            });
        }
        //Funcion que permite navegar entre views
        $scope.goTo = function (view) {
            $location.path(view);
        }

        //Funciones para esconder Header y sidebar, y reacomodar las clases de la view para que entren en toda la pantalla.
        $scope.hideHeaderSide = function () {
            if($location.path() === '/'){
                return true
            }
        }

        $scope.userSignOut = function() {
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('userLastName');
            sessionStorage.removeItem('userGrade');
            $location.path('/'); 
        };        
    }])

})();