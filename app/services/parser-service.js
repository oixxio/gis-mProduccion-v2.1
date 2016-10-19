angular.module('app.mapaprod').service('parser', parser);

function parser ($log, $rootScope){ 

    this.parseGeneralData = function(rawArray){
            raw = rawArray[0];
            raw.poblacion        = parseFloat(raw.poblacion).toLocaleString();
            raw.poblacion_part   = parseFloat(raw.poblacion_part*100).toFixed(2);
            raw.pbg              = parseFloat(raw.pbg).toLocaleString();
            raw.pbg_part         = parseFloat(raw.pbg_part*100).toFixed(2);
            raw.empleo           = parseFloat(raw.empleo).toLocaleString();
            raw.empleo_part      = parseFloat(raw.empleo_part*100).toFixed(2);
            raw.empleo_pub       = parseFloat(raw.empleo_pub).toLocaleString();
            raw.empleo_pub_part  = parseFloat(raw.empleo_pub_part*100).toFixed(2);
            raw.export           = parseFloat(raw.export).toLocaleString();
            raw.export_part      = parseFloat(raw.export_part*100).toFixed(2);
            raw.export_destinos  = raw.export_destinos;
            raw.export_productos = raw.export_productos;
            return raw;        
    }

    this.parseScatter = function(rawArray,activeCategory,dashboardType){
        var parsedData = [];
        var rawElement;
        var raw = {};
        for (var i = 0; i < rawArray.length; i++) {
            //Selecciona el elemento en array y por tipo
            rawElement = rawArray[i];
            raw.subId         = rawElement.sub_id;
            raw.nombre        = rawElement.nombre;
            raw.color         = hexToRgbA('#'+rawElement.color);
            raw.var           = rawElement[activeCategory+'_var'];
            raw.coef_esp      = rawElement[activeCategory+'_coef_esp'];
            //raw.var_fake      = rawElement[activeCategory+'_var_fake'];
            //raw.coef_esp_fake = rawElement[activeCategory+'_coef_esp_fake'];
            raw.part          = rawElement[activeCategory+'_part'];

            //data conversion STRING a int/porcentuales con 2 decimales
            raw.var             = parseFloat( (parseFloat(raw.var)*100)       .toFixed(2) );
            raw.coef_esp        = parseFloat( (parseFloat(raw.coef_esp))      .toFixed(2) );
            //raw.var_fake        = parseFloat( (parseFloat(raw.var_fake)*100)  .toFixed(2) );
            //raw.coef_esp_fake   = parseFloat( (parseFloat(raw.coef_esp_fake)) .toFixed(2) );
            raw.part            = parseFloat( (parseFloat(raw.part)*100)      .toFixed(2) );

            //JSON array parsing (subId es el ID secundario de region o sector segun corresponda)
            //Por ejemplo. Si seleccionamos la region de Cuyo (region_id=1), el subId es el ID del sector para esa region.
            //En este caso para Cuyo va a existir un ID para cada sector de Cuyo.
            if (raw.subId != 0) {
                //Parse datos EMPLEO
                if(raw.var != 0 && raw.part != 0 && raw.coef_esp != 0){
                    //var colorB = hexToRgbA(getColorByName(raw.abvSector)); //REVISAR
                    parsedData.push(
                        {
                            name: raw.nombre+ '<br> '
                                 + raw.var + '% '
                                 + raw.coef_esp,
                            value: [
                                    raw.coef_esp, //_fake,
                                    raw.var, //_fake,
                                    raw.part
                                    ],
                            itemStyle: {normal: { color: raw.color} }
                        });
                }                             
            } else if (raw.subId == 0) { //SubId=0 corresponde al Total Regional/Sectorial
                /*/Parse line eje X Total Regional/Sectorial
                var markLineA = {
                    name: 'Total '+dashboardType,
                    type: 'scatter',
                    symbolSize: 0,
                    data: [[0,raw.var]],
                    markLine: {
                        symbolSize: [2,2],
                        tooltip: {
                            show: true, formatter: 'Total '+dashboardType+'<br>{c}%'
                        },
                        itemStyle: {
                            normal: { lineStyle: { type: 'dotted', width: 2 }, label: { show: true, position: 'right', formatter: '{c}%' }, },
                            emphasis: { lineStyle: { width: 2 } }
                        },
                        data : [[
                                {name: 'Total '+dashboardType, value: raw.var, xAxis: 0, yAxis: raw.var},
                                {name: 'Total '+dashboardType, xAxis: 1000, yAxis: raw.var}
                        ]]
                    }
                };      */                       
            }
        }
        //Parse line eje Y Coeficiente de Especialización constante=1
        var markLineB = {
            name: 'Coef Esp',
            type: 'scatter',
            symbolSize: 0,
            data: [[1,0]],
            markLine: {
                symbol: ['arrow','arrow'],
                symbolSize: [2,2],
                tooltip: { show: true, formatter: 'Coef Esp 1' },
                itemStyle: {
                    normal: { lineStyle: { type: 'dotted', width: 2 }, label: { show: true, position: 'top', formatter: '{c}' }, },
                    emphasis: { lineStyle: { width: 2 } }
                },
                data : [[
                        {name: 'Coef Esp 1', value: 1, xAxis: 1, yAxis: -100000},
                        {name: 'Coef Esp 1', xAxis: 1, yAxis: 100000}
                ]]
            }
        };
        //Parse options para dibujar el eChart
        var parsedOptions = {
            tooltip : {
                trigger: 'item',
                showDelay : 0,
                formatter : function (params) { return params.name; }
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "recargar"},
                    saveAsImage : {show: true, title: "guardar imagen"}
                }
            },
            xAxis : [{ type : 'value', scale: true, min: 0, axisLabel: { formatter: '{value}' } }],
            yAxis : [{ type : 'value', scale: true, axisLabel: { formatter: '{value} %' } }],
            series : [{
                        name:'scatter', 
                        type:'scatter',
                        symbolSize: function (value){
                            var baseRadius = 2.5;
                            if (value[2] < 1) { return baseRadius*1}
                            else if (value[2] < 5) { return baseRadius*2 }
                            else if (value[2] < 10) { return baseRadius*3 }
                            else if (value[2] < 20) { return baseRadius*4 }
                            else if (value[2] < 30) { return baseRadius*5 }
                            else if (value[2] < 50) { return baseRadius*6 }
                            else if (value[2] < 75) { return baseRadius*7 }
                            else { return baseRadius*8 };                               
                        },
                        data: parsedData
                },
                //markLineA,
                markLineB
            ]
        };
        return parsedOptions;
    };

    this.parseTreemap = function(rawArray,tree,activeCategory){

        //hace una deep copy de los datos de entrada para no modificar los datos a los que referencia.
        rawArray        = angular.copy(rawArray);
        tree            = angular.copy(tree);
        activeCategory  = angular.copy(activeCategory);
        var parsedArray = [];
        var parsedTree = [];
        var rawElement = {};
        var raw = {};

        for (var i = 0; i < rawArray.length; i++) {
            
            //Selecciona el elemento en array y por tipo
            rawElement = rawArray[i];
            raw.id            = rawElement.sub_id;
            raw.parentID      = rawElement.parentID;
            raw.nombre        = rawElement.nodeName;
            raw.color         = '#'+rawElement.color;
            raw.part          = rawElement[activeCategory+'_part'];

            //data conversion STRING a int/porcentuales con 2 decimales
            raw.part            = parseFloat( (parseFloat(raw.part)*100)      .toFixed(2) );

            if(raw.part != 0){
                parsedArray.push(
                    {
                        id: raw.id,
                        parentID: raw.parentID,
                        name: raw.nombre,
                        value: raw.part,
                        itemStyle: {normal: { color: raw.color} }
                    });
            }
        }     
        //[START]Tree parsing

        //ArrayToTree
        var map = {};
        var node = {};
        for (var i = 0; i < tree.length; i += 1) {
            node = tree[i];
            node.children = [];
            node.value = 0;
            map[node.nodeID] = i; // use map to look-up the parents
            if (node.parentID != "0") {
                tree[map[node.parentID]].children.push(node);
            } else {
                parsedTree.push(node);
            }
        }
        parsedTree = {children: parsedTree};

        //Calculate parent values
        function calculateChildren(node) {
            // internal nodes get their total from children
            if (node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    node.value += calculateChildren(node.children[i]);
                }        
            }
            //reemplaza el valor por defecto por el valor posta de la DB      
            for (var i = 0; i < parsedArray.length; i++) {
                if (node.nodeID == parsedArray[i].id) {
                    node.value = parsedArray[i].value;
                }
            }
            node.name = node.nodeName;
            node.itemStyle = {normal:{color:'#'+node.color}};            
            return node.value;
        }
        calculateChildren(parsedTree);

        //elimina los arrays 'children' en los leafnodes, ya que están vacios y confunden a la libreria de los echarts
        function cleanLeafNodes(node){
            delete node.child_id;
            delete node.depth;
            delete node.nodeID;
            delete node.nodeName;
            delete node.parent_id;
            delete node.parentID;
            delete node.color;
            node.value = parseFloat( node.value.toFixed(2) );
            if(node.children.length){
               for (var i = 0; i < node.children.length; i++) {
                    cleanLeafNodes(node.children[i]);
                } 
            } else {
                delete node.children;
            }
        }
        parsedTree.child_id = 0;
        parsedTree.depth = 0;
        parsedTree.nodeID = 0;
        parsedTree.nodeName = 'root';
        parsedTree.name = 'root';
        parsedTree.parent_id = 0;
        parsedTree.parentID = 0;
        parsedTree.value = 1;
        cleanLeafNodes(parsedTree);

        //elimina los nodos cuyo0 'value' es igual a 0
        var indexesToDelete = [];
        function removeUselessNodes(node){
            if (node['children']) { //has children?
                indexesToDelete = [];
                for (var i = 0; i < node.children.length; i++) {
                    if (node.children[i].value == 0) { //uno de sus hijos tiene valor 0?
                        indexesToDelete.push(i); //elimina el children
                    }
                }
                for (var i = indexesToDelete.length; i > 0; i--) {
                    var indexToDelete = indexesToDelete[i-1];
                    node.children.splice(indexToDelete,1);
                }
                for (var i = 0; i < node.children.length; i++) {
                    removeUselessNodes(node.children[i]);
                }               
            }
        }
        removeUselessNodes(parsedTree);

        parsedTree = parsedTree.children;
        //[END]Tree parsing

        //Parse options para dibujar el eChart
        var parsedOptions = {
            tooltip : {
                trigger: 'item',
                position: [0,0],
                zlevel: 8,
                formatter: "{b}: {c}%",
                enterable: true,
                showDelay : 0,
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "recargar"},
                    saveAsImage : {show: true, title: "guardar imagen"}
                }
            },
            hoverable : true,
            series : [
                {
                    name:'Inicio',
                    type:'treemap',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position:'outer',
                                formatter: "{b}: {c}%"
                            },                            
                            borderWidth: 1
                        },
                        emphasis: {
                            label: {
                                show: true
                            },
                            color: 'transparent',
                            borderWidth: 3,
                            borderColor: '#bbbbff'
                        }
                    },
                    data: parsedTree
                }
            ]
        };
        return parsedOptions;    
    }

    this.parseMap = function(rawPaths){
        var rows = rawPaths['rows'];
        var regions = [];
        for (var i in rows) {
            var newCoordinates = [];
            var geometries = rows[i][1]['geometries'];

            if (geometries) {
              for (var j in geometries) {
                newCoordinates.push(constructNewCoordinates(geometries[j]));
              }
            } else {
              newCoordinates = constructNewCoordinates(rows[i][1]['geometry']);
            }

            var region = new google.maps.Polygon({
              paths: newCoordinates,
              strokeColor: '#0E79BF',
              strokeOpacity: 1,
              strokeWeight: 1,
              fillColor: '#98BAC5',
              fillOpacity: 0.3,
              clickable: false
            });
            /* POR SI QUIERO AGREGAR EVENTS
            google.maps.event.addListener(region, 'mouseover', function() {
              this.setOptions({fillOpacity: 1});
            });
            google.maps.event.addListener(region, 'mouseout', function() {
              this.setOptions({fillOpacity: 0.3});
            });
            */
            regions.push(region);
        }
        return regions;
    }

    this.parseHeatMap = function(rawPath, rawArray, regionTree, activeCategory){
        var rows = rawPath['rows'];
        var coe_esp = rawArray;
        var regions = [];
        var currentKML, currentID, currentCoefEsp;
        for (var i in rows) {
            var newCoordinates = [];
            var geometries = rows[i][1]['geometries'];

            if (geometries) {
              for (var j in geometries) {
                newCoordinates.push(constructNewCoordinates(geometries[j]));
              }
            } else {
              newCoordinates = constructNewCoordinates(rows[i][1]['geometry']);
            }

            //Tenemos los KML con su 'kmlID' por un lado, los datos de coef_esp con su 'id',
            //y el regionTree que me dice que kmlID corresponde con cada id.
            //Primero se itera sobre cada KML. a cada KML se le busca su id correspondiente, y por ultimo con ese id
            //se obtiene el coef_esp que le corresponde
            currentKML = rows[i][0];
            for (var j = 0; j < regionTree.length; j++) {
                if (regionTree[j].kmlID == currentKML) {
                    currentID = regionTree[j].nodeID;
                    for (var k = 0; k < rawArray.length; k++) {
                        if (rawArray[k].sub_id == currentID) {
                            currentCoefEsp = rawArray[k][activeCategory+'_coef_esp'];
                        }
                    }
                }
            }
            var region = new google.maps.Polygon({
              paths: newCoordinates,
              strokeColor: '#000000',
              strokeOpacity: 0.3,
              strokeWeight: 1,
              fillColor: calculateColor(currentCoefEsp),
              fillOpacity: 0.3,
              clickable: false
            });
            regions.push(region);
        }
        return regions;
    }    

    function constructNewCoordinates(polygon) {
        var newCoordinates = [];
        var coordinates = polygon['coordinates'][0];
        for (var i in coordinates) {
          newCoordinates.push(
              new google.maps.LatLng(coordinates[i][1], coordinates[i][0]));
        }
        return newCoordinates;
    }

    function calculateColor(value) {
        var color;
        value<=1 && value>0 ? color = '#ffffff':""
        value<=2 && value>1 ? color = '#E0E0F8':""
        value<=3 && value>2 ? color = '#A9A9F5':""
        value<=4 && value>3 ? color = '#8181F7':""
        value<=5 && value>4 ? color = '#2E2EFE':""
        value>5 ? color = '#0404B4':""
        return color;
    }

    function hexToRgbA(hex){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.5)';
        }
        throw new Error('Bad Hex');
    }

};