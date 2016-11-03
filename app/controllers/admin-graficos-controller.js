(function () {
    'use strict';
    angular.module('app.mapaprod').controller('adminGraficosCtrl', adminGraficosCtrl);
    function adminGraficosCtrl ($timeout, $scope, $location, databaseFactory, $mdDialog){

    	var self = this;

    	self.entries = [];

    	console.log('Bienvenido al Admin')	



		self.reload = function(){
			self.done = false;
			databaseFactory.getEntries()
				.success(function(response){
					self.entries = response;
					for (var i = 0; i < self.entries.length; i++) {
						self.entries[i].empleo 		= parseInt( self.entries[i].empleo );
						self.entries[i].empleo_old  = parseInt( self.entries[i].empleo_old );
						self.entries[i].export 		= parseInt( self.entries[i].export );
						self.entries[i].export_old  = parseInt( self.entries[i].export_old );
					}
					self.done = true;
					console.log('reloaded');
				})
		}

		//init
		self.reload();

		self.edit = function(entry) {
		    $mdDialog.show({
				controller: 'dialogEditCtrl as dEC',
				bindToController: true,
				clickOutsideToClose: true,
				escapeToClose: true,
				locals: {
					entry: entry
				},
				template:
					'<md-dialog md-theme="default">' +
				    '  <md-toolbar class="md-accent">'+
				    '    <div class="md-toolbar-tools">'+
				    '      <h2>'+
				    '        <span style="color:white;">Modificar Dato</span>'+
				    '      </h2>'+
				    '    </div>'+
				    '  </md-toolbar>'+
					'  <md-dialog-content layout-padding>'+
					'	<span class="md-title">{{dEC.entry.parent_name}} >> {{dEC.entry.region_nombre}}</span><br>'+
					'	<span class="md-subhead" style="color:gray;">{{dEC.entry.sector_nombre}} [{{dEC.entry.sector_ciiu}}]</span><br>'+
					'	<br>'+
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Empleo 2015</label>'+					
					'  		<input type="number" ng-model="dEC.entry.empleo">'+				
					'  	</md-input-container>' +
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Empleo 2007</label>'+					
					'  		<input type="number" ng-model="dEC.entry.empleo_old">'+				
					'  	</md-input-container>' +						
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Export. 2015 (mill USD)</label>'+					
					'  		<input type="number" ng-model="dEC.entry.export">'+				
					'  	</md-input-container>' +
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Export. 2007 (mill USD)</label>'+					
					'  		<input type="number" ng-model="dEC.entry.export_old">'+				
					'  	</md-input-container>' +
    				'	<br><span ng-show="dEC.failed" style="color:red;">ERROR No se pudo actualizar</span>'+													
					'  </md-dialog-content>' +
					'  <md-dialog-actions>' +
					'    <md-button ng-click="dEC.save()" class="md-accent">' +
					'      Guardar' +
					'    </md-button>' +
					'    <md-button ng-click="dEC.cancel()" class="md-accent">' +
					'      Cancelar' +
					'    </md-button>' +
					'    <md-button ng-click="dEC.delete()" class="md-warn md-raised">' +
					'	   <md-icon md-svg-src="assets/svg/rubbish-bin.svg"></md-icon>'+
					'      Eliminar' +
					'    </md-button>' +					
					'  </md-dialog-actions>' +
					'</md-dialog>',
				parent: angular.element(document.body)
		    }).then(function(){
		    	self.reload();
		    });
		};

		self.add = function() {
		    $mdDialog.show({
				controller: 'dialogAddCtrl as dAC',
				bindToController: true,
				clickOutsideToClose: true,
				escapeToClose: true,
				template:
					'<md-dialog md-theme="default">' +
				    '  <md-toolbar class="md-accent">'+
				    '    <div class="md-toolbar-tools">'+
				    '      <h2>'+
				    '        <span style="color:white;">Agregar Nuevo Dato</span>'+
				    '      </h2>'+
				    '    </div>'+
				    '  </md-toolbar>'+						
					'  <md-dialog-content layout-padding>'+				
					'	<md-divider></md-divider>'+
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<span>Region</span>'+					
					'       <md-select ng-model="dAC.selectedRegion">'+
					'         <md-option ng-repeat="dep in dAC.regionTree | filter:{depth: 3}" ng-value="dep">'+
					'           {{dep.nodePath}} > {{dep.nodeName}}'+
					'         </md-option>'+
					'       </md-select>'+
					'  	</md-input-container>' +
					'	<md-divider></md-divider>'+
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<span>Sector</span>'+					
					'       <md-select ng-model="dAC.selectedSector">'+
					'         <md-option ng-repeat="clase in dAC.sectorTree | filter:{depth: 4}" ng-value="clase">'+
					'           {{clase.nodePath}} > {{clase.nodeName}}'+
					'         </md-option>'+
					'       </md-select>'+			
					'  	</md-input-container>' +
					'	<md-divider></md-divider>'+
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Empleo 2015</label>'+					
					'  		<input type="number" ng-model="dAC.entry.empleo">'+				
					'  	</md-input-container>' +
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Empleo 2007</label>'+					
					'  		<input type="number" ng-model="dAC.entry.empleo_old">'+				
					'  	</md-input-container>' +						
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Export. 2015 (mill USD)</label>'+					
					'  		<input type="number" ng-model="dAC.entry.export">'+				
					'  	</md-input-container>' +
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Export. 2007 (mill USD)</label>'+					
					'  		<input type="number" ng-model="dAC.entry.export_old">'+				
					'  	</md-input-container>' +
					'	<md-divider></md-divider>'+
    				'	<br><span ng-show="dAC.failed" style="color:red;">ERROR No se pudo modificar la base de datos</span>'+													
					'  </md-dialog-content>' +
					'  <md-dialog-actions>' +
					'    <md-button ng-click="dAC.save()" class="md-accent">' +
					'      Agregar' +
					'    </md-button>' +
					'    <md-button ng-click="dAC.cancel()" class="md-accent">' +
					'      Cancelar' +
					'    </md-button>' +								
					'  </md-dialog-actions>' +
					'</md-dialog>'+
					'<style>	'+
					'md-option .md-text {font-family:\'Roboto-light\' !important; font-size: small}'+
					'md-select {font-family:\'Roboto-light\' !important; font-size: small}'+
					'<style>	',
				parent: angular.element(document.body)
		    }).then(function(){
		    	self.reload();
		    });
		};

    };
})();


(function () {
    'use strict';
    angular.module('app.mapaprod').controller('dialogEditCtrl', dialogEditCtrl);
    function dialogEditCtrl (databaseFactory,$mdDialog, entry){
    	
    	var self = this;

    	self.failed = false;
    	self.entry = angular.copy(entry);

    	self.save = function () {
    		self.failed = false;
    		databaseFactory.editEntry(self.entry)
    			.success(function(response){
    				if (response == 'true') { //SUCCESS
						$mdDialog.hide();
						console.log('Success');
    				} else { //FAIL
    					self.failed = true;
    					console.log('Fail');
    				}
    			});
    	}

    	self.delete = function () {
    		self.failed = false;
    		databaseFactory.deleteEntry(self.entry)
    			.success(function(response){
    				if (response == 'true') { //SUCCESS
						$mdDialog.hide();
						console.log('Success');
    				} else { //FAIL
    					self.failed = true;
    					console.log('Fail');
    				}
    			});
    	}

    	self.cancel = function () {
    		$mdDialog.hide();
    	}

    }
})();

(function () {
    'use strict';
    angular.module('app.mapaprod').controller('dialogAddCtrl', dialogAddCtrl);
    function dialogAddCtrl (databaseFactory,$mdDialog,common){
    	
    	var self = this;

    	self.failed = false;
    	self.entry = {
    		region_id: 555,
    		sector_id: 444,
    		empleo: 0,
    		empleo_old: 0,
    		export: 0,
    		export_old: 0
    	}

		databaseFactory.getSectorTree()
    		.success(function(response){
    			self.sectorTree = response;
    			for (var i = 0; i < self.sectorTree.length; i++) {
    				self.sectorTree[i].nodePath = common.getNodePath(self.sectorTree[i],self.sectorTree);
    				self.sectorTree[i].nodePath = self.sectorTree[i].nodePath[0].nodeName.substring(0,40) + ' > ' + self.sectorTree[i].child_id
    			}    			
			});

		databaseFactory.getRegionTree()
    		.success(function(response){
    			self.regionTree = response;
    			for (var i = 0; i < self.regionTree.length; i++) {
    				self.regionTree[i].nodePath = common.getNodePathString(self.regionTree[i],self.regionTree);
    			}
			});			

    	self.save = function () {
    		self.failed = false;
    		self.entry.region_id = self.selectedRegion.nodeID;
    		self.entry.sector_id = self.selectedSector.nodeID;
    		databaseFactory.addEntry(self.entry)
    			.success(function(response){
    				if (response == 'true') { //SUCCESS
						$mdDialog.hide();
						console.log('Success');
    				} else { //FAIL
    					self.failed = true;
    					console.log('Fail');
    				}
    			});
    	}

    	self.cancel = function () {
    		$mdDialog.hide();
    	}

    }
})();