module ZoEazySPA {
    'use strict';
    
    interface IUser {
        email: string;
    };

    export class NewsletterCtrl {

        static $inject = [
            '$scope', '$rootScope', '$state', 
            'OAuthService', 'Tools', '$mdDialog', 'newEmail'
        ];

        private events: {
            partialViewCancel: string;
            userLoggedIn: string;
        };
        private labels: {} = { subscribe: 'Subscribe', cancel: 'Cancel', title: 'Newsletter' };
        private originalFields: {};
        
        private fields = [
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
        private user: IUser = { email: ''};

        constructor(
            private $scope: ng.IScope,
            private $rootScope: ng.IRootScopeService,
            private $state: ng.ui.IStateService,
            private oAuth: OAuthService,
            private common: Common.Tools,
            private mdDialog: ng.material.IDialogService,
            private newEmail: string
        ) {
            this.user.email = newEmail;
            this.originalFields = angular.copy(this.fields);
        };

        cancel(): void {
            this.mdDialog.hide();
        }

        onSubmit(): void {
            this.oAuth.susbscribe(this.user.email).then(this.success, this.error);
        }

        success(response: string): void {
            this.$scope.$emit(this.events.userLoggedIn, { userName: response });
            this.mdDialog.hide();
        }

        error(response: string): void {
            this.common.log(response);
        }
    }

    angular
        .module('ZoEazySPA')
        .controller('NewsletterCtrl', NewsletterCtrl);
}
