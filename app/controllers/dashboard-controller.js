(function () {
    'use strict';
    angular.module('app.mapaprod').controller('dashboardCtrl', dashboardCtrl);
    function dashboardCtrl (linkFactory, databaseFactory) {

		var self = this;

        self.test = linkFactory.getSelectedNode();

    }
})();