module ZoEazySPA {
    'use strict';
    
    export class LoginCtrl {
        static $inject = ['$scope', '$state', 'OAuthService', 'Tools',  '$mdDialog'];//, 'user'];
        
        private labels: {} = { login: 'Login', cancel: 'Cancel', title: 'Login' };
        private fields: any = [
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
        private originalFields: any;
        private user: IUserLog;
        private error: string;
        
        constructor(
            private $scope: ng.IScope,
            private $state: ng.ui.IStateService,
            private oAuth: OAuthService,
            private common: Common.Tools,
            private mdDialog: ng.material.IDialogService
            
        ) {
            
            this.error = '';
            this.originalFields = angular.copy(this.fields);
            this.user = new UserLog('', '', true);
        }

        cancel(): void {
            this.mdDialog.hide();
        }

        login(): void {
            var self = this;
            self.oAuth.login(this.user).then(
                (response: User): void => {
                    self.mdDialog.hide();
                }, 
                (response: string): void => {
                    self.common.log(response);
                    self.error = response;
                });
        }
    }

    angular
        .module('ZoEazySPA')
        .controller('LoginCtrl', LoginCtrl);
}
