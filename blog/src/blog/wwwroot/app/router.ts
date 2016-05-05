module ZoEazySPA {

    export class UIRouterConfig {

        constructor(
            private $locationProvider: ng.ILocationProvider,
            private $stateProvider: ng.ui.IStateProvider,
            private $urlRouterProvider: ng.ui.IUrlRouterProvider) {

            this.$locationProvider.html5Mode(true);

            this.$stateProvider
                .state('home', {
                    url: '/',
                    views: {
                        content: {
                            templateUrl: 'app/main/main.html',
                            controller: 'mainCtrl',
                            controllerAs: 'mn'
                        }
                    }

                })
                .state('locations', {
                    url: '/',
                    views: {
                        content: {
                            templateUrl: 'app/locations/locations.html',
                            controller: 'locationsCtrl',
                            controllerAs: 'lc'
                        }
                    }

                })
                ;

            this.$urlRouterProvider.otherwise('/');
        }
    }

    angular.module('ZoEazySPA')
        .config([
            '$locationProvider', '$stateProvider', '$urlRouterProvider',
            ($locationProvider: ng.ILocationProvider,
                $stateProvider: ng.ui.IStateProvider,
                $urlRouterProvider: ng.ui.IUrlRouterProvider) => {

                return new UIRouterConfig($locationProvider, $stateProvider, $urlRouterProvider);
            }
        ]);
}