module ZoEazySPA {
  'use strict';

  interface INavbarScope extends ng.IScope {
    date: Date;
  }

  export class NavbarCtrl {
     
      static $inject = ['$scope'];

    constructor ($scope: INavbarScope) {
      $scope.date = new Date();
    }
  }

    angular.module('ZoEazySPA')
        .controller('NavbarCtrl', NavbarCtrl);

}

