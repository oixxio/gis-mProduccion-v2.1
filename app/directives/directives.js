(function () {
    'use strict';
    angular.module('app.mapaprod')
        .directive('dashGeneralData', dashGeneralData)
        .directive('sectorSelector', sectorSelector)
        .directive('search', search)
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
            controller: 'sectorSelectorCtrl as sSC',
            bindToController: {
                identifier: '@',
                done: '=',
                layoutMode: '@'
            },
            scope: {}
        };
    }

    function search () {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/search/search.html',
            controller: 'searchCtrl as SC',
            bindToController: {
                identifier: '@',
                done: '=',
                placeholder: '@',
                isFichas: '='
            },
            scope: {}
        };
    }    

    function singleDash () {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/single-dash/single-dash.html',
            controller: 'singleDashCtrl as sDC',
            bindToController: {
                identifier: '@',
                done: '=',
                layoutMode: '@'
            },
            scope: {}
        };
    }      
})();