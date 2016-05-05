var ZoEazySPA;
(function (ZoEazySPA) {
    var UIRouterConfig = (function () {
        function UIRouterConfig($locationProvider, $stateProvider, $urlRouterProvider) {
            this.$locationProvider = $locationProvider;
            this.$stateProvider = $stateProvider;
            this.$urlRouterProvider = $urlRouterProvider;
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
            });
            this.$urlRouterProvider.otherwise('/');
        }
        return UIRouterConfig;
    }());
    ZoEazySPA.UIRouterConfig = UIRouterConfig;
    angular.module('ZoEazySPA')
        .config([
        '$locationProvider', '$stateProvider', '$urlRouterProvider',
        function ($locationProvider, $stateProvider, $urlRouterProvider) {
            return new UIRouterConfig($locationProvider, $stateProvider, $urlRouterProvider);
        }
    ]);
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=router.js.map