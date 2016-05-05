var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    ;
    var NewsletterCtrl = (function () {
        function NewsletterCtrl($scope, $rootScope, $state, oAuth, common, mdDialog, newEmail) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.oAuth = oAuth;
            this.common = common;
            this.mdDialog = mdDialog;
            this.newEmail = newEmail;
            this.labels = { subscribe: 'Subscribe', cancel: 'Cancel', title: 'Newsletter' };
            this.fields = [
                {
                    key: 'email',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        type: 'email',
                        label: 'Email'
                    }
                }
            ];
            this.user = { email: '' };
            this.user.email = newEmail;
            this.originalFields = angular.copy(this.fields);
        }
        ;
        NewsletterCtrl.prototype.cancel = function () {
            this.mdDialog.hide();
        };
        NewsletterCtrl.prototype.onSubmit = function () {
            this.oAuth.susbscribe(this.user.email).then(this.success, this.error);
        };
        NewsletterCtrl.prototype.success = function (response) {
            this.$scope.$emit(this.events.userLoggedIn, { userName: response });
            this.mdDialog.hide();
        };
        NewsletterCtrl.prototype.error = function (response) {
            this.common.log(response);
        };
        NewsletterCtrl.$inject = [
            '$scope', '$rootScope', '$state',
            'OAuthService', 'Tools', '$mdDialog', 'newEmail'
        ];
        return NewsletterCtrl;
    }());
    ZoEazySPA.NewsletterCtrl = NewsletterCtrl;
    angular
        .module('ZoEazySPA')
        .controller('NewsletterCtrl', NewsletterCtrl);
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=NewsletterCtrl.js.map