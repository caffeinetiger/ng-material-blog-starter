module ZoEazySPA {
    'use strict';

    export interface IOAuthService {

        //getUser(): IUser

        login(login: UserLog): ng.IPromise<User>;

        isAuthenticated(): boolean;

        isNotAuthenticated(): boolean;

        isUserAvailable(userName: string): ng.IPromise<boolean>;

        logOut(): void;

        register(user: UserReg): ng.IPromise<any>;

        requestConfirmation(email: string): ng.IPromise<any>;

        susbscribe(user: string): ng.IPromise<string>;
    }

    interface IAuthorized {
        access_token: string;
        user: IUser
    }

    interface IErrorResponse {
        error: string;
        error_description: string;
    }

    export class OAuthService implements IOAuthService {

        static $inject = ['$rootScope', '$http', '$q', 'localStorageService', 'ngAuthSettings', '$timeout', 'Tools','GeoService'];

        private existEndPoint: string;
        private existString: string;
        private serviceBase: string;
        private logEndPoint: string;
        private regEndPoint: string;
        private reqConfEndPoint: string;
        private postContent: string;
        private postReqConf: string;
        private hdrs: {};
        private clientId: string;
        private authKey: string;

        constructor(
            private $rootScope: ng.IRootScopeService,
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private localStorageService: ng.local.storage.ILocalStorageService,
            private ngAuthSettings: Common.INgAuthSettings,
            private timeout: ng.ITimeoutService,
            private common: Common.Tools,
            private geoService: GeoService
        ) {

            this.serviceBase = ngAuthSettings.authServiceUri;
            this.logEndPoint = ngAuthSettings.endPoint;
            this.regEndPoint = ngAuthSettings.regEndPoint;
            this.reqConfEndPoint = ngAuthSettings.reqConfEndPoint;
            this.existEndPoint = ngAuthSettings.existEndPoint;
            this.postContent = ngAuthSettings.postContent;
            this.postReqConf = ngAuthSettings.postReqConf;
            this.existString = ngAuthSettings.existString;
            this.hdrs = ngAuthSettings.header;

            if (ZoEazyDebug) this.clientId = ngAuthSettings.clientId;//constant for test puprposes

            this.authKey = ngAuthSettings.authKey;
        }

        public fillAuthData(): void {
            var user: User, loged: boolean = false;
            var data: any = this.localStorageService.get(this.authKey);

            try {
                if (data && data.status === undefined) {
                    user = new User(data.email, data.userName, data.isLoged, data.phone, data.userPosition);
                } else {
                    user = new User();
                }
            } catch(err) {
                user = new User();
            }

            this.$rootScope.$broadcast('auth.userCreated', { user: user, loged: loged });
        };

        public isUserAvailable(userName: string): ng.IPromise<boolean> {

            var deferred = this.$q.defer();

            var getString = this.existString
                .replace("{0}", userName)
                .replace("{2}", this.clientId);

            this.$http.get(this.serviceBase + this.existEndPoint + getString)
                .success(success).error(error);

            return deferred.promise;

            function success(available: any) {
                deferred.resolve(true);
            }

            function error(response: any) {
                deferred.resolve(false);
            }

        }

        public login(login: IUserLog): ng.IPromise<User> {
            var self = this,
                hdrs = self.ngAuthSettings.header,
                postStr = self.postContent
                    .replace('{0}', login.email)
                    .replace('{1}', login.password)
                    .replace('{2}', self.clientId),
                deferred = self.$q.defer();

            //note: ng.ihttppromicecallbackarg<iauthorized> is supposed to
            //return a response object with a .data but it's returning the data
            //instead... that's why the errors below... do not change
            self.$http.post(self.serviceBase + self.logEndPoint, postStr, hdrs)
                .success((response: ng.IHttpPromiseCallbackArg<any>): void => {

                    var rsp: any = response;
                    var user = new User(rsp.userName, rsp.name, true, new Phone(rsp.phone), new Position(rsp.longitude, rsp.latitude, true, true, rsp.address, rsp.postalCode, 'COMPLETE'));
                    self.save(user);

                    self.$rootScope.$broadcast('auth.userLogedIn', { user: user });
                    return deferred.resolve(user.userName);
                })
                .error((err: IErrorResponse): void => {
                    self.logOut();
                    return deferred.reject("Invalid User or Password");
                });

            return deferred.promise;
        }

        public isAuthenticated(): boolean {
            var authData: any = this.localStorageService.get(this.authKey);

            if (!authData) return false;
            return this.common.hasValue(authData.userName);
        }

        public isNotAuthenticated() {
            return !this.isAuthenticated();
        }

        public logOut(): void {
            this.localStorageService.remove(this.authKey);
            var user = new User();

            this.$rootScope.$broadcast('auth.userLogedOut', { user: user });
        }

        public register(user: IUserReg): ng.IPromise<boolean> {
            var self = this,
                data = {
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

                var userLog = <IUserLog>user;

                self.login(user).then(
                    function (response: User) {
                        deferred.resolve(true);
                    },
                    function (error: string) {
                        deferred.resolve(false);
                    });
            }

            function error(response: any, status: number) {
                deferred.reject(false);
            }
        }

        public requestConfirmation = function (email: string): ng.IPromise<boolean> {

            var data = {
                email: email,
                clientid: this.clientId
            };

            var deferred = this.$q.defer();

            this.$http.post(this.serviceBase + this.reqConfEndPoint, data, this.hdrs)
                .success(success).error(error);

            return deferred.promise;

            function success(response: ng.IHttpPromiseCallbackArg<boolean>) {
                return deferred.resolve(response);
            }

            function error(response: any) {
                this.logOut();
                deferred.reject(response);
                this.$rootScope.$state.go('404');
            }
        };

        public save(user: User) {
            this.localStorageService.set(this.authKey, user);
        }

        public susbscribe(user: string): ng.IPromise<string> {
            return this.timeout(function () {
                if (['john@admin.com', 'tyrion@admin.com', 'arya@admin.com'].indexOf(user) !== -1) {
                    throw new Error('taken');
                }
            }, 1000);
        }
    };

    angular.module('Common')
        .service('OAuthService', OAuthService);
}
