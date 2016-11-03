(function () {
    'use strict';
    angular.module('app.mapaprod').controller('adminRegionesCtrl', adminRegionesCtrl);
    function adminRegionesCtrl ($timeout, $scope, $location, databaseFactory, $mdDialog){

    	var self = this;

    	self.generalData = [];

		self.reload = function(){
			self.done = false;
			databaseFactory.getAllRegionGeneralData()
				.success(function(response){
					self.generalData = response;
					console.log(self.generalData);
					for (var i = 0; i < self.generalData.length; i++) {
						switch(self.generalData[i].depth) {
							case '0': self.generalData[i].depth_name = 'Pais'; break;
							case '1': self.generalData[i].depth_name = 'Región'; break;
							case '2': self.generalData[i].depth_name = 'Provincia'; break;
							case '3': self.generalData[i].depth_name = 'Departamento'; break;
						}
						self.generalData[i].poblacion 			= parseInt( self.generalData[i].poblacion );
						self.generalData[i].poblacion_part 		= parseFloat( self.generalData[i].poblacion_part );
						self.generalData[i].pbg 				= parseInt( self.generalData[i].pbg );
						self.generalData[i].pbg_part 			= parseFloat( self.generalData[i].pbg_part );
						self.generalData[i].empleo_pub 			= parseInt( self.generalData[i].empleo_pub );
						self.generalData[i].empleo_pub_part 	= parseFloat( self.generalData[i].empleo_pub_part );
						self.generalData[i].export 				= parseInt( self.generalData[i].export );
						self.generalData[i].export_part 		= parseFloat( self.generalData[i].export_part );
					}
					self.done = true;
					console.log('reloaded');
				})
		}

		//init
		self.reload();

		self.edit = function(entry) {
		    $mdDialog.show({
				controller: 'dialogEditCtrlb as dECb',
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
					'	<span class="md-title">{{dECb.entry.parent_name}} >> {{dECb.entry.region_nombre}}</span><br>'+
					'	<br>'+
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Población</label>'+					
					'  		<input type="number" ng-model="dECb.entry.poblacion">'+				
					'  	</md-input-container>' +
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Part. Población</label>'+					
					'  		<input type="number" ng-model="dECb.entry.poblacion_part">'+				
					'  	</md-input-container>' +						
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>PBG</label>'+					
					'  		<input type="number" ng-model="dECb.entry.pbg">'+				
					'  	</md-input-container>' +
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Part. PBG</label>'+					
					'  		<input type="number" ng-model="dECb.entry.pbg_part">'+				
					'  	</md-input-container>' +
					'	<br>'+
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Empleo Público</label>'+					
					'  		<input type="number" ng-model="dECb.entry.empleo_pub">'+				
					'  	</md-input-container>' +
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Part. Empleo Pub.</label>'+					
					'  		<input type="number" ng-model="dECb.entry.empleo_pub_part">'+				
					'  	</md-input-container>' +						
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Export.</label>'+					
					'  		<input type="number" ng-model="dECb.entry.export">'+				
					'  	</md-input-container>' +
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Part. Export.</label>'+					
					'  		<input type="number" ng-model="dECb.entry.export_part">'+				
					'  	</md-input-container>' +					
					'	<br>'+
					'  	<md-input-container md-no-float class="md-accent" style="width:50%">'+
					'  		<label>Export. Productos</label>'+					
					'  		<input type="text" ng-model="dECb.entry.export_destinos">'+				
					'  	</md-input-container>' +
					'  	<md-input-container md-no-float class="md-accent" style="width:50%">'+
					'  		<label>Export. Destinos</label>'+					
					'  		<input type="text" ng-model="dECb.entry.export_productos">'+				
					'  	</md-input-container>' +						
    				'	<br><span ng-show="dECb.failed" style="color:red;">ERROR No se pudo actualizar</span>'+													
					'  </md-dialog-content>' +
					'  <md-dialog-actions>' +
					'    <md-button ng-click="dECb.save()" class="md-accent">' +
					'      Guardar' +
					'    </md-button>' +
					'    <md-button ng-click="dECb.cancel()" class="md-accent">' +
					'      Cancelar' +
					'    </md-button>' +				
					'  </md-dialog-actions>' +
					'</md-dialog>',
				parent: angular.element(document.body)
		    }).then(function(){
		    	self.reload();
		    });
		};

    };
})();


(function () {
    'use strict';
    angular.module('app.mapaprod').controller('dialogEditCtrlb', dialogEditCtrlb);
    function dialogEditCtrlb (databaseFactory,$mdDialog, entry){
    	
    	var self = this;

    	self.failed = false;
    	self.entry = angular.copy(entry);

    	self.save = function () {
    		self.failed = false;
    		databaseFactory.editRegionGeneralData(self.entry)
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
