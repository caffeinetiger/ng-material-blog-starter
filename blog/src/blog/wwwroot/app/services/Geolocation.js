var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    var Position = (function () {
        function Position(longitude, latitude, accepted, defined, address, postalCode, status) {
            this.longitude = longitude;
            this.latitude = latitude;
            this.accepted = accepted;
            this.defined = defined;
            this.address = address;
            this.postalCode = postalCode;
            this.status = status;
            this._needsConfirmation = false; //asumes a valid return from google, but in the case of input based userPosition, it needs confirmation from the user
        }
        Object.defineProperty(Position.prototype, "needsConfirmation", {
            get: function () {
                return this._needsConfirmation;
            },
            set: function (val) {
                this._needsConfirmation = val;
            },
            enumerable: true,
            configurable: true
        });
        Position.prototype.getFromPosition = function (newPosition, includeAddress) {
            if (includeAddress === void 0) { includeAddress = false; }
            this.accepted = newPosition.accepted;
            this.defined = newPosition.defined;
            this.latitude = newPosition.latitude;
            this.longitude = newPosition.longitude;
            this.postalCode = newPosition.postalCode;
            this.status = newPosition.status;
            this._needsConfirmation = false;
            if (includeAddress)
                this.address = newPosition.address;
        };
        return Position;
    }());
    ZoEazySPA.Position = Position;
    var GeoService = (function () {
        function GeoService(storage, geolocation, rootScope, googleMaps, googleMapsReverse, http, Q) {
            this.storage = storage;
            this.geolocation = geolocation;
            this.rootScope = rootScope;
            this.googleMaps = googleMaps;
            this.googleMapsReverse = googleMapsReverse;
            this.http = http;
            this.Q = Q;
            this.addressType = { street_address: 'street_address' };
            this.radius = 1609;
            this.zoom = 14;
        }
        GeoService.prototype.getAddress = function () {
            var address, found;
            var adrArr = this.position.address;
            for (var iAdr = 0; iAdr < adrArr.length; iAdr++) {
                var adr = adrArr[iAdr];
                for (var iType = 0; iType < adr.types.length; iType++) {
                    if (adr.types[iType].toString() === this.addressType.street_address) {
                        address = adr.formatted_address;
                        found = true;
                        break;
                    }
                }
                if (found)
                    break;
            }
            return address;
        };
        GeoService.prototype.getPosition = function (isLoged) {
            var _this = this;
            var defer = this.Q.defer();
            if (isLoged) {
                this.position = this.storage.get('userPosition');
                if (this.position !== undefined) {
                    defer.resolve(this.position);
                }
                else {
                    this.geolocation.getCurrentPosition({ timeout: 60000 }).then(function (data) {
                        defer.resolve(_this.googleMapRequestAddressReverse(data.coords.latitude, data.coords.longitude));
                    }, function (error) {
                        defer.resolve(_this.setPosition(undefined, undefined, undefined, undefined, false, undefined, error));
                    });
                }
            }
            else {
                this.geolocation.getCurrentPosition({ timeout: 60000 }).then(function (data) {
                    defer.resolve(_this.googleMapRequestAddressReverse(data.coords.latitude, data.coords.longitude));
                }, function (error) {
                    defer.resolve(_this.setPosition(undefined, undefined, undefined, undefined, false, undefined, error));
                });
            }
            return defer.promise;
        };
        GeoService.prototype.googleMapRequestAddress = function (address) {
            var _this = this;
            var requestAddress = this.googleMaps.replace('{address}', address);
            var defer = this.Q.defer();
            this.http.get(requestAddress)
                .success(function (data, status) {
                if (data.status === 'REQUEST_DENIED')
                    defer.resolve(_this.setPosition(address, undefined, undefined, undefined, true, false, data.status));
                else if (data.status === 'ZERO_RESULTS')
                    defer.resolve(_this.setPosition(address, _this.getPostalCode(undefined, address), undefined, undefined, true, false, data.status));
                else if (data.results[0].types[0] !== "street_address")
                    defer.resolve(_this.setPosition(data.results[0].formatted_address, _this.getPostalCode(data.results, data.results[0].formatted_address), data.results[0].geometry.location.lat, data.results[0].geometry.location.lng, true, false, 'INCOMPLETE'));
                else
                    defer.resolve(_this.setPosition(address, _this.getPostalCode(data.results, address), data.results[0].geometry.location.lat, data.results[0].geometry.location.lng, true, true, 'COMPLETE'));
            }).error(function (err, status) {
                defer.resolve(_this.setPosition(address, undefined, undefined, undefined, true, false, 'SERVICE_UNAVAILABLE'));
            });
            return defer.promise;
        };
        ;
        GeoService.prototype.getPostalCode = function (response, address) {
            if (!response)
                return undefined;
            for (var iResp = 0; iResp < response.length; iResp++) {
                var resp = response[iResp];
                for (var iComp = 0; iComp < resp.address_components.length; iComp++) {
                    var comp = resp.address_components[iComp];
                    for (var iType = 0; iType < comp.types.length; iType++) {
                        var type = comp.types[iType];
                        if (type === 'postal_code')
                            return comp.long_name;
                    }
                }
            }
            return undefined;
        };
        GeoService.prototype.googleMapRequestAddressReverse = function (latitude, longitude) {
            var _this = this;
            var self = this;
            var requestAddress = self.googleMapsReverse.replace('{latitude}', latitude.toString()).replace('{longitude}', longitude.toString());
            var defer = self.Q.defer();
            self.http.get(requestAddress)
                .success(function (data, status) {
                if (data.status === 'REQUEST_DENIED')
                    self.setPosition(undefined, undefined, latitude, longitude, true, false, data.status);
                else
                    self.setPosition(data.results[0].formatted_address, _this.getPostalCode(data.results, data.results[0].formatted_address), latitude, longitude, true, true, 'GEOLOCATED');
                defer.resolve(self.position);
            }).error(function (err, status) {
                defer.resolve(self.setPosition(undefined, undefined, latitude, longitude, true, false, 'SERVICE_UNAVAILABLE'));
            });
            return defer.promise;
        };
        ;
        GeoService.prototype.logOut = function () {
            this.storage.remove('userPosition');
        };
        GeoService.prototype.setPosition = function (address, postalCode, latitude, longitude, accepted, defined, status) {
            this.position = new Position(longitude, latitude, accepted, defined, address, postalCode, status);
            this.storage.set('userPosition', this.position);
            return this.position;
        };
        GeoService.prototype.setMap = function (position) {
            var self = this;
            try {
                var point = getPoint();
                var center = configureCenter();
                var circle = configureCircle();
                var marker = configureMarker();
                return { circle: circle, center: center, marker: marker, events: {}, draggable: false, pan: true, zoom: self.zoom, control: {} };
            }
            catch (exception) {
                return undefined;
            }
            function configureCenter() {
                return {
                    latitude: position.latitude,
                    longitude: position.longitude
                };
            }
            function configureMarker() {
                return {
                    idkey: "idEz",
                    center: {
                        latitude: position.latitude,
                        longitude: position.longitude
                    },
                    options: {
                        animation: 1,
                        title: position.address
                    },
                };
            }
            function configureCircle() {
                return [{
                        id: 1,
                        visible: true,
                        editable: false,
                        draggable: true,
                        geodesic: false,
                        clickable: false,
                        stroke: {
                            weight: 1,
                            color: "#08B21F",
                            opacity: 0.1
                        },
                        fill: {
                            weight: 1,
                            color: "#08B21F",
                            opacity: 0.1
                        },
                        center: {
                            latitude: point.latitude,
                            longitude: point.longitude
                        },
                        radius: self.radius
                    }];
            }
            function getPoint() {
                return {
                    latitude: position.latitude,
                    longitude: position.longitude
                };
            }
        };
        GeoService.$inject = ['localStorageService', '$geolocation', '$rootScope', 'GoogleMapsUrl', 'GoogleMapsUrlReverse', '$http', '$q'];
        return GeoService;
    }());
    ZoEazySPA.GeoService = GeoService;
    ;
    angular.module('ZoEazySPA')
        .service('GeoService', GeoService);
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=Geolocation.js.map