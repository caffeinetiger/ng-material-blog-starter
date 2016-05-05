var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    var SideCtrl = (function () {
        function SideCtrl($scope, bowser, uiGmapGoogleMapApi, geoService, mdSidenav) {
            this.$scope = $scope;
            this.bowser = bowser;
            this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
            this.geoService = geoService;
            this.mdSidenav = mdSidenav;
            this.yelpMarkers = [];
            this.zoeazyMarkers = [];
            var sd = this;
            sd.fastBrowser = true;
            var bdParent = $scope.$parent;
            sd.bd = bdParent.bd;
            uiGmapGoogleMapApi.then(function (maps) {
                sd.googleVersion = maps.version;
                maps.visualRefresh = true;
            });
            $scope.$on('geo.positioned', function (event, args) {
                sd.position = args.position;
                if (sd.mdSidenav('order').isLockedOpen())
                    sd.setMap();
            });
            $scope.$on('location.yelpGraph', function (event, args) {
                sd.yelpMarkers = args.markers;
                sd.map.yelpMarkers = args.markers;
            });
            $scope.$on('location.zoeazyBusinesses', function (event, args) {
                sd.zoeazyMarkers = args.markers;
                sd.map.zoeazyMarkers = args.markers;
            });
            $scope.$on('body.map', function (event) {
                sd.setMap();
            });
        }
        SideCtrl.prototype.setMap = function () {
            this.map = this.geoService.setMap(this.position);
            if (!this.map)
                return;
            this.map.yelpMarkers = this.yelpMarkers;
            this.map.zoeazyMarkers = this.zoeazyMarkers;
            this.map.events = {
                'tilesloaded': function (loader) {
                    google.maps.event.trigger(loader, "resize");
                }
            };
        };
        SideCtrl.$inject = ['$scope', 'bowser', 'uiGmapGoogleMapApi', 'GeoService', '$mdSidenav'];
        return SideCtrl;
    }());
    ZoEazySPA.SideCtrl = SideCtrl;
    angular.module('ZoEazySPA')
        .controller('sideCtrl', SideCtrl);
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=SideCtrl.js.map