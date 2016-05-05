var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    var LoginCtrl = (function () {
        function LoginCtrl($scope, $state, oAuth, common, mdDialog) {
            this.$scope = $scope;
            this.$state = $state;
            this.oAuth = oAuth;
            this.common = common;
            this.mdDialog = mdDialog;
            this.labels = { login: 'Login', cancel: 'Cancel', title: 'Login' };
            this.fields = [
                {
                    key: 'email',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        type: 'email',
                        label: 'Email'
                    }
                },
                {
                    key: 'password',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        type: 'password',
                        label: 'Password'
                    }
                },
                {
                    key: 'rememberMe',
                    type: 'checkbox',
                    templateOptions: {
                        label: 'Keep me signed in'
                    }
                }
            ];
            this.error = '';
            this.originalFields = angular.copy(this.fields);
            this.user = new ZoEazySPA.UserLog('', '', true);
        }
        LoginCtrl.prototype.cancel = function () {
            this.mdDialog.hide();
        };
        LoginCtrl.prototype.login = function () {
            var self = this;
            self.oAuth.login(this.user).then(function (response) {
                self.mdDialog.hide();
            }, function (response) {
                self.common.log(response);
                self.error = response;
            });
        };
        LoginCtrl.$inject = ['$scope', '$state', 'OAuthService', 'Tools', '$mdDialog']; //, 'user'];
        return LoginCtrl;
    }());
    ZoEazySPA.LoginCtrl = LoginCtrl;
    angular
        .module('ZoEazySPA')
        .controller('LoginCtrl', LoginCtrl);
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=LoginCtrl.js.map