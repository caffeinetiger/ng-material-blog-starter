module ZoEazySPA {
    'use strict';

    export class RegisterCtrl {
        static $inject = ['$rootScope', 'OAuthService', 'Tools', '$mdDialog', 'GeoService', 'regName', 'regPosition', 'regPhone'];

        private labels: {} = { register: 'Register', cancel: 'Cancel', title: 'Register' };
        private fields: {};
        private originalFields: {};
        public user: IUserReg;
        private error: string;

        constructor(
            private scope: ng.IRootScopeService,
            private oAuth: OAuthService,
            private tools: Common.Tools,
            private mdDialog: ng.material.IDialogService,
            private geoService: GeoService,
            private regName: string,
            private regPosition: Position,
            private regPhone: Phone
        ) {
            var rg = this;

            this.error = '';

            this.user = new UserReg('', regName, regPhone, '', '', true, regPosition);
            
            this.fields = [
                {
                    key: 'email',
                    type: 'input',
                    templateOptions: {
                        label: 'Email',
                        type: 'email',
                        required: true
                    },
                    asyncValidators: {
                        uniqueUsername: {
                            expression: ($viewValue: any, $modelValue: any, scope: any) => {
                                scope.options.templateOptions.loading = true;
                                return this.oAuth.isUserAvailable($viewValue).then(
                                    (response: boolean): void => {
                                        scope.options.templateOptions.loading = false;
                                        if (!response) throw new Error('taken');
                                    });
                            },
                            message: '"This username is already taken."'
                        }
                    },

                    modelOptions: {
                        updateOn: 'blur'
                    }
                },
                {
                    key: 'password',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Password',
                        hint: 'At least 5 characters with at least 1 number',
                        required: true,
                        minlength: 5
                    },
                    validators: {
                        psw2: {
                            expression: function (viewValue: any, modelValue: any, scope: any) {
                                return viewValue.length >= 5;
                            },
                            message: '"Less than 5 characters"'
                        },
                        psw: {
                            expression: function (viewValue: any, modelValue: any, scope: any) {
                                var numberOnly = /^[0-9]+$/, nums = 0;
                                for (var iChar = 0; iChar < viewValue.length; iChar++) {
                                    nums += numberOnly.test(viewValue[iChar]) ? 1 : 0;
                                }
                                return nums >= 1;
                            },
                            message: '"Does not contain number"'
                        }

                    }
                },
                {
                    key: 'reenterPassword',
                    type: 'input',
                    optionsTypes: ['matchField'],
                    templateOptions: {
                        type: 'password',
                        label: 'Confirm Password',
                        required: true
                    },
                    data: {
                        fieldToMatch: 'password',
                        modelToMatch: this.user
                    }
                },
                {
                    key: 'userName',
                    type: 'input',
                    modelOptions: {
                        updateOn: 'blur'
                    },
                    templateOptions: {
                        required: true,
                        type: 'text',
                        label: 'name',
                        hint: 'First name or Nickname'
                    }
                },
                {
                    key: 'userPosition.address',
                    type: 'input',

                    templateOptions: {
                        required: true,
                        type: 'text',
                        label: 'Address',
                        hint: 'Your Address (enter or modify the computer generated)'
                    },
                    asyncValidators: {
                        validAddress: {
                            expression: ($viewValue: any, $modelValue: any, scope: any) => {
                                if (scope.model.userPosition.address !== $viewValue) {
                                    scope.options.templateOptions.loading = true;
                                    return geoService.googleMapRequestAddress($viewValue).then(
                                        (response: Position): void => {
                                            scope.options.templateOptions.loading = false;
                                            if (!response) throw new Error('taken');

                                            scope.model.userPosition.getFromPosition(response);
                                        });
                                }
                            },
                            message: '"Invalid Address."'
                        }
                    }
                },
                {
                    key: 'phone.str',
                    type: 'maskedInput',
                    templateOptions: {
                        label: 'Phone Number ',
                        mask: '(999) 999-9999 ext. 9999 ',
                        hint: 'optional',
                        required: false
                    },
                    validators: {
                        phone: {
                            expression: function (viewValue: any, modelValue: any, scope: any) {
                                return scope.model.phone.valid(modelValue);
                            },
                            message: 'model.phone.err'
                        }
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
            this.originalFields = angular.copy(this.fields);
        }

        cancel(): void {
            this.mdDialog.hide();
        }

        register(): void {
            var self = this;

            if (self.user.userName === '')
                self.user.userName = self.user.email;

            self.oAuth.register(self.user).then(
                (response: boolean): void => {
                    self.mdDialog.hide();

                }, (err: boolean): void => {
                    self.tools.log('Invalid Request', 'error');

                });
        }
    }

    angular
        .module('ZoEazySPA')
        .controller('RegisterCtrl', RegisterCtrl);
}
