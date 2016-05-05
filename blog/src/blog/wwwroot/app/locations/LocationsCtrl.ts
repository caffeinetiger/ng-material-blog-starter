module ZoEazySPA {
    'use strict';

    export class LocationsCtrl {

        static $inject = ['$scope', 'Tools', 'bowser', 'LocationService'];

        branch: server.Branch;
        currency: server.Currency;
        fastBrowser: boolean;
        graph: YelpGraph;
        baseGraph: YelpGraph;
        businesses: Array<BusinessZoEazy>;
        baseBusinesses: Array<BusinessZoEazy>;
        isGraph: boolean = false;
        isBusinesses: boolean = false;

        menu: {} = { yelp: { icon: "keyboard_arrow_up", in: true }, zoeazy: { icon: "keyboard_arrow_up", in: true } };

        constructor(
            $scope: ng.IScope,
            private common: Common.Tools,
            private bowser: any,
            private locationSrv: ILocationService
        ) {
            var lc = this;

            this.fastBrowser = true;

            var bdParent: any = $scope.$parent;
            var bd = bdParent.bd;
            locationSrv.get(bd.user.userPosition, bd.user.systemPosition);

            $scope.$on('body.search', (event: ng.IAngularEvent, args: { clue: string }): void => {
                this.search(args.clue);
            });

            $scope.$on('body.selected', (event: ng.IAngularEvent, args: { selected: Array<string> }): void => {
                var selection = this.filter(args.selected);
            });

            $scope.$on('location.yelpGraph', (event: ng.IAngularEvent, args: { graph: YelpGraph }): void => {
                this.graph = args.graph;
                this.baseGraph = angular.copy(this.graph)
                this.isGraph = true;
            });

            $scope.$on('location.zoeazyBusinesses', (event: ng.IAngularEvent, args: { businesses: Array<BusinessZoEazy> }): void => {
                this.businesses = args.businesses;
                this.baseBusinesses = this.businesses.slice(0);
                this.isBusinesses = true;
            });
        }

        clickIconMorph(menu: { icon: string, in: boolean }): void {
            if (menu.icon === 'keyboard_arrow_down') {
                menu.icon = 'keyboard_arrow_up';
                menu.in = true;
            } else {
                menu.icon = 'keyboard_arrow_down';
                menu.in = false;
            }
        };

        filter(selected: Array<string>): void {
            this.businesses = this.baseBusinesses.slice(0),
                this.graph = angular.copy(this.baseGraph);

            for (var iBus = this.businesses.length - 1; iBus >= 0; iBus--) {
                var bsn: any = this.businesses[iBus], found: boolean = false;

                for (var iCat = 0; iCat < bsn.categories.length; iCat++) {
                    var cat = bsn.categories[iCat].toString();

                    if (selected.indexOf(cat) > -1) {
                        found = true;
                        break;
                    }

                }

                if (!found)
                    this.businesses.splice(iBus, 1);
            }

            for (var iBus = this.graph.businesses.length - 1; iBus >= 0; iBus--) {
                var bsn: any = this.graph.businesses[iBus], found: boolean = false;

                var cats: any = bsn.categories.split(", ");

                for (var iCat = 0; iCat < cats.length; iCat++) {
                    var cat = cats[iCat].toString();

                    if (selected.indexOf(cat) > -1) {
                        found = true;
                        break;
                    }

                }

                if (!found)
                    this.graph.businesses.splice(iBus, 1);
            }
        }

        getRating(rt: number): string {
            return 'stars_' + rt.toString().replace('.', '_');
        }

        getCategories(cts: string): string {
            var cats: string = '', lastCat: string = '';

            for (var iCat = 0; iCat < cts.length; iCat++) {
                var cat: string = cts[iCat][0], catLC: string = cat.toString().toLocaleLowerCase();
                if (catLC !== lastCat)
                    cats += cat + ",";

                lastCat = catLC;
            }

            return cats.substr(0, cats.length - 1);
        }

        getCategoriesZE(cts: string): string {
            var cats: string = '';
            for (var iCat = 0; iCat < cts.length; iCat++) {
                cats += cts[iCat] + ',';
            }
            return cats.substr(0, cats.length - 1);
        }

        getNeighborhoods(hoods: string): string {
            var hoods: string = '', lastHood: string = '';

            for (var iHood = 0; iHood < hoods.length; iHood++) {
                hoods += hoods[iHood] + ",";
            }

            return hoods.substr(0, hoods.length - 1);
        }

        search(clue: string): void {
            this.businesses = this.baseBusinesses.slice(0),
                this.graph = angular.copy(this.baseGraph);

            if (!clue || clue === '') return;

            clue = clue.toLowerCase();

            for (var iBus = this.businesses.length - 1; iBus >= 0; iBus--) {
                var bsn: BusinessZoEazy = this.businesses[iBus], found: boolean = false;

                if (!searchInZoeazy(bsn))
                    this.businesses.splice(iBus, 1);
            }

            for (var iBus = this.graph.businesses.length - 1; iBus >= 0; iBus--) {
                var bsnY: BusinessYelp = this.graph.businesses[iBus], found: boolean = false;

                if (!searchInYelp(bsnY))
                    this.graph.businesses.splice(iBus, 1);
            }

            function searchInZoeazy(candidate: BusinessZoEazy): boolean {

                return parseStr(candidate.name) ||
                    parseArr(candidate.categories) ||
                    parseArr(<any>candidate.location) ||
                    parseStr(candidate.phone) ||
                    parseStr(candidate.snippet_text);
            }

            function searchInYelp(candidate: BusinessYelp): boolean {

                return parseStr(candidate.name) ||
                    parseArr(<any>candidate.categories.split(', ')) ||
                    parseArr(<any>candidate.location) ||
                    parseStr(candidate.phone) ||
                    parseStr(candidate.snippet_text);
            }

            function parseArr(arr: Array<any>) {
                for (var iArr = 0; iArr < arr.length; iArr++) {
                    if (parseStr(arr[iArr].toString()))
                        return true;
                }
                return false;
            }

            function parseStr(str: string): boolean {
                return str.toLowerCase().indexOf(clue) >= 0
            }
        }
    }

    angular.module('ZoEazySPA')
        .controller('locationsCtrl', LocationsCtrl);

}
