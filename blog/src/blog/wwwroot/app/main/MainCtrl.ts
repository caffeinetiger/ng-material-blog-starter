module ZoEazySPA {
    'use strict';

    export class MainCtrl {

        static $inject = ['$scope', 'bowser'];
        menus: Array<server.Menu>;
        branch: server.Branch;
        currency: server.Currency;
        fastBrowser: boolean;

        constructor(
            $scope: ng.IScope,
            private bowser: any
        ) {
            var mn = this;

            mn.fastBrowser = true;

            var bdParent: any = $scope.$parent;
            var bd = bdParent.bd;
        }
    }

    angular.module('ZoEazySPA')
        .controller('mainCtrl', MainCtrl);

}
