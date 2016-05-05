var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    var OAuthService = (function () {
        function OAuthService($rootScope, $http, $q, localStorageService, ngAuthSettings, timeout, common, geoService) {
            this.$rootScope = $rootScope;
            this.$http = $http;
            this.$q = $q;
            this.localStorageService = localStorageService;
            this.ngAuthSettings = ngAuthSettings;
            this.timeout = timeout;
            this.common = common;
            this.geoService = geoService;
            this.requestConfirmation = function (email) {
                var data = {
                    email: email,
                    clientid: this.clientId
                };
                var deferred = this.$q.defer();
                this.$http.post(this.serviceBase + this.reqConfEndPoint, data, this.hdrs)
                    .success(success).error(error);
                return deferred.promise;
                function success(response) {
                    return deferred.resolve(response);
                }
                function error(response) {
                    this.logOut();
                    deferred.reject(response);
                    this.$rootScope.$state.go('404');
                }
            };
            this.serviceBase = ngAuthSettings.authServiceUri;
            this.logEndPoint = ngAuthSettings.endPoint;
            this.regEndPoint = ngAuthSettings.regEndPoint;
            this.reqConfEndPoint = ngAuthSettings.reqConfEndPoint;
            this.existEndPoint = ngAuthSettings.existEndPoint;
            this.postContent = ngAuthSettings.postContent;
            this.postReqConf = ngAuthSettings.postReqConf;
            this.existString = ngAuthSettings.existString;
            this.hdrs = ngAuthSettings.header;
            if (ZoEazyDebug)
                this.clientId = ngAuthSettings.clientId; //constant for test puprposes
            this.authKey = ngAuthSettings.authKey;
        }
        OAuthService.prototype.fillAuthData = function () {
            var user, loged = false;
            var data = this.localStorageService.get(this.authKey);
            try {
                if (data && data.status === undefined) {
                    user = new ZoEazySPA.User(data.email, data.userName, data.isLoged, data.phone, data.userPosition);
                }
                else {
                    user = new ZoEazySPA.User();
                }
            }
            catch (err) {
                user = new ZoEazySPA.User();
            }
            this.$rootScope.$broadcast('auth.userCreated', { user: user, loged: loged });
        };
        ;
        OAuthService.prototype.isUserAvailable = function (userName) {
            var deferred = this.$q.defer();
            var getString = this.existString
                .replace("{0}", userName)
                .replace("{2}", this.clientId);
            this.$http.get(this.serviceBase + this.existEndPoint + getString)
                .success(success).error(error);
            return deferred.promise;
            function success(available) {
                deferred.resolve(true);
            }
            function error(response) {
                deferred.resolve(false);
            }
        };
        OAuthService.prototype.login = function (login) {
            var self = this, hdrs = self.ngAuthSettings.header, postStr = self.postContent
                .replace('{0}', login.email)
                .replace('{1}', login.password)
                .replace('{2}', self.clientId), deferred = self.$q.defer();
            //note: ng.ihttppromicecallbackarg<iauthorized> is supposed to
            //return a response object with a .data but it's returning the data
            //instead... that's why the errors below... do not change
            self.$http.post(self.serviceBase + self.logEndPoint, postStr, hdrs)
                .success(function (response) {
                var rsp = response;
                var user = new ZoEazySPA.User(rsp.userName, rsp.name, true, new ZoEazySPA.Phone(rsp.phone), new ZoEazySPA.Position(rsp.longitude, rsp.latitude, true, true, rsp.address, rsp.postalCode, 'COMPLETE'));
                self.save(user);
                self.$rootScope.$broadcast('auth.userLogedIn', { user: user });
                return deferred.resolve(user.userName);
            })
                .error(function (err) {
                self.logOut();
                return deferred.reject("Invalid User or Password");
            });
            return deferred.promise;
        };
        OAuthService.prototype.isAuthenticated = function () {
            var authData = this.localStorageService.get(this.authKey);
            if (!authData)
                return false;
            return this.common.hasValue(authData.userName);
        };
        OAuthService.prototype.isNotAuthenticated = function () {
            return !this.isAuthenticated();
        };
        OAuthService.prototype.logOut = function () {
            this.localStorageService.remove(this.authKey);
            var user = new ZoEazySPA.User();
            this.$rootScope.$broadcast('auth.userLogedOut', { user: user });
        };
        OAuthService.prototype.register = function (user) {
            var self = this, data = {
                email: user.email,
                clientid: this.clientId,
                userName: user.userName,
                phone: user.phone,
                password: user.password,
                address: user.position.address,
                postalCode: user.position.postalCode,
                latitude: user.position.latitude,
                longitude: user.position.longitude
            };
            var hdrs = self.ngAuthSettings.header;
            var deferred = self.$q.defer();
            self.$http.post(self.serviceBase + self.regEndPoint, data, hdrs)
                .success(success)
                .error(error);
            return deferred.promise;
            function success() {
                var userLog = user;
                self.login(user).then(function (response) {
                    deferred.resolve(true);
                }, function (error) {
                    deferred.resolve(false);
                });
            }
            function error(response, status) {
                deferred.reject(false);
            }
        };
        OAuthService.prototype.save = function (user) {
            this.localStorageService.set(this.authKey, user);
        };
        OAuthService.prototype.susbscribe = function (user) {
            return this.timeout(function () {
                if (['john@admin.com', 'tyrion@admin.com', 'arya@admin.com'].indexOf(user) !== -1) {
                    throw new Error('taken');
                }
            }, 1000);
        };
        OAuthService.$inject = ['$rootScope', '$http', '$q', 'localStorageService', 'ngAuthSettings', '$timeout', 'Tools', 'GeoService'];
        return OAuthService;
    }());
    ZoEazySPA.OAuthService = OAuthService;
    ;
    angular.module('Common')
        .service('OAuthService', OAuthService);
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=OauthService.js.map