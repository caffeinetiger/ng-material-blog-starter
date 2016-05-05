'use strict';

describe('geolocation service', function () {
    var scope, GeoService, geolocation, rootScope, 
            localStorageService, GoogleMapsUrlReverse, $http, $httpBackend;
    
    beforeEach(module('ZoEazySPA'));
    
    beforeEach(function () {

        inject(function (_geolocation_, _GeoService_, _$q_, _$rootScope_, _localStorageService_, 
             _GoogleMapsUrlReverse_, _$httpBackend_
            ) {
            geolocation = _geolocation_;
            localStorageService = _localStorageService_,
                GoogleMapsUrlReverse = _GoogleMapsUrlReverse_,
                $httpBackend = _$httpBackend_;

            var position = { coords: { latitude: 40.783401, longitude: -73.966301 } }
            var requestAddress = GoogleMapsUrlReverse.replace('{latitude}', position.coords.latitude.toString()).replace('{longitude}', position.coords.longitude.toString());
            var deferred = _$q_.defer();
            rootScope = _$rootScope_;
            debugger;

            

            spyOn(geolocation, 'position').and.returnValue(deferred.promise);

            $httpBackend.whenGET(requestAddress).respond(200, {status: 'OK', results: []});

            GeoService = _GeoService_;

            GeoService.constructor(localStorageService, geolocation, rootScope, GoogleMapsUrlReverse, $httpBackend);
            deferred.resolve(position);
           
        });

    });

    xit('should exist in this green world of God... ', function () {
        expect(GeoService).not.toBeUndefined();
    });

    xit('should have a constructor()',  function () {
        expect(GeoService.constructor).toBeTruthy();
    });

    xit('should have method googleMapRequestAddress()', function () {
        expect(GeoService.googleMapRequestAddress).toBeTruthy();
    });

    it('should call position', function () {
        //debugger;
        var position = GeoService.getLocation();
            expect(position.latitude).toBeANumber();
    });
});
