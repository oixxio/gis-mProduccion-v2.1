(function () {
    'use strict';
    angular.module('app.mapaprod')
        .directive('dashGeneralData', dashGeneralData)
        .directive('sectorSelector', sectorSelector);

    function dashGeneralData () {
        return {
            restrict: 'E',
            scope: {
                generalData: '=data',
                type: '=type',
                name: '=name'
            },
            templateUrl: 'app/directives/dash-general-data/dash-general-data.html'
        };
    }

    function sectorSelector () {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/sector-selector/sector-selector.html',
            controller: 'bySectorCtrl as bSC'
        };
    }
})();