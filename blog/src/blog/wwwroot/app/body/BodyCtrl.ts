module ZoEazySPA {
    'use strict';

    interface IBodyScope extends ng.IScope {
        date: Date;
        closeToast: Function;
    };

    class BodyCtrl {

        static $inject = [
            '$rootScope',
            '$scope',
            '$state',
            'OAuthService',
            '$mdDialog',
            '$mdToast',
            '$mdBottomSheet',
            '$mdSidenav',
            'GeoService',
            '$timeout',
            '$log',
            'LocationService'
        ];

        icons: Array<string> = Array(4);
        fills: Array<string> = Array(4);
        labels: Array<string> = Array(4);
        icons1: Array<string> = ['map', 'navigation', 'place'];
        icons2: Array<string> = ['delivery', 'store', 'local_restaurant'];
        icons3: Array<string> = ['chinese', 'pizza', 'hamburger'];
        icons4: Array<string> = ['phone_iphone', 'tablet', 'desktop', 'devices_other'];

        colors1: Array<string> = ['lightgreen', 'lightred', '#cc99ff'];
        colors2: Array<string> = ['blueviolet', 'crimson', 'darkcyan'];
        colors3: Array<string> = ['white', 'red', 'red'];
        colors4: Array<string> = ['cadetblue', 'darkgreen', 'steelblue'];

        labels1: Array<string> = ['Pick a restaurant', 'In your area', 'Or save your favorites'];
        labels2: Array<string> = ['Delivery', 'Pickup', 'Anyway you like'];
        labels3: Array<string> = ['Any kind', 'Any Price', 'The way you like'];
        labels4: Array<string> = ['iPhone', 'Tablet', 'Desktop'];
        clss1: Array<boolean> = [true, false, false];

        size: number = 12;
        icon: string = 'notifications';
        fill: string = 'lightgreen';
        cnt: number = 1;


        events: any;

        title: string = 'Your order';

        addressLabels: Array<string>;
        addressColors: Array<string>;
        user: User;

        allIcon: string = "double_keyboard_arrow_up";
        singleIcon: string = "keyboard_arrow_up";
        allMsg: string = "Close";
        clue: string = "";
        private menus: server.Menu[];

        private fields: {};
        private container: any;
        private section: any;
        public currentState: string;
        categories: Array<string> = [];
        selected: Array<string> = [];
        constructor(
            private $rootScope: ng.IRootScopeService,
            private $scope: IBodyScope,
            private $state: ng.ui.IStateService,
            private oAuth: OAuthService,
            private mdDialog: any, // ng.material.IDialogService,
            private mdToast: ng.material.IToastService,
            private mdBottomSheet: ng.material.IBottomSheetService,
            private mdSidenav: ng.material.ISidenavService,
            private geoService: GeoService,
            private timeout: ng.ITimeoutService,
            private log: ng.ILogService,
            private locationSrv
        ) {
            var bd = this;
            this.icons[0] = this.icons1[0];
            this.fills[0] = this.colors1[0];
            this.labels[0] = this.labels1[0];
            this.icons[1] = this.icons2[0];
            this.fills[1] = this.colors2[0];
            this.labels[1] = this.labels2[0];
            this.icons[2] = this.icons3[0];
            this.fills[2] = this.colors3[0];
            this.labels[2] = this.labels3[0];
            this.icons[3] = this.icons4[0];
            this.fills[3] = this.colors4[0];
            this.labels[3] = this.labels4[0];

            this.fields = [
                {
                    key: 'userPosition.address',
                    type: 'input',

                    templateOptions: {
                        required: true,
                        type: 'text',
                        label: 'Zip code, City or Full Address',
                        onKeydown: function (value: any, options: any) {
                            options.validation.show = false;
                        },
                        onBlur: function (value: any, options: any) {
                            options.validation.show = true;
                        }
                    },
                    asyncValidators: {
                        validAddress: {
                            expression: ($viewValue: any, $modelValue: any, scope: any) => {
                                if (scope.model.userPosition.address !== $viewValue) {
                                    return geoService.googleMapRequestAddress($viewValue).then(
                                        (rsp: Position): void => {
                                            bd.$rootScope.$broadcast('geo.positioned', { position: rsp });

                                            bd.user.userPosition = rsp;

                                            if(bd.currentState === 'locations')
                                                locationSrv.get(bd.user.userPosition, bd.user.systemPosition);
                                            else
                                                bd.$state.go('locations');
                                        });
                                }
                            },
                            message: '"Invalid Address."'
                        }
                    },
                    modelOptions: {
                        updateOn: 'blur'
                    },
                    "expressionProperties": {
                        "templateOptions.hintNeeded": "model.userPosition.needsConfirmation"
                    }
                },
                {
                    key: 'order.kind',
                    type: 'radioRow',
                    templateOptions: {
                        label: 'Service',
                        theme: 'custom',
                        labelProp: 'label',
                        valueProp: 'knd',
                        options: [
                            { label: 'Delivery', knd: Kind.DELIVERY },
                            { label: 'Pickup', knd: Kind.PICKUP },
                        ]
                    },
                    watcher: {
                        expression: 'model.order.kind',
                        listener: (field, newVal, oldVal, scope, stopWatching) => {
                            if (!isNaN(newVal))
                                scope.model.order.calculate();
                        }
                    }
                }
            ];

            setInterval(() => {

                this.icons[0] = this.icons1[this.cnt];
                this.fills[0] = this.colors1[this.cnt];
                this.icons[1] = this.icons2[this.cnt];
                this.fills[1] = this.colors2[this.cnt];
                this.icons[2] = this.icons3[this.cnt];
                this.fills[2] = this.colors3[this.cnt];
                this.icons[3] = this.icons4[this.cnt];
                this.fills[3] = this.colors4[this.cnt];
                this.clss1 = [(this.cnt === 0), (this.cnt === 1), (this.cnt === 2)];
                this.$scope.$apply();

                this.cnt++;

                if (this.cnt >= this.icons1.length) this.cnt = 0;


            }, 5000);

            $scope.$on('$stateChangeStart', function (event: ng.IAngularEvent, toState: ng.ui.IState, toParams: {}, fromState: ng.ui.IState) {
                bd.currentState = toState.name;
            });

            $scope.$on('Logger.ShowToast', (event: ng.IAngularEvent, config: any): void => {
                var msg = config.message.substring(0, 60);
                if (msg.length < config.message.length) msg += '...';

                mdToast.show({
                    controller: function () { $scope.closeToast = function () { mdToast.hide(); }; },
                    template: '<md-toast class=\'md-toast ' + config.toastType + '\'><span flex>'
                    + msg + '</span></md-toast>',
                    hideDelay: 4000,
                    position: 'top right'
                });
            });

            $scope.$on('auth.userCreated', (event: ng.IAngularEvent, args: { user: User, loged: boolean }): void => {
                this.user = args.user;
                this.geoService.getPosition(args.loged)
                    .then((rsp: Position) => {

                        this.$rootScope.$broadcast('geo.positioned', { position: rsp });

                        this.user.systemPosition = rsp;
                        this.$state.go('locations');
                    },
                    (err: any) => {
                        if (this.user.userPosition) {
                            this.$state.go('locations');
                        }
                    });
            });

            $scope.$on('auth.userLogedIn', (event: ng.IAngularEvent, args: { user: User }): void => {
                args.user.systemPosition = bd.user.systemPosition;
                bd.user = args.user;
            });

            $scope.$on('auth.userLogedOut', (event: ng.IAngularEvent, args: { user: User }): void => {
                args.user.systemPosition = bd.user.systemPosition;
                bd.user = args.user;
            });

            $scope.$on('location.yelpGraph', (event: ng.IAngularEvent, args: { categories: Array<string> }): void => {
                bd.categories = bd.categories.concat(args.categories).sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                });
                bd.selected = angular.copy(bd.categories);
            });

            $scope.$on('location.zoeazyBusinesses', (event: ng.IAngularEvent, args: {  categories: Array<string> }): void => {
                bd.categories = bd.categories.concat(args.categories).sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                });
                bd.selected = angular.copy(bd.categories);
            });
            oAuth.fillAuthData();
        }

        bottomSheet(ev: MouseEvent, kind: string) {

            if (kind === 'web') {
                var win = window.open('https://www.verticalviral.com', '_blank');
                win.focus();

            } else {
                this.mdBottomSheet.show({
                    templateUrl: 'app/body/bottomSheet.html',
                    controller: 'bottomSheetCtrl',
                    controllerAs: 'bs',
                    targetEvent: ev,
                    locals: { kind: kind }

                });
            }
        }

        buildDelayedToggler(navID: string) {
            var fun: Function = function () {
                this.mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        this.log.debug("toggle " + navID + " is done");
                    });
            };

            return this.debounce(fun, 200, undefined);
        }

        buildToggler(navID: string) {
            return function () {
                this.mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        this.log.debug("toggle " + navID + " is done");
                    });
            }
        }

        goTo(ev: MouseEvent, route: string) {
            this.$state.go(route, { user: this.user });
        }

        goHome() {

            this.goTo(undefined, 'home')
        }

        clearSearch() {
            this.clue = '';
            this.search();
        }

        debounce(func: Function, wait: number, context: any) {
            var timer: any;

            return function debounced() {
                var context = this,
                    args = Array.prototype.slice.call(arguments);
                this.timeout.cancel(timer);
                timer = this.timeout(function () {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }



        help(ev: any) {
            this.mdDialog.show({
                templateUrl: '../material/help/' + this.$state.current.name + '.html',
                targetEvent: ev
            });
        }

        login(ev: MouseEvent) {
            this.mdDialog.show({
                templateUrl: 'app/body/login/login.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                escapeToClose: true,
                focusOnOpen: true,
                controller: 'LoginCtrl',
                controllerAs: 'lg'
                //,locals: { user: this.user }
            });
        }

        logOut() {
            this.oAuth.logOut();
            this.geoService.logOut();
            this.$state.go('home');
        }

        newsletter(ev: MouseEvent) {
            this.mdDialog.show({
                templateUrl: 'app/body/newsletter/newsletter.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                escapeToClose: true,
                focusOnOpen: true,
                controller: 'NewsletterCtrl',
                controllerAs: 'nw',
                locals: { newEmail: this.user.email }
            });
        }

        register(ev: MouseEvent) {
            this.mdDialog.show({
                templateUrl: 'app/body/register/register.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                escapeToClose: true,
                focusOnOpen: true,
                controller: 'RegisterCtrl',
                controllerAs: 'rg',
                locals: {
                    regName: this.user.userName,
                    regPosition: this.user.systemPosition,
                    regPhone: this.user.phone
                }
            });
        }

        search(): void {
            this.$scope.$broadcast('body.search', { clue: this.clue });
        }

        toggle(id: string = 'order'): void {
            var self = this;
            self.mdSidenav(id).toggle()
                .then(() => {
                    if (id === 'order')
                        self.$scope.$broadcast('body.map');
                });
        };

        toSection(id: number): void {
            var section: any = angular.element(document.getElementById('section' + id));
            var container: any = angular.element(document.getElementById('dishes-container'));
            container.scrollTo(section, 0, 1000);

            this.$scope.$broadcast('bd.toSection', { id: id });
        }

        toTop(): void {
            var container: any = angular.element(document.getElementById('dishes-container'));
            container.scrollTop(0, 2000);
        }


        toggleCB(category) {
            var idx = this.selected.indexOf(category);
            if (idx > -1)
                this.selected.splice(idx, 1);

            else
                this.selected.push(category);


            this.$scope.$broadcast('body.selected', { selected: this.selected });
        };

        exists(item) {
            return this.selected.indexOf(item) > -1;
        };
        isIndeterminate () {
            return (this.selected.length !== 0 && this.selected.length !== this.categories.length);
        };
        isChecked() {
            return this.selected.length === this.categories.length;
        };
        toggleAll() {
            if (this.selected.length === this.categories.length)
                this.selected = [];
            else
                this.selected = this.categories.slice(0);

            this.$scope.$broadcast('body.selected', { selected: this.selected });
        };

    }

    angular
        .module('ZoEazySPA')
        .controller('BodyCtrl', BodyCtrl);
}
