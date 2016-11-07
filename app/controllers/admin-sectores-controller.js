(function () {
    'use strict';
    angular.module('app.mapaprod').controller('adminSectoresCtrl', adminSectoresCtrl);
    function adminSectoresCtrl ($timeout, $scope, $location, databaseFactory, $mdDialog){

    	var self = this;
		if (sessionStorage.getItem('isLogged') == "logged OK") {
			//do nothing
		} else {
			$location.path('/adminLogin');
		}
    	

    	self.generalData = [];

		self.reload = function(){
			self.done = false;
			databaseFactory.getAllSectorGeneralData()
				.success(function(response){
					self.generalData = response;
					console.log(self.generalData);
					for (var i = 0; i < self.generalData.length; i++) {
						switch(self.generalData[i].depth) {
							case '0': self.generalData[i].depth_name = '-'; break;
							case '1': self.generalData[i].depth_name = 'Sección'; break;
							case '2': self.generalData[i].depth_name = 'División'; break;
							case '3': self.generalData[i].depth_name = 'Grupo'; break;
							case '4': self.generalData[i].depth_name = 'Clase'; break;
						}
						self.generalData[i].empleo 				= parseInt( self.generalData[i].empleo );
						self.generalData[i].empleo_part 		= parseFloat( self.generalData[i].empleo_part );
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
				controller: 'dialogEditCtrlc as dECc',
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
					'	<span class="md-title">{{dECc.entry.parent_name}} >> <br> [{{dECc.entry.sector_ciiu}}] {{dECc.entry.sector_nombre}}</span><br>'+
					'	<br>'+
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Empleo 2015</label>'+					
					'  		<input type="number" ng-model="dECc.entry.empleo">'+				
					'  	</md-input-container>' +
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Participación del empleo sectorial en nación (2015)</label>'+					
					'  		<input type="number" ng-model="dECc.entry.empleo_part">'+				
					'  	</md-input-container>' +						
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Exportaciones en millones de USD corrientes. (2015)</label>'+					
					'  		<input type="number" ng-model="dECc.entry.export">'+				
					'  	</md-input-container>' +
					'  	<md-input-container md-no-float class="md-accent">'+
					'  		<label>Participacion de las exportaciones en el total nacional (2015)</label>'+					
					'  		<input type="number" ng-model="dECc.entry.export_part">'+				
					'  	</md-input-container>' +		
    				'	<br><span ng-show="dECc.failed" style="color:red;">ERROR No se pudo actualizar</span>'+													
					'  </md-dialog-content>' +
					'  <md-dialog-actions>' +
					'    <md-button ng-click="dECc.save()" class="md-accent">' +
					'      Guardar' +
					'    </md-button>' +
					'    <md-button ng-click="dECc.cancel()" class="md-accent">' +
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



/////////////////CONTROLADOR DEL CUADRO DE DIALOGO DE UPDATE DATOS GENERLAES REGION
(function () {
    'use strict';
    angular.module('app.mapaprod').controller('dialogEditCtrlc', dialogEditCtrlc);
    function dialogEditCtrlc (databaseFactory,$mdDialog, entry){
    	
    	var self = this;

    	self.failed = false;
    	self.entry = angular.copy(entry);

    	self.save = function () {
    		self.failed = false;
    		databaseFactory.editSectorGeneralData(self.entry)
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
