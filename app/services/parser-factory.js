angular.module('app.mapaprod').factory('parserFactory', parserFactory);

function parserFactory ($log){ 

    var parser = {};

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

    parser.parseGeneralData = function(rawArray){
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

    parser.parseScatter = function(rawArray,activeCategory,dashboardType){
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
            raw.var_fake      = rawElement[activeCategory+'_var_fake'];
            raw.coef_esp_fake = rawElement[activeCategory+'_coef_esp_fake'];
            raw.part          = rawElement[activeCategory+'_part'];

            //data conversion STRING a int/porcentuales con 2 decimales
            raw.var             = parseFloat( (parseFloat(raw.var)*100)       .toFixed(2) );
            raw.coef_esp        = parseFloat( (parseFloat(raw.coef_esp))      .toFixed(2) );
            raw.var_fake        = parseFloat( (parseFloat(raw.var_fake)*100)  .toFixed(2) );
            raw.coef_esp_fake   = parseFloat( (parseFloat(raw.coef_esp_fake)) .toFixed(2) );
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
                                    raw.coef_esp_fake,
                                    raw.var_fake,
                                    raw.part
                                    ],
                            itemStyle: {normal: { color: raw.color} }
                        });
                }                             
            } else if (raw.subId == 0) { //SubId=0 corresponde al Total Regional/Sectorial
                //Parse line eje X Total Regional/Sectorial
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
                };                             
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
                markLineA,
                markLineB
            ]
        };
        return parsedOptions;
    };

    parser.parseTreemap = function(rawArray,activeCategory){
        var parsedArray = new Array;
        var parsedTree = new Array;
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
        //Transforma la forma de Array lineal a estructura de Arbol
        var map = {}, node, roots = [];
        for (var i = 0; i < parsedArray.length; i += 1) {
            node = parsedArray[i];
            node.children = [];
            map[node.id] = i; // use map to look-up the parents
            if (node.parentID != "0") {
                parsedArray[map[node.parentID]].children.push(node);
            } else {
                parsedTree.push(node);
            }
        }
        //Funcion recursiva para limpiar el arbol de los childrens vacios y de los attributos 'id' y 'parentID',
        //que no corresponden al objeto 'options' del Echart Treemap
        function cleanTree(tree){
          for(var i = 0; i < tree.length; i++) {
            delete tree[i].id;
            delete tree[i].parentID;
            if(tree[i].children.length){
              cleanTree(tree[i].children)
            } else {
                delete tree[i].children;
            }
          }
        }
        cleanTree(parsedTree);
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
                    name:'Volver a Empleo Nacional',
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

    parser.parseMap = function(rawArray,activeCategory,dashboardType){
        var rows = rawArray['rows'];
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

            var randomnumber = Math.floor(Math.random() * 4);
            var region = new google.maps.Polygon({
              paths: newCoordinates,
              strokeColor: '#0E79BF',
              strokeOpacity: 1,
              strokeWeight: 1,
              fillColor: '#98BAC5',
              fillOpacity: 0.3,
              clickable: false
            });
            /*
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

        function constructNewCoordinates(polygon) {
            var newCoordinates = [];
            var coordinates = polygon['coordinates'][0];
            for (var i in coordinates) {
              newCoordinates.push(
                  new google.maps.LatLng(coordinates[i][1], coordinates[i][0]));
            }
            return newCoordinates;
        }

    }

	return parser;
};