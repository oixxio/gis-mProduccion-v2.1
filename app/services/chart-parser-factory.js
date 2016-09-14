angular.module('app.mapaprod').factory('chartParserFactory', chartParserFactory);

function chartParserFactory ($http){ 

    var chartParser = {};

    chartParser.parseScatter = function(rawArray,activeCategory,dashboardType){
        var parsedData = [];
        var rawElement;
        var raw = {};
        for (var i = 0; i < rawArray.length; i++) {
            
            //Selecciona el elemento en array y por tipo
            rawElement = rawArray[i];
            raw.subId         = rawElement.sub_id;
            raw.nombre        = rawElement.nombre;
            raw.var           = rawElement[activeCategory+'_var'];
            raw.coef_esp      = rawElement[activeCategory+'_coef_esp'];
            raw.var_fake      = rawElement[activeCategory+'_var_fake'];
            raw.coef_esp_fake = rawElement[activeCategory+'_coef_esp_fake'];
            raw.part_prov     = rawElement[activeCategory+'_part_prov'];

            //data conversion STRING a int/porcentuales con 2 decimales
            raw.var             = parseFloat( (parseFloat(raw.var)*100)       .toFixed(2) );
            raw.coef_esp        = parseFloat( (parseFloat(raw.coef_esp))      .toFixed(2) );
            raw.var_fake        = parseFloat( (parseFloat(raw.var_fake)*100)  .toFixed(2) );
            raw.coef_esp_fake   = parseFloat( (parseFloat(raw.coef_esp_fake)) .toFixed(2) );
            raw.part_prov       = parseFloat( (parseFloat(raw.part_prov)*100) .toFixed(2) );

            //JSON array parsing (subId es el ID secundario de region o sector segun corresponda)
            //Por ejemplo. Si seleccionamos la region de Cuyo (region_id=1), el subId es el ID del sector para esa region.
            //En este caso para Cuyo va a existir un ID para cada sector de Cuyo.
            if (raw.subId != 0) {
                //Parse datos EMPLEO
                if(raw.var != 0 && raw.part_prov != 0 && raw.coef_esp != 0){
                    //var colorB = hexToRgbA(getColorByName(raw.abvSector)); //REVISAR
                    parsedData.push(
                        {
                            name: raw.nombre+ '<br> '
                                 + raw.var + '% '
                                 + raw.coef_esp,
                            value: [
                                    raw.coef_esp_fake,
                                    raw.var_fake,
                                    raw.part_prov
                                    ],
                            itemStyle: {normal: { color: '#00ff00'} }
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
                            var baseRadius = 1.5;
                            if (value < 1) { return baseRadius*1}
                            else if (value < 5) { return baseRadius*2 }
                            else if (value < 10) { return baseRadius*3 }
                            else if (value < 20) { return baseRadius*4 }
                            else if (value < 30) { return baseRadius*5 }
                            else if (value < 50) { return baseRadius*6 }
                            else if (value < 75) { return baseRadius*7 }
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

	return chartParser;
};