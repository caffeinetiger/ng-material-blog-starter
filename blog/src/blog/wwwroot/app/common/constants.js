var Common;
(function (Common) {
    'use strict';
    var ezPrefix = 'zoEazy';
    var ezKeyBase = ezPrefix;
    var keepMe = 'Keep me signed in';
    var cuisines = 'Pizzeria, Mexican, Deli, Chinese, Thai';
    var opt = ' (Optional)';
    var weekdays = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7
    };
    var keyCodes = {
        backspace: 8,
        tab: 9,
        enter: 13,
        esc: 27,
        escito: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        del: 46
    };
    var currency = {
        id: 1,
        code: 'USD',
        name: 'US Dollar',
        'short': 'Dollar',
        symbol: '$'
    };
    // for use with the HotTowel-Angular-Breeze add-on that uses Breeze
    var remoteServiceName = '/breeze/Breeze';
    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        hasChangesChanged: 'datacontext.hasChangesChanged',
        entitiesChanged: 'datacontext.entitiesChanged',
        shoppingCartChanged: 'datacontext.subscriptionsChanged',
        spinnerToggle: 'spinner.toggle',
        storage: {
            error: 'store.error',
            storeChanged: 'store.changed',
            wipChanged: 'wip.changed'
        }
    };
    var imageSettings = {
        imageBasePath: '../content/images/items/',
        unknownPersonImageSource: 'unknown_item.jpg'
    };
    var help = {
        franchise: 'Name of restaurant or franchise.',
        checkout: 'help for the checout...'
    };
    var ezParameters = {
        keepMe: keepMe,
        cuisines: cuisines,
        opt: opt,
        help: help,
        weekdays: weekdays,
        months: [
            { name: 'January', shortName: 'Jan', number: 1 },
            { name: 'February', shortName: 'Feb', number: 2 },
            { name: 'March', shortName: 'Mar', number: 3 },
            { name: 'April', shortName: 'Apr', number: 4 },
            { name: 'May', shortName: 'May', number: 5 },
            { name: 'June', shortName: 'Jun', number: 6 },
            { name: 'July', shortName: 'Jul', number: 7 },
            { name: 'August', shortName: 'Aug', number: 8 },
            { name: 'September', shortName: 'Sep', number: 9 },
            { name: 'October', shortName: 'Oct', number: 10 },
            { name: 'November', shortName: 'Nov', number: 11 },
            { name: 'December', shortName: 'Dec', number: 12 }
        ],
        testCardNumber: [
            { brand: 'AmericanExpress', card: 370000000000002 },
            { brand: 'Discover', card: 6011000000000012 },
            { brand: 'Visa', card: 4007000000000027 },
            { brand: 'MasterCard', card: 5424000000000015 },
            { brand: 'JCB', card: 3088000000000017 },
            { brand: 'DinersClub', card: 38000000000006 }
        ],
        regionBias: 'us',
        invalidCorrect: 'Invalid or Incomplete Data, please correct.',
        websiteSuffix: 'com',
        currency: currency,
        appErrorPrefix: '[ZE Error] ',
        docTitle: 'ZoEazy: ',
        events: events,
        endPoints: {
            lookup: 'LookupAsync',
            contracts: 'ContractsAsync',
            saveOrder: 'SaveCheckout',
            saveProfile: 'SaveProfile'
        },
        storageKeys: {
            userKey: 'UserKey',
            emailConfirmedKey: 'EmailConfirmedKey',
            servicesKey: 'ServicesKey',
            setupServicesKey: 'SetupServicesKey',
            periodsKey: 'PeriodsKey'
        },
        baseAddressKey: ezKeyBase + '.adrs',
        radius: 1609,
        zoom: 14,
        remoteServiceName: remoteServiceName,
        version: '2.1.0',
        imageSettings: imageSettings,
        keyCodes: keyCodes,
        login: {
            title: 'Login',
            labels: {
                cancel: 'Cancel',
                facebook: 'Facebook',
                forgot: 'Forgot your password?',
                googlePlus: 'Google+',
                login: 'Login',
                loginUsing: 'Login Using',
                microsoft: 'Microsoft',
                register: 'Register',
                twitter: 'Twitter'
            },
            hint: {
                email: 'Enter a valid email',
                password: 'Requires 6 characters minimum',
                rememberMe: 'Only if this is a private computer... please!'
            },
            placeholder: {
                email: ''
            }
        },
        register: {
            title: 'Register',
            labels: {
                cancel: 'Cancel',
                register: 'Register'
            },
            hint: {
                email: 'Enter a valid email',
                password: 'Requires 6 characters minimum',
                rememberMe: 'Only if this is a private computer... please!'
            },
            placeholder: {
                email: ''
            }
        },
        newsletter: {
            title: 'Newsletter',
            labels: {
                cancel: 'Cancel',
                email: 'Email',
                register: 'Subscribe',
                readPrevious: 'Read Previous Issues...'
            },
            hint: {
                email: 'Enter a valid email'
            },
            placeholder: {
                email: ''
            }
        },
        password: {
            minLength: 5,
            minUpper: 1,
            minLower: 0,
            minNums: 1,
            validationMsg: 'At least {1} uppercase and {3} number'
        },
        options: {
            updateOn: 'blur'
        }
    };
    var authService = '//auth.zoeazy.net/';
    var authServiceLocal = 'http://localhost:44301/';
    ezParameters.password.validationMsg = ezParameters.password.validationMsg
        .replace('{0}', ezParameters.password.minLength.toString())
        .replace('{1}', ezParameters.password.minUpper.toString())
        .replace('{2}', ezParameters.password.minLower.toString())
        .replace('{3}', ezParameters.password.minNums.toString());
    var ngAuthSettings = {
        authServiceUri: (ZoEazyDebug) ? authServiceLocal : authService,
        clientId: '099153c2625149bc8ecb3e85e03f0022',
        endPoint: 'oauth2/token',
        existEndPoint: 'api/account/useravailable',
        regEndPoint: 'api/account/registercustomer',
        reqConfEndPoint: 'api/account/requestconfirmation',
        authKey: 'oEazyAuthData',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        postContent: 'grant_type=password&username={0}&password={1}&client_id={2}',
        postReqConf: 'username={0}&client_id={2}',
        existString: "?username={0}&clientId={2}",
        events: {
            userNotLogged: 'auth.userNotLogged'
        },
    };
    var googleMapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    var AuthInterceptorService = (function () {
        function AuthInterceptorService($location, $q, localStorageService) {
            this.authKey = ngAuthSettings.authKey;
            this.userNotLogged = ngAuthSettings.events.userNotLogged;
            this.authData = null;
            this.$location = $location;
            this.$q = $q;
            this.localStorageService = localStorageService;
            this.authData = this.localStorageService.get(this.authKey);
        }
        AuthInterceptorService.AuthInterceptorServiceFactory = function ($location, $q, localStorageService) {
            return new AuthInterceptorService($location, $q, localStorageService);
        };
        AuthInterceptorService.prototype.request = function (requestConfig) {
            if (requestConfig.url.substring(8, 27) === 'maps.googleapis.com')
                return requestConfig;
            requestConfig.headers = requestConfig.headers || {};
            if (this.authData)
                requestConfig.headers.Authorization = 'Bearer ' + this.authData.token;
            return requestConfig;
        };
        AuthInterceptorService.prototype.responseError = function (rejection) {
            // var self = this;// 'this' REFERENCES TO WINDOW INSTEAD OF AuthInterceptorService CLASS
            if (rejection.status === 401) {
                localStorage.removeItem('authorizationData');
                this.$location.path('/login');
            }
            return this.$q.reject(rejection);
        };
        AuthInterceptorService.$inject = ['$location', '$q', 'LocalStorageService'];
        return AuthInterceptorService;
    }());
    Common.AuthInterceptorService = AuthInterceptorService;
    angular.module('Common')
        .constant('ezParameters', ezParameters)
        .value('ngAuthSettings', ngAuthSettings)
        .constant('googleMapsUrl', googleMapsUrl)
        .service('AuthInterceptorService', AuthInterceptorService);
})(Common || (Common = {}));
//# sourceMappingURL=constants.js.map