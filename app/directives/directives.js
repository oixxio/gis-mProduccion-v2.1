(function () {
    'use strict';
    angular.module('app.mapaprod')
        .directive('dashGeneralData', dashGeneralData)
        .directive('sectorSelector', sectorSelector)
        .directive('searchBar', searchBar)
        .directive('singleDash', singleDash);

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

    function searchBar () {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/search-bar/search-bar.html',
            controller: 'searchCtrl as SC',
            bindToController: {
                identifier: '=',
                done: '='
            }
        };
    }    

    function singleDash () {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/single-dash/single-dash.html',
            controller: 'dashboardCtrl as DC',
            bindToController: {
                identifier: '@',
                start: '='
            },
            scope: {}
        };
    }      
})();