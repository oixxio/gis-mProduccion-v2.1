(function () {
    'use strict';
    angular.module('app.mapaprod').controller('comparacionCtrl', comparacionCtrl);
    function comparacionCtrl ($scope) {

		var self = this;

		self.selectionA = '';
		self.selectionB = '';
		self.regionDoneA = false;
		self.regionDoneB = false;
		self.sectorDoneA = false;
		self.sectorDoneB = false;
		self.readyA = false;
		self.readyB = false; 

		$scope.$watch(angular.bind(self, function() { return self.regionDoneA; }),
			function(){
				console.log('regionDoneA :'+self.regionDoneA);
			});
		$scope.$watch(angular.bind(self, function() { return self.regionDoneB; }),
			function(){
				console.log('regionDoneB :'+self.regionDoneB);
			});

		$scope.$watch(angular.bind(self, function() { return self.sectorDoneA; }),
			function(){
				console.log('sectorDoneA :'+self.sectorDoneA);
			});	
		$scope.$watch(angular.bind(self, function() { return self.sectorDoneB; }),
			function(){
				console.log('sectorDoneB :'+self.sectorDoneB);
			});	

		$scope.$watch(angular.bind(self, function() { return self.readyA; }),
			function(){
				console.log('readyA :'+self.readyA);
			});
		$scope.$watch(angular.bind(self, function() { return self.readyB; }),
			function(){
				console.log('readyB :'+self.readyB);
			});																							

		self.resetA = function(){
			self.selectionA = '';
			self.regionDoneA = false;
			self.sectorDoneA = false;
			self.readyA = false;		
		}

		self.resetB = function(){
			self.selectionB = '';
			self.regionDoneB = false;
			self.sectorDoneB = false;
			self.readyB = false;		
		}	

    }
})();