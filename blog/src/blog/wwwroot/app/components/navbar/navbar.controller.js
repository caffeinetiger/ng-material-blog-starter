var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    var NavbarCtrl = (function () {
        function NavbarCtrl($scope) {
            $scope.date = new Date();
        }
        NavbarCtrl.$inject = ['$scope'];
        return NavbarCtrl;
    }());
    ZoEazySPA.NavbarCtrl = NavbarCtrl;
    angular.module('ZoEazySPA')
        .controller('NavbarCtrl', NavbarCtrl);
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=navbar.controller.js.map