module ZoEazySPA {
    'use strict';

    export interface IGeoService {
        position: IPosition;
        getPosition(isLoged: boolean): ng.IPromise<IPosition>;
        getAddress(): string;
        googleMapRequestAddress(address: string): ng.IPromise<IPosition>;
        logOut(): void;

        setMap(position: IPosition):{}
    }

    export interface IPosition {
        longitude: number;
        latitude: number;
        accepted: boolean;
        defined: boolean;
        address: string;
        postalCode: string;
        status: string;
        needsConfirmation: boolean;
    }

    export class Position implements IPosition {
        private _needsConfirmation: boolean = false; //asumes a valid return from google, but in the case of input based userPosition, it needs confirmation from the user

        constructor(public longitude?: number,
            public latitude?: number,
            public accepted?: boolean,
            public defined?: boolean,
            public address?: string,
            public postalCode?: string,
            public status?: string

        ) {
        }

        get needsConfirmation(): boolean {
            return this._needsConfirmation;
        }

        set needsConfirmation(val: boolean) {
            this._needsConfirmation = val;
        }

        getFromPosition(newPosition: Position, includeAddress: boolean = false) {
            this.accepted = newPosition.accepted;
            this.defined = newPosition.defined;
            this.latitude = newPosition.latitude;
            this.longitude = newPosition.longitude;
            this.postalCode = newPosition.postalCode;
            this.status = newPosition.status;
            this._needsConfirmation = false;

            if (includeAddress) this.address = newPosition.address;
        }
    }
    export class GeoService implements IGeoService {

        static $inject = ['localStorageService', '$geolocation', '$rootScope', 'GoogleMapsUrl', 'GoogleMapsUrlReverse', '$http', '$q' ];
        position: IPosition;
        addressType: any = { street_address: 'street_address' };
        radius: number = 1609;
        zoom: number = 14;

        constructor(
            private storage: ng.local.storage.ILocalStorageService,
            private geolocation: any,
            private rootScope: ng.IRootScopeService,
            private googleMaps: string,
            private googleMapsReverse: string,
            private http: ng.IHttpService,
            private Q: ng.IQService
        ) {

        }

        public getAddress(): string {
            var address: string, found: boolean;
            var adrArr: any = this.position.address;
            for (var iAdr: number = 0; iAdr < adrArr.length; iAdr++) {
                var adr: any = adrArr[iAdr];

                for (var iType = 0; iType < adr.types.length; iType++) {
                    if (adr.types[iType].toString() === this.addressType.street_address) {
                        address = adr.formatted_address
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }

            return address;
        }

        public getPosition(isLoged: boolean): ng.IPromise<IPosition> {
            var defer = this.Q.defer();

            if (isLoged) {
                this.position = <IPosition>this.storage.get('userPosition');

                if (this.position !== undefined) {
                    defer.resolve(this.position)
                } else {
                    this.geolocation.getCurrentPosition({ timeout: 60000 }).then((data: any) => {
                        defer.resolve(this.googleMapRequestAddressReverse(data.coords.latitude, data.coords.longitude));
                    },
                        (error: any) => {
                            defer.resolve(this.setPosition(undefined, undefined, undefined, undefined, false, undefined, error));
                        });
                }

            } else {
                this.geolocation.getCurrentPosition({ timeout: 60000 }).then((data: any) => {
                    defer.resolve(this.googleMapRequestAddressReverse(data.coords.latitude, data.coords.longitude));
                },
                    (error: any) => {
                        defer.resolve(this.setPosition(undefined, undefined, undefined, undefined, false, undefined, error));
                    });
            }
            return defer.promise;
        }

        public googleMapRequestAddress(address: string): ng.IPromise<IPosition> {
            var requestAddress = this.googleMaps.replace('{address}', address);
            var defer = this.Q.defer();

            this.http.get(requestAddress)
                .success((data: any, status: any) => {

                    if (data.status === 'REQUEST_DENIED')
                        defer.resolve(this.setPosition(address, undefined, undefined, undefined, true, false, data.status));
                    else if (data.status === 'ZERO_RESULTS')
                        defer.resolve(this.setPosition(address, this.getPostalCode(undefined, address), undefined, undefined, true, false, data.status));
                    else if (data.results[0].types[0] !== "street_address")
                        defer.resolve(this.setPosition(data.results[0].formatted_address, this.getPostalCode(data.results, data.results[0].formatted_address), data.results[0].geometry.location.lat, data.results[0].geometry.location.lng, true, false, 'INCOMPLETE'));
                    else
                        defer.resolve(this.setPosition(address, this.getPostalCode(data.results, address), data.results[0].geometry.location.lat, data.results[0].geometry.location.lng, true, true, 'COMPLETE'));
                }).error((err: any, status: any) => {
                    defer.resolve(this.setPosition(address, undefined, undefined, undefined, true, false, 'SERVICE_UNAVAILABLE'));
                });

            return defer.promise;

        };

        public getPostalCode(response: any, address?: string): string {
            if (!response) return undefined;


            for (var iResp = 0; iResp < response.length; iResp++) {
                var resp = response[iResp];

                for (var iComp = 0; iComp < resp.address_components.length; iComp++) {
                    var comp = resp.address_components[iComp];

                    for (var iType = 0; iType < comp.types.length; iType++) {
                        var type = comp.types[iType];

                        if (type === 'postal_code') return comp.long_name;
                    }
                }

            }


            return undefined;
        }

        private  googleMapRequestAddressReverse(latitude: number, longitude: number): ng.IPromise<IPosition> {
            var self = this;
            var requestAddress = self.googleMapsReverse.replace('{latitude}', latitude.toString()).replace('{longitude}', longitude.toString());
            var defer = self.Q.defer();

            self.http.get(requestAddress)
                .success((data: any, status: any) => {
                    if (data.status === 'REQUEST_DENIED')
                        self.setPosition(undefined, undefined, latitude, longitude, true, false, data.status);
                    else
                        self.setPosition(data.results[0].formatted_address, this.getPostalCode(data.results, data.results[0].formatted_address), latitude, longitude, true, true, 'GEOLOCATED');

                    defer.resolve(self.position);

                }).error((err: any, status: any) => {
                    defer.resolve(self.setPosition(undefined, undefined, latitude, longitude, true, false, 'SERVICE_UNAVAILABLE'));
                });
            return defer.promise;
        };

        public logOut(): void {
            this.storage.remove('userPosition');
        }

        private setPosition(address: string, postalCode: string, latitude: number, longitude: number, accepted: boolean, defined: boolean, status: any): IPosition {
            this.position = new Position(longitude, latitude, accepted, defined, address, postalCode, status);
            this.storage.set('userPosition', this.position);
            return this.position;
        }

        public setMap(position: IPosition) {
            var self = this;

            try {
                var point = getPoint();
                var center = configureCenter();
                var circle = configureCircle();
                var marker = configureMarker();

                return { circle: circle, center: center, marker: marker, events: {}, draggable: false, pan: true, zoom: self.zoom, control: {} };
            } catch (exception) {
                return undefined;
            }

            function configureCenter() {
                return {
                    latitude: position.latitude,
                    longitude: position.longitude
                }

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
        }
    };

    angular.module('ZoEazySPA')
        .service('GeoService', GeoService);

}
