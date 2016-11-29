(function () {
    'use strict';
    angular.module('app.mapaprod').controller('singleDashCtrl', singleDashCtrl);
    function singleDashCtrl ($location, linkFactory, databaseFactory, parser, $mdMedia, $scope, $timeout, $rootScope, common,$window,$anchorScroll,$mdDialog) {

		//////////CTRL Init Code
		var self = this;
		self.done = false;	//Este Done se usa para cuando se carga la primera vez, para notificar afuera del la directiva y al progress-circular (spinner)
		self.doneB = false; //Este se usa para esconder y mostrar la barrita propia de la directiva. Se comporta diferente al 'self.done'
		self.hideExportCSV = false;
		self.hidePrintScreen = false;
		self.nodeData = {};
		self.generalData = {};
		self.currentNode = {};
		self.regionPolygons = [];
		self.dashboardType = 'region';
		self.dashboardContraType = 'sector';
		self.activeCategory = 'empleo';
		self.rawResponse = {};
		self.parsedResponse = {
			scatter: new Object(),
			treemap: new Object(),
			generalData: new Object(),
			map: new Object(),
			heatMap: new Object()
		};
		self.mapObject = {};
		self.isReady = {
			scatter: false,
			treemap: false,
			generalData: false,
			map: false,
			mapObject: false,
			check: function() {
				return (this.scatter && this.treemap && this.generalData && this.map && this.mapObject)
			}
		};
		self.isLayerDone = true;

		

		//////////Init Code
		var aux = $location.search();
		var aux1,aux2;
		// Con la función "$location.search();" obtengo el Json encriptado para poder cargar la pagina desde el lugar donde se tomo el path.
		if (aux.param !== "value" && typeof aux.param !== 'undefined') {
			// atob = para desencriptar.
			aux1 = atob(aux.param);
			aux2 = aux1.split("-");
			self.dashboardType = aux2[0];
			self.currentNode = JSON.parse(aux2[1]);
		}else{
			self.dashboardType = linkFactory.getDashboardType();
			self.currentNode = linkFactory.getSelectedNode(self.identifier);
		}

		self.dashboardContraType = (self.dashboardType === 'region') ? 'sector' : 'region';	
		// Path con la informacion necesaria para poder abrir la pagina desde el lugar donde se tomo la referencia. Json Encriptado.	
		// btoa = para Encriptar.
		self.pathReference = window.location.href+ "/?" + "param=" + btoa(self.dashboardType + "-" + JSON.stringify(self.currentNode));
		initLayout();  	
		//////////

		/////////////////////////////////SINCRONISMO
	    //Se ejecuta cuando todos los componentes se terminaron de cargar
		$scope.$watch(angular.bind(self, function() { return self.isReady.check();}),
			function(){
				populateCharts();
				populateGeneralData();
				if (self.dashboardType == 'region') {
					populateMap();
				} else if (self.dashboardType == 'sector') {
					populateHeatMap();
				}
				console.log(self.identifier + '|' + "READY ALL");
				$timeout(resetSizes(), 100);
				self.done = true;
				self.doneB = true;
		});
		/////////////////////////////////SINCRONISMO

		////////Si se quiere acceder directo al dashboard y no se hizo el path correspondiente,
		////////ni hay localstorage, redirecciona a selector
		if (self.dashboardType == null || self.currentNode == null) {
			$location.path('/selector');
		}
		////////

    	//////////Mediaquerys para responsive  
		$scope.$watch( function() { return $mdMedia('xs'); 		  	}, resetSizes);    	
		$scope.$watch( function() { return $mdMedia('sm'); 		  	}, resetSizes);
		$scope.$watch( function() { return $mdMedia('md'); 			}, resetSizes); 		
		$scope.$watch( function() { return $mdMedia('landscape'); 	}, resetSizes);
		function resetSizes() {
			$timeout(
				function() {
					if (self.isReady.check()) {
						initLayout();
						self.treemap.resize();
						self.scatter.resize();
						console.log(self.identifier + '|' + 'Resized');
					}
				}, 100)
		}		 		            
	    //////////Mediaquerys para responsive 


		//////////Similar a Document.ready
	    angular.element(document).ready(function () {
	    	var complexID = self.identifier + 'complex'
			var treemapID = self.identifier + 'treemap';
			var scatterID = self.identifier + 'scatter';
			self.complex = echarts.init(document.getElementById(complexID));
			self.treemap = echarts.init(document.getElementById(treemapID));
			self.scatter = echarts.init(document.getElementById(scatterID));

			initMap();
			fetchAndParseAll();
			console.log(self.identifier + '|' + "READY angular.element(document).ready");
	    });
	    //////////

    	//MAP Init code
    	function initMap() {
			var styles = [
						{
					  		'featureType': 'all',
					  		'elementType': 'all',
					  		'stylers': [{'visibility': 'on'}]
						},
						{
							'featureType': 'landscape',
							'elementType': 'geometry',
							'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
						},
						{
							'featureType': 'administrative',
							'elementType': 'labels',
							'stylers': [{'visibility': 'on'}]
						},						
						{
							'featureType': 'water',
							'elementType': 'labels',
							'stylers': [{'visibility': 'off'}]
						},
						{
							'featureType': 'water',
							'elementType': 'geometry',
							'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
						}];

	        var myOptions = {
				zoom: 4,
				center: new google.maps.LatLng(-40.3, -63.7),
				disableDefaultUI: true,
				scrollwheel: false,
				clickableIcons: false,
				disableDoubleClickZoom: true,
				draggable: false,
				styles: styles,
				mapTypeId: google.maps.MapTypeId.ROADMAP
	        };

	        var mapID = self.identifier + 'map';
	        self.mapObject = new google.maps.Map(document.getElementById(mapID),
	            myOptions);

			google.maps.event.addListener(self.mapObject, 'idle', function(){
			    console.log(self.identifier + '|' + 'READY google.maps.event.addListener');
			    self.isReady.mapObject = true;
			    $scope.$apply();
			});

	        console.log(self.identifier + '|' + 'READY initMap()');
    	}

		//////////Retrieve data from database
		function fetchAndParseAll() {
			self.doneB = false;
			//////////TREEMAP
			databaseFactory.getSectorTree()
	    		.success(function(response){
	    			self.rawResponse.sectorTree = response;
					databaseFactory.getRegionTree()
			    		.success(function(response){
			    			self.rawResponse.regionTree = response;



			    			////////////TREEMAP & SCATTER
							databaseFactory.getResults(self.currentNode.nodeID,self.dashboardType,self.currentNode.depth)
								.success(function(response){
									self.rawResponse.entries = response;
									self.parsedResponse.treemap.empleo = parser.parseTreemap(self.rawResponse.entries,self.rawResponse[self.dashboardContraType+'Tree'],'empleo');
									self.parsedResponse.treemap.export = parser.parseTreemap(self.rawResponse.entries,self.rawResponse[self.dashboardContraType+'Tree'],'export');
									self.isReady.treemap = true;
									self.parsedResponse.scatter.empleo = parser.parseScatter(self.rawResponse.entries,self.rawResponse[self.dashboardContraType+'Tree'],'empleo',self.dashboardType)
									self.parsedResponse.scatter.export = parser.parseScatter(self.rawResponse.entries,self.rawResponse[self.dashboardContraType+'Tree'],'export',self.dashboardType)									
									console.log(self.identifier + '|' + "READY databaseFactory.getResults");
									self.isReady.scatter = true;
								});//END databaseFactory.getResults

					        ////////////MAPA & HEATMAP
					        if (self.dashboardType == 'region') {
					        	databaseFactory.getMapData(self.currentNode,self.rawResponse.regionTree,self.dashboardType)
						        	.success(function(response){
						    			self.rawResponse.map = response;
						    			self.parsedResponse.map = parser.parseMap(self.rawResponse.map,self.rawResponse.regionTree,self.identifier,self.currentNode);
					    				console.log(self.identifier + '|' + "READY databaseFactory.getMapData");
					    				self.isReady.map = true;
						    		});	//END databaseFactory.getMapData
						    } else if (self.dashboardType == 'sector') {
				    			//Selecciona todas las provincias. Depth=2
				    			var provincias = [];
				    			for (var i = 0; i < self.rawResponse.regionTree.length; i++) {
				    				if (self.rawResponse.regionTree[i].depth == 2) {
				    					provincias.push(self.rawResponse.regionTree[i].kmlID);
				    				}
				    			}
				    			databaseFactory.getMapData('','',self.dashboardType)
						        	.success(function(response){
						    			self.rawResponse.map = response;
						    			console.log("READY HeatMap databaseFactory.getMapData");
						    			// console.log(self.currentNode.nodeID);
						    			// console.log(self.currentNode.depth);
										databaseFactory.getResults(self.currentNode.nodeID,'sector',self.currentNode.depth) //Heatmap tiene los mismos datos que el scatter
											.success(function(response){
												self.rawResponse.heatMap = response;
												self.parsedResponse.heatMap.empleo = parser.parseHeatMap(self.rawResponse.map,self.rawResponse.heatMap,self.rawResponse.regionTree,'empleo');
												self.parsedResponse.heatMap.export = parser.parseHeatMap(self.rawResponse.map,self.rawResponse.heatMap,self.rawResponse.regionTree,'export');
								    			console.log(self.identifier + '|' + "READY HeatMap databaseFactory.getResults");
								    			self.isReady.map = true;
											}); // END databaseFactory.getResults
						    		});	// END databaseFactory.getMapData
						    }//END MAPA & HEATMAP

						});//END databaseFactory.getRegionTree
				});//END databaseFactory.getSectorTree
			
			//////////DATOS GENERALES
			databaseFactory.getGeneralData(self.currentNode.nodeID,self.dashboardType)
				.success(function(response){
					self.rawResponse.generalData = response;
					self.parsedResponse.generalData = parser.parseGeneralData(self.rawResponse.generalData);
					console.log(self.identifier + '|' + "READY databaseFactory.getGeneralData");
					self.isReady.generalData = true;
				});

		}


		///////////Funciones para popular todos los elementos del dashboard
		function populateCharts() {
			setChartTitles(self.activeCategory, self.dashboardType);
			self.scatter.setOption(self.parsedResponse.scatter[self.activeCategory],true);
			self.isReady.scatter = false;
			self.treemap.setOption(self.parsedResponse.treemap[self.activeCategory],true);
			self.isReady.treemap = false;				
		}

		function populateGeneralData() {
			self.generalData = self.parsedResponse.generalData;
			self.isReady.generalData = false;
		}

		function populateMap() {
			self.parentName = common.getNodeById(self.currentNode.parentID, self.rawResponse.regionTree).nodeName;

			var coordinates = {};
			for (var i = 0; i < self.regionPolygons.length; i++) {
				self.regionPolygons[i].setMap(null);
			}		
			self.regionPolygons = self.parsedResponse.map;		
			//Auto-zoom y posicionamiento
			var latlngbounds = new google.maps.LatLngBounds();
			for (var i = 0; i < self.regionPolygons.length; i++) {
				coordinates = self.regionPolygons[i].getPath().getArray();
				for (var j = 0; j < coordinates.length; j++) {
					latlngbounds.extend(coordinates[j]);
				}
			}
			self.mapObject.fitBounds(latlngbounds);	
			//Dibuja los polygonos en el mapa
			for (var i = 0; i < self.regionPolygons.length; i++) {
				self.regionPolygons[i].setMap(self.mapObject);
			}		
			self.isReady.map = false;								
		}

		function populateHeatMap() {
			//Borra los poligonos ya dibujados
			for (var i = 0; i < self.regionPolygons.length; i++) {
				self.regionPolygons[i].setMap(null);
			}			
			console.log(self.activeCategory);
			self.regionPolygons = self.parsedResponse.heatMap[self.activeCategory];
			//Dibuja los polygonos en el mapa
			for (var i = 0; i < self.regionPolygons.length; i++) {
				self.regionPolygons[i].setMap(self.mapObject);
			}			
			self.isReady.map = false;
		}
		///////////Funciones para popular todos los elementos del dashboard


	    ///////////Botonera selector de categorias   
		self.setActiveCategory = function (category) {

			/////////////////Reposiciono la página
			$location.hash('ejeX');
		    $anchorScroll();
			/////////////////Reposiciono la página

			self.activeCategory = category;
				populateCharts();
			if (self.dashboardType == 'sector') {
				populateHeatMap();
			}
			console.log(self.identifier + '|' + "READY Category changed: "+category);
		}
		///////////Botonera selector de categorias   


		/////////////////MAP NAVIGATION
		$rootScope.$watch(self.identifier+'clickedId',
			function(){
				if ($rootScope[self.identifier+'clickedId'] != undefined) {
					var auxNode;
					auxNode = common.getNodeById($rootScope[self.identifier+'clickedId'],self.rawResponse.regionTree)
					linkFactory.setSelectedNode(auxNode,self.identifier);
					self.currentNode = auxNode;
					linkFactory.setDashboardType('region');
					fetchAndParseAll();			
				}
			}, true);

		self.returnToParent = function () {
			$rootScope[self.identifier+'clickedId'] = common.getNodeById(self.currentNode.parentID,self.rawResponse.regionTree).nodeID;
			$rootScope.$apply();
		}		
		/////////////////////MAP NAVIGATION


		////////////////////MAP InfoWindow 

		$rootScope.$watch(self.identifier+'hoveredName',
			function(){
				self.hoveredName = $rootScope[self.identifier+'hoveredName'];
				self.MapTooltipClass = 'map-tooltip-fade-in';
				//$timeout(function(){self.MapTooltipClass = '';}, 100);
			});

		$rootScope.$watch(self.identifier+'mapTooltipClass',
			function(){
				self.MapTooltipClass = $rootScope[self.identifier+'mapTooltipClass'];
			});

		/////////////////////MAP InfoWindow 

		/////////////////MAP LAYERS

		self.mapLayers = [
			{
				name: 'Rutas Nacionales',
				svgName: 'road',
				active: false,
				geojsonName: 'rutas'
			},
			{
				name: 'Televisión Digital Abierta',
				svgName: 'television',
				active: false,
				geojsonName: 'tda'
			}/*,
			{
				name: 'Ruta Ferroviarias',
				svgName: 'railroad',
				active: false,
				geojsonName: 'trenes'
			},
			{
				name: 'Universidades',
				svgName: 'book',
				active: false,
				geojsonName: 'unis'
			},
			{
				name: 'Usinas Nucleares',
				svgName: 'power-station',
				active: false,
				geojsonName: 'usinas'
			}		*/										
		]

		self.toggleLayer = function (index) {
			self.mapLayers[index].active = !self.mapLayers[index].active;
			if (self.mapLayers[index].active == true) {
				self.isLayerDone = false;
				self.mapObject.data.loadGeoJson(
					'assets/geojson/'+self.mapLayers[index].geojsonName+'.geojson',
					{},
					function(features){ //callback
						for (var i = 0; i < features.length; i++) {
							features[i].setProperty('id', self.mapLayers[index].geojsonName); //seteo una propiedad con el id para poder eliminarlo selectivamente luego
						}
						self.isLayerDone = true;
					});	
			} else {
				self.mapObject.data.forEach(function(feature) {
					if (feature.getProperty('id') == self.mapLayers[index].geojsonName) { //elimino selectivamente a partir del id que le inyecte al principio
						self.mapObject.data.remove(feature);
					}
			    });
			}
		}

		self.isLayerActive = function (index) {
			return self.mapLayers[index].active ? 'md-warn' : '';
		}
		/////////////////MAP LAYERS


        ////////////HEATMAP
        //Para esconder/mostrar la escala del HeatMap
        self.isHeatMapScaleVisible = function(type){
        	if (type == 'sector') {
        		return true;
        	} else {
        		return false;
        	}
        }
        ////////////HEATMAP


        ////////////CHARTS
        function setChartTitles(category, type) {
        	if (type == 'region') {				
				if (category == 'empleo') {
					self.treemap.title = 'Participación sectorial en empleo region (2015)';
					self.scatter.title = 'Matriz de clasificación de Empleo por Región (2007-2015)';
				} else if (category == 'export') {
					self.treemap.title = 'Participación sectorial en exportación region (2015)';
					self.scatter.title = 'Matriz de clasificación de Export. por Región (2007-2015)';
				}
			} else if (type == 'sector') {
				if (category == 'empleo') {
					self.treemap.title = 'Participación regional en empleo sectorial (2015)';
					self.scatter.title = 'Matriz de clasificación de Empleo por Sector (2007-2015)';
				} else if (category == 'export') {
					self.treemap.title = 'Participación regional en exportación sectorial (2015)';
					self.scatter.title = 'Matriz de clasificación de Export. por Sector (2007-2015)';
				}				
			}
			if (category == 'empleo') {
				self.scatter.xAxis = 'Coef. de especialización Empleo';
				self.scatter.yAxis = 'Grado de dinámica Empleo';
			} else if (category == 'export') {
				self.scatter.xAxis = 'Coef. de especialización Exportación';
				self.scatter.yAxis = 'Grado de dinámica Exportación';
			}
        }
        ////////////CHARTS


		function initLayout() {
			if (self.layoutMode == 'compact') {
				self.generalSize = 100;
				self.topDivLayout = 'column';
			}
			else { //Normal layout-mode
				if ($mdMedia('gt-sm')) {
					self.generalSize = 50;
					self.topDivLayout = 'row';
				}
				else {
					self.generalSize = 100;
					self.topDivLayout = 'column';	
				}
			}
		}

		// Arma la tabla y exporta el archivo CSV
		self.exportCSV = function (){		
			var aux = parser.parseCsvInfo(self.rawResponse.entries,self.rawResponse[self.dashboardContraType+'Tree'],self.activeCategory);
			var aux1,aux2,aux3,aux4,csv,labelTitle;
	
			if (self.dashboardType === "sector") {
				var title =  "Sector:" + self.currentNode.nodeName + "\n" + "Categoría:" + self.activeCategory + "\n"+ "\n";
				var header = ":Nombre:Participación (%):Coef. Especialización:Grado Dinámica (%):Valor 07:Valor 15\n";
				var esp = ":::::::\n";
				var reg = "Región";
				var prov = "Provincia";
				var dpto = "Departamento";
				for (var i = 0; i < aux.length; i++) {
				aux1 = aux[i].children;
				reg = reg.concat(   ":" + aux[i].name +
									":" + aux[i].value.part + 
									":" + aux[i].value.coef_esp + 
									":" + aux[i].value.var + 
									":" + aux[i].value.cant_07 + 
									":" + aux[i].value.cant_15 + '\n'
								);						
					for (var j = 0; j < aux1.length; j++) {
						aux2 = aux1[j].children;
						prov =prov.concat(	":" + aux1[j].name +
											":" + aux1[j].value.part + 
											":" + aux1[j].value.coef_esp + 
											":" + aux1[j].value.var + 
											":" + aux1[j].value.cant_07 + 
											":" + aux1[j].value.cant_15 + '\n'
										);
						for (var x = 0; x < aux2.length; x++) {
							aux3 = aux2[x].children;
							dpto =dpto.concat(	":" + aux2[x].name + 
												":" + aux2[x].value.part + 
												":" + aux2[x].value.coef_esp + 
												":" + aux2[x].value.var + 
												":" + aux2[x].value.cant_07 + 
												":" + aux2[x].value.cant_15 + '\n'
											);
						}
					}
				}
				csv = title + header + reg + prov + dpto;	
			}else {
				if (self.currentNode.depth == "1") {
					labelTitle = "Región";
				}else if (self.currentNode.depth == "2") {
					labelTitle = "Provincia";
				}else if (self.currentNode.depth == "3") {
					labelTitle = "Departamento";
				}else{labelTitle = "Nación";}

				var title =  labelTitle + ":" + self.currentNode.nodeName + "\n" + "Categoría:" + self.activeCategory + "\n"+ "\n";
				var header = ":Nombre:CIIU:Participación (%):Coef. Especialización:Grado Dinámica (%):Valor 07:Valor 15\n";
				var esp = ":::::::\n";
				var sec = "Sección";
				var div = "División";
				var grup = "Grupo";
				var clas = "Clase";
				for (var i = 0; i < aux.length; i++) {
				aux1 = aux[i].children;
				sec = sec.concat(   ":" + aux[i].name + 
									":" + aux[i].child_id + 
									":" + aux[i].value.part + 
									":" + aux[i].value.coef_esp + 
									":" + aux[i].value.var + 
									":" + aux[i].value.cant_07 + 
									":" + aux[i].value.cant_15 + '\n'
								);						
					for (var j = 0; j < aux1.length; j++) {
						aux2 = aux1[j].children;
						div =div.concat(	":" + aux1[j].name + 
											":" + aux1[j].child_id + 
											":" + aux1[j].value.part + 
											":" + aux1[j].value.coef_esp + 
											":" + aux1[j].value.var + 
											":" + aux1[j].value.cant_07 + 
											":" + aux1[j].value.cant_15 + '\n'
										);
						for (var x = 0; x < aux2.length; x++) {
							aux3 = aux2[x].children;
							grup =grup.concat(	":" + aux2[x].name + 
												":" + aux2[x].child_id + 
												":" + aux2[x].value.part + 
												":" + aux2[x].value.coef_esp + 
												":" + aux2[x].value.var + 
												":" + aux2[x].value.cant_07 + 
												":" + aux2[x].value.cant_15 + '\n'
											);
							for (var z = 0; z < aux3.length; z++) {
								clas =clas.concat(	":" + aux3[z].name + 
													":" + aux3[z].child_id + 
													":" + aux3[z].value.part + 
													":" + aux3[z].value.coef_esp + 
													":" + aux3[z].value.var + 
													":" + aux3[z].value.cant_07 + 
													":" + aux3[z].value.cant_15 + '\n'
												);
							} 
						}
					}
				}
				csv = title + header + sec + div + grup + clas;	
			}
			downloadCSV(csv, 'csv file.csv', 'text/csv');
		}

		// Exporta el archivo CSV
		function downloadCSV(content, fileName, mimeType) {
	  		var a = document.createElement('a');
	  		mimeType = mimeType || 'application/octet-stream';

	  		if (navigator.msSaveBlob) { // IE10
	    		return navigator.msSaveBlob(new Blob([content], { type: mimeType }), fileName);
	  		} else if ('download' in a) { //html5 A[download]
		    	a.href = 'data:' + mimeType + ',' + encodeURIComponent(content);
		   	 	a.setAttribute('download', fileName);
		    	document.body.appendChild(a);
		    	a.click();
		    	document.body.removeChild(a);
		    	return true;
	  		} else { //do iframe dataURL download (old ch+FF):
		    	var f = document.createElement('iframe');
		    	document.body.appendChild(f);
		    	f.src = 'data:' + mimeType + ',' + encodeURIComponent(content);

		    	setTimeout(function() {
		      		document.body.removeChild(f);
		    	}, 333);
		    	return true;
	  		}
		}

		// Arma la tabla y exporta el archivo CSV
		self.printScreen = function (){
			if (window.location.hash === "#/comparacion") {
				self.parsedResponse.comparison = true;
				console.log(self.parsedResponse);
				$window.open('/gis-mProduccion-v2.1/#/dashboardPrint');
			}else{
				$location.path('/dashboardPrint');
				self.parsedResponse.comparison = false;
			}
			linkFactory.setPrintInfo(self.parsedResponse,self.rawResponse,self.currentNode);
		}

        //Para esconder/mostrar los Botones de ExportCSV y PrintPDF
        self.isFixButtonVisible = function(){
        	if ($location.path() == '/comparacion') {
        		return false;
        	} else {
        		return true;
        	}
        }

        self.shareScreen = function() {
		    
		    $mdDialog.show({
				controller: 'singleDashCtrl as dCP',
				bindToController: true,
				clickOutsideToClose: true,
				escapeToClose: true,
				template:
					'<md-dialog md-theme="default">' +
				    '  	<md-toolbar class="md-accent">'+
				    '    	<div class="md-toolbar-tools">'+
				    '      		<h2>'+
				    '       		<span style="color:white;">Link para compartir</span>'+
				    '      		</h2>'+
				    '    	</div>'+
				    '  	</md-toolbar>'+						
					'  	<md-dialog-content layout-padding style="margin-top: 15px;">'+
					'		<input id="shareLink" value="{{dCP.pathReference}}" style="width: 400px;margin-bottom: 15px;">'+
					'		<button class="btn" ngclipboard data-clipboard-target="#shareLink">'+
					'   		<md-icon md-svg-src="assets/svg/copy.svg" alt="Copy to clipboard"></md-icon>'+
					'		</button>'+						
					'  	</md-dialog-content>' +
					'</md-dialog>'+
					'<style>	'+
					'	.ext-content { padding: 50px;  margin: 20px; background-color: #FFF2E0; }'+
					'<style>	',
				parent: angular.element(document.body)
		    });
		};
    }
})();
