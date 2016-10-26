angular.module('app.mapaprod').service('parser', parser);

function parser (common){ 

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

    this.parseScatter = function(rawArray,tree,activeCategory,dashboardType){
        rawArray        = angular.copy(rawArray);
        tree            = angular.copy(tree);
        activeCategory  = angular.copy(activeCategory);


        var parsedTree = preParseTree(rawArray,tree,activeCategory);
        var value;
        for (var i = 0; i < parsedTree.length; i++) {
                value = parsedTree[i].value;
                parsedTree[i].value = [
                    parseFloat( ( ( value['r1s1']/value['r1sA'] ) / ( value['rAs1']/value['rAsA'] ) ).toFixed(2) ),//coef_esp  (11/1A)/(A1/AA)
                    parseFloat( ( ( (value['r1s1'] - value['r1s1_old']) / value['r1s1_old'] )*100   ).toFixed(2) ), //var  ( (new-old)/old )*100
                    parseFloat( ( ( value['r1s1']/value['r1sA'] )*100                               ).toFixed(2) )//part (11/1A)*100
                ]
                delete parsedTree[i].children;
        }

        //[END]Tree parsing

        //Parse line eje X Total Regional/Sectorial
        var markLineA = {
            symbolSize: [2,2],
            tooltip: {
                show: true, formatter: '{b}<br>{c}%'
            },
            itemStyle: {
                normal: { lineStyle: { type: 'dotted', width: 2 }, label: { show: true, position: 'right', formatter: '{c}%' }, },
                emphasis: { lineStyle: { width: 2 } }
            },
            data : [
                    {type: 'average', name: 'Total '+dashboardType}
            ]
        }; 

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
                formatter :  function (params) { return params.name+'<br>'
                                                        +params.value[0]+' '
                                                        +params.value[1]+'% '
                                                        +params.value[2]+'%'; }
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "recargar"},
                    saveAsImage : {show: true, title: "guardar imagen"}
                }
            },
            xAxis : [{ type : 'value', scale: true, min: 0, max: 5, axisLabel: { formatter: '{value}' } }],
            yAxis : [{ type : 'value', scale: true, min: -100, max: 100, axisLabel: { formatter: '{value} %' } }],
            series : [{
                        name:'scatter', 
                        type:'scatter',
                        symbolSize: function (value){
                            var baseRadius = 4;
                            if (value[2] < 1) { return baseRadius*1}
                            else if (value[2] < 5) { return baseRadius*2 }
                            else if (value[2] < 10) { return baseRadius*3 }
                            else if (value[2] < 20) { return baseRadius*4 }
                            else if (value[2] < 30) { return baseRadius*5 }
                            else if (value[2] < 50) { return baseRadius*6 }
                            else if (value[2] < 75) { return baseRadius*7 }
                            else { return baseRadius*8 };                               
                        },
                        data: parsedTree,
                        markLine: markLineA
                },
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

        //[START]Tree parsing
        var parsedTree = preParseTree(rawArray,tree,activeCategory);

        function calculateTree(node) {
            for (var i = 0; i < node.length; i++) {
                    value = node[i].value;
                    node[i].value = parseFloat( ( ( value['r1s1']/value['r1sA'] )*100 ).toFixed(2) )//part (11/1A)*100];
                    if (node[i].children != undefined) 
                    {
                        calculateTree(node[i].children);
                    }
            }            
        }
        calculateTree(parsedTree);
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

    this.parseHeatMap = function(rawPath, rawArray, tree, activeCategory){
        rawPath         = angular.copy(rawPath);
        rawArray        = angular.copy(rawArray);
        tree            = angular.copy(tree);
        activeCategory  = angular.copy(activeCategory);

        var rows = rawPath['rows'];
        var regions = [];
        var currentKML, currentID, currentCoefEsp;

        //[START]Tree parsing
        var parsedTree = preParseTree(rawArray,tree,activeCategory);

        var averagedArray = [];
        for (var i = 0; i < parsedTree.length; i++) {
            for (var j = 0; j < parsedTree[i].children.length; j++) {
                averagedArray.push(angular.copy(parsedTree[i].children[j]));
            }
        }
        var value;
        for (var i = 0; i < averagedArray.length; i++) {
            value = averagedArray[i].value;
            averagedArray[i].value = parseFloat( ( ( value['r1s1']/value['r1sA'] ) / ( value['rAs1']/value['rAsA'] ) ).toFixed(2) )
            delete averagedArray[i].children;
        }
        //[END]Tree parsing


        //MAP POLYGON
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
            //y el tree que me dice que kmlID corresponde con cada id.
            //Primero se itera sobre cada KML. a cada KML se le busca su id correspondiente, y por ultimo con ese id
            //se obtiene el coef_esp que le corresponde
            currentKML = rows[i][0];
            for (var j = 0; j < tree.length; j++) {
                if (tree[j].kmlID == currentKML) {
                    currentID = tree[j].nodeID;
                    for (var k = 0; k < averagedArray.length; k++) {
                        if (averagedArray[k].nodeID == currentID) {
                            currentCoefEsp = averagedArray[k].value;
                        } else {
                            currentCoefEsp = 0;
                        }
                    }
                    break;
                }
                console.log(currentCoefEsp);
            }//Aca esta el bardo, hacelo mañana

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


/////pre FUNCION DE CALCULO DE DATOS

function preParseTree(rawArray,tree,activeCategory) {
        var parsedArray = [];
        var parsedTree = []; 
        var rawElement;
        var raw = {};
        var node = {};

        var r1sA = parseFloat(rawArray[0][activeCategory+'_r1sA']); //Son el mismo valor para todos los elementos del array, por lo que
        var rAsA = parseFloat(rawArray[0][activeCategory+'_rAsA']); //los tomamos como si fuesen 'constantes externas'

        for (var i = 0; i < rawArray.length; i++) {
            //Selecciona el elemento en array y por tipo
            rawElement = rawArray[i];
            raw.sub_id      = rawElement.sub_id;
            raw.r1s1_old    = rawElement[activeCategory+'_r1s1_old'];
            raw.r1s1        = rawElement[activeCategory+'_r1s1'];
            raw.r1sA        = rawElement[activeCategory+'_r1sA'];
            raw.rAs1        = rawElement[activeCategory+'_rAs1'];
            raw.rAsA        = rawElement[activeCategory+'_rAsA'];        

            //JSON array parsing (subId es el ID secundario de region o sector segun corresponda)
            //Por ejemplo. Si seleccionamos la region de Cuyo (region_id=1), el subId es el ID del sector para esa region.
            //En este caso para Cuyo va a existir un ID para cada sector de Cuyo.
            if(raw.r1s1_old != 0 && raw.r1s1 != 0 && raw.r1sA != 0 && raw.rAs1 != 0 && raw.rAsA != 0){
                parsedArray.push(
                    {
                        id: raw.sub_id,
                        value: {
                            r1s1_old: parseFloat(raw.r1s1_old),
                            r1s1:     parseFloat(raw.r1s1),
                            r1sA:     parseFloat(raw.r1sA),
                            rAs1:     parseFloat(raw.rAs1),
                            rAsA:     parseFloat(raw.rAsA)
                        }
                    });
            }
        }

        //[START] TREE PARSING
        //ArrayToTree
        var map = {};
        var node = {};
        for (var i = 0; i < tree.length; i += 1) {
            node = tree[i];
            node.children = [];
            node.value = { r1s1_old: 0, r1s1: 0, r1sA: r1sA, rAs1: 0, rAsA: rAsA };
            map[node.nodeID] = i; // use map to look-up the parents
            if (node.parentID != "0") {
                tree[map[node.parentID]].children.push(node);
            } else {
                parsedTree.push(node);
            }
        }
        parsedTree = {children: parsedTree};

        //Calculate parent values
        var aux = { r1s1_old: 0, r1s1: 0, r1sA: r1sA, rAs1: 0, rAsA: rAsA };
        function calculateChildren(node) {
            // internal nodes get their total from children
            if (node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    aux = calculateChildren(node.children[i]);
                    if (aux != undefined && node.value != undefined) {
                    node.value['r1s1_old'] = node.value['r1s1_old'] + aux['r1s1_old'];
                    node.value['r1s1'] = node.value['r1s1'] + aux['r1s1'];
                    node.value['r1sA'] = r1sA;
                    node.value['rAs1'] = node.value['rAs1'] + aux['rAs1'];
                    node.value['rAsA'] = rAsA;
                    }
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
            delete node.nodeName;
            delete node.parent_id;
            delete node.parentID;
            delete node.color;          
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
        parsedTree.value = { r1s1_old: 0, r1s1: 0, r1sA: r1sA, rAs1: 0, rAsA: rAsA };
        cleanLeafNodes(parsedTree);

        //elimina los nodos cuyo0 'value' es igual a 0
        var indexesToDelete = [];
        function removeUselessNodes(node){
            if (node['children']) { //has children?
                indexesToDelete = [];
                for (var i = 0; i < node.children.length; i++) {
                    if (angular.toJson(node.children[i].value) === angular.toJson({ r1s1_old: 0, r1s1: 0, r1sA: r1sA, rAs1: 0, rAsA: rAsA })) { //uno de sus hijos tiene valor 0?
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

        return parsedTree = parsedTree.children;
}
////////////////////




};