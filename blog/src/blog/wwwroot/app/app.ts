/// <reference path="../../tmp/typings/tsd.d.ts" />
/// <reference path="model.franchise.d.ts" />
/// <reference path="main/MainCtrl.ts" />
/// <reference path="components/navbar/navbar.controller.ts" />
/// <reference path="common/common.ts" />
/// <reference path="common/constants.ts" />
/// <reference path="filters/filters.ts" />
var ZoEazyDebug = false;
module ZoEazySPA {
    class ZoEazySPA {

        public static Module: ng.IModule =
        angular.module('ZoEazySPA', [
            'ngAnimate',
            'ngCookies',
            'ngSanitize',
            'ngResource',
            'ui.router',
            'ngMaterial',
            'LocalStorageModule',
            'Common',
            'ngAria',
            'formly',
            'formlyMaterial',
            'vvNgMdIcons',
            'ngMessages',
            'ngGeolocation',
            'angular-loading-bar',
            'VvFilters',
            'VvDirectives',
            'ui.mask',
            'jlareau.bowser',
            'uiGmapgoogle-maps'
        ])
            .config(function (localStorageServiceProvider: ng.local.storage.ILocalStorageServiceProvider) {
                localStorageServiceProvider
                    .setPrefix('ZoEazy.Client');
            })
            .config(['$compileProvider', function ($compileProvider) {
                $compileProvider.debugInfoEnabled(false);
            }])
            .config(function ($mdThemingProvider: ng.material.IThemingProvider, $mdIconProvider: ng.material.IIconProvider) {

                $mdIconProvider
                    .defaultIconSet('/app/svg/mdi.svg', 128)
                    .icon('menu', '/app/svg/menu.svg', 24)
                    .icon('share', '/app/svg/share.svg', 24)
                    .icon('google_plus', '/app/svg/google_plus.svg', 512)
                    .icon('hangouts', '/app/svg/hangouts.svg', 512)
                    .icon('twitter', '/app/svg/twitter.svg', 512)
                    .icon('phone', '/app/svg/phone.svg', 512)
                    .icon('zoeazy', '/app/svg/zoeazy.svg', 24)
                    .icon('amex', '/app/svg/amex.svg', 300)
                    .icon('master', '/app/svg/master.svg', 300)
                    .icon('visa', '/app/svg/visa.svg', 200)
                    .icon('discover', '/app/svg/disc.svg', 300)
                    .icon('diners', '/app/svg/diners.svg', 300)
                    .iconSet('call', '/app/svg/communication-icons.svg', 24)
                    .iconSet('social', '/app/svg/social-icons.svg', 24);

                $mdThemingProvider.theme('default')
                    .primaryPalette('indigo', {
                        'default': '900', //#1a237e
                        'hue-1': '100', //#c5cae9
                        'hue-2': '600', //#3949ab
                        'hue-3': 'A400' //#3d5afe

                    })
                    .accentPalette('deep-orange', {
                        'default': '700', //#ff7043
                        'hue-1': '600',//#f4511e
                        'hue-2': 'A100',//#ff9E80
                        'hue-3': '800' //#D84315
                    })
                    .warnPalette('red', {
                        'default': '500', //#f44336
                        'hue-1': '300', //#e57373
                        'hue-2': 'A100', //#ff5252
                        'hue-3': '800' //#c62828
                    })
                    .backgroundPalette('grey', {
                        'default': '100', //#9e9e9e
                        'hue-1': '300',   //#e0e0e0
                        'hue-2': '800',   // #424242
                        'hue-3': '200'   // #eee
                    });
            })
            .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
                GoogleMapApi.configure({
                    //    key: 'your api key',
                    v: '3.20',
                    //libraries: 'weather,geometry,visualization'
                    libraries: 'visualization'
                });
            }])
            .constant('GoogleMapsUrl', 'https://maps.googleapis.com/maps/api/geocode/json?address={address}')
            .constant('GoogleMapsUrl', 'https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={apikey}')
            .constant('GoogleMapsUrlReverse', 'https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}')
            .constant('GoogleMapsUrlReverse', 'https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={apikey}');
    }
}
