var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    var MainCtrl = (function () {
        function MainCtrl($scope, bowser) {
            this.bowser = bowser;
            var mn = this;
            mn.fastBrowser = true;
            var bdParent = $scope.$parent;
            var bd = bdParent.bd;
        }
        MainCtrl.$inject = ['$scope', 'bowser'];
        return MainCtrl;
    }());
    ZoEazySPA.MainCtrl = MainCtrl;
    angular.module('ZoEazySPA')
        .controller('mainCtrl', MainCtrl);
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=MainCtrl.js.map