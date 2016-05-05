module ZoEazySPA {
    declare var google;
    'use strict';

    export class SideCtrl {

        static $inject = ['$scope', 'bowser', 'uiGmapGoogleMapApi', 'GeoService','$mdSidenav'];
        menus: Array<server.Menu>;
        branch: server.Branch;
        currency: server.Currency;
        fastBrowser: boolean;
        position: Position;
        yelpPositions: Array<Position>;
        zoEazyPositions: Array<Position>;
        yelpMarkers: Array<Marker> = [];
        zoeazyMarkers: Array<Marker> = [];

        googleVersion: any;
        map: any;
        bd: any;

        constructor(
            public $scope: ng.IScope,
            private bowser: any,
            private uiGmapGoogleMapApi: any,
            private geoService: GeoService,
            public mdSidenav: ng.material.ISidenavService
        ) {
            var sd = this;

            sd.fastBrowser = true;

            var bdParent: any = $scope.$parent;
            sd.bd = bdParent.bd;

            uiGmapGoogleMapApi.then(function (maps) {
                sd.googleVersion = maps.version;
                maps.visualRefresh = true;
            });

            $scope.$on('geo.positioned', (event: ng.IAngularEvent, args: { position: Position }): void => {
                sd.position = args.position;

                if (sd.mdSidenav('order').isLockedOpen())
                    sd.setMap();
            });

            $scope.$on('location.yelpGraph', (event: ng.IAngularEvent, args: { markers: Array<Marker> }): void => {
                sd.yelpMarkers = args.markers;
                sd.map.yelpMarkers = args.markers;
            });

            $scope.$on('location.zoeazyBusinesses', (event: ng.IAngularEvent, args: { markers: Array<Marker> }): void => {
                sd.zoeazyMarkers = args.markers;
                sd.map.zoeazyMarkers = args.markers;
            });

            $scope.$on('body.map', (event: ng.IAngularEvent): void => {
                sd.setMap();
            });
        }

        setMap() {

            this.map = this.geoService.setMap(this.position);
            if (!this.map) return;

            this.map.yelpMarkers = this.yelpMarkers;
            this.map.zoeazyMarkers = this.zoeazyMarkers;

            this.map.events = {
                'tilesloaded': function (loader: any) {
                    google.maps.event.trigger(loader, "resize");
                }
            };
        }
    }

    angular.module('ZoEazySPA')
        .controller('sideCtrl', SideCtrl);

}
