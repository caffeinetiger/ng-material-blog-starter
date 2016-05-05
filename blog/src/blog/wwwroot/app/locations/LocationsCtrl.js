var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    var LocationsCtrl = (function () {
        function LocationsCtrl($scope, common, bowser, locationSrv) {
            var _this = this;
            this.common = common;
            this.bowser = bowser;
            this.locationSrv = locationSrv;
            this.isGraph = false;
            this.isBusinesses = false;
            this.menu = { yelp: { icon: "keyboard_arrow_up", in: true }, zoeazy: { icon: "keyboard_arrow_up", in: true } };
            var lc = this;
            this.fastBrowser = true;
            var bdParent = $scope.$parent;
            var bd = bdParent.bd;
            locationSrv.get(bd.user.userPosition, bd.user.systemPosition);
            $scope.$on('body.search', function (event, args) {
                _this.search(args.clue);
            });
            $scope.$on('body.selected', function (event, args) {
                var selection = _this.filter(args.selected);
            });
            $scope.$on('location.yelpGraph', function (event, args) {
                _this.graph = args.graph;
                _this.baseGraph = angular.copy(_this.graph);
                _this.isGraph = true;
            });
            $scope.$on('location.zoeazyBusinesses', function (event, args) {
                _this.businesses = args.businesses;
                _this.baseBusinesses = _this.businesses.slice(0);
                _this.isBusinesses = true;
            });
        }
        LocationsCtrl.prototype.clickIconMorph = function (menu) {
            if (menu.icon === 'keyboard_arrow_down') {
                menu.icon = 'keyboard_arrow_up';
                menu.in = true;
            }
            else {
                menu.icon = 'keyboard_arrow_down';
                menu.in = false;
            }
        };
        ;
        LocationsCtrl.prototype.filter = function (selected) {
            this.businesses = this.baseBusinesses.slice(0),
                this.graph = angular.copy(this.baseGraph);
            for (var iBus = this.businesses.length - 1; iBus >= 0; iBus--) {
                var bsn = this.businesses[iBus], found = false;
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
                var bsn = this.graph.businesses[iBus], found = false;
                var cats = bsn.categories.split(", ");
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
        };
        LocationsCtrl.prototype.getRating = function (rt) {
            return 'stars_' + rt.toString().replace('.', '_');
        };
        LocationsCtrl.prototype.getCategories = function (cts) {
            var cats = '', lastCat = '';
            for (var iCat = 0; iCat < cts.length; iCat++) {
                var cat = cts[iCat][0], catLC = cat.toString().toLocaleLowerCase();
                if (catLC !== lastCat)
                    cats += cat + ",";
                lastCat = catLC;
            }
            return cats.substr(0, cats.length - 1);
        };
        LocationsCtrl.prototype.getCategoriesZE = function (cts) {
            var cats = '';
            for (var iCat = 0; iCat < cts.length; iCat++) {
                cats += cts[iCat] + ',';
            }
            return cats.substr(0, cats.length - 1);
        };
        LocationsCtrl.prototype.getNeighborhoods = function (hoods) {
            var hoods = '', lastHood = '';
            for (var iHood = 0; iHood < hoods.length; iHood++) {
                hoods += hoods[iHood] + ",";
            }
            return hoods.substr(0, hoods.length - 1);
        };
        LocationsCtrl.prototype.search = function (clue) {
            this.businesses = this.baseBusinesses.slice(0),
                this.graph = angular.copy(this.baseGraph);
            if (!clue || clue === '')
                return;
            clue = clue.toLowerCase();
            for (var iBus = this.businesses.length - 1; iBus >= 0; iBus--) {
                var bsn = this.businesses[iBus], found = false;
                if (!searchInZoeazy(bsn))
                    this.businesses.splice(iBus, 1);
            }
            for (var iBus = this.graph.businesses.length - 1; iBus >= 0; iBus--) {
                var bsnY = this.graph.businesses[iBus], found = false;
                if (!searchInYelp(bsnY))
                    this.graph.businesses.splice(iBus, 1);
            }
            function searchInZoeazy(candidate) {
                return parseStr(candidate.name) ||
                    parseArr(candidate.categories) ||
                    parseArr(candidate.location) ||
                    parseStr(candidate.phone) ||
                    parseStr(candidate.snippet_text);
            }
            function searchInYelp(candidate) {
                return parseStr(candidate.name) ||
                    parseArr(candidate.categories.split(', ')) ||
                    parseArr(candidate.location) ||
                    parseStr(candidate.phone) ||
                    parseStr(candidate.snippet_text);
            }
            function parseArr(arr) {
                for (var iArr = 0; iArr < arr.length; iArr++) {
                    if (parseStr(arr[iArr].toString()))
                        return true;
                }
                return false;
            }
            function parseStr(str) {
                return str.toLowerCase().indexOf(clue) >= 0;
            }
        };
        LocationsCtrl.$inject = ['$scope', 'Tools', 'bowser', 'LocationService'];
        return LocationsCtrl;
    }());
    ZoEazySPA.LocationsCtrl = LocationsCtrl;
    angular.module('ZoEazySPA')
        .controller('locationsCtrl', LocationsCtrl);
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=LocationsCtrl.js.map