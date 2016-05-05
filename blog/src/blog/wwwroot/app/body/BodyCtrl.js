var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    ;
    var BodyCtrl = (function () {
        function BodyCtrl($rootScope, $scope, $state, oAuth, mdDialog, // ng.material.IDialogService,
            mdToast, mdBottomSheet, mdSidenav, geoService, timeout, log, locationSrv) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$state = $state;
            this.oAuth = oAuth;
            this.mdDialog = mdDialog;
            this.mdToast = mdToast;
            this.mdBottomSheet = mdBottomSheet;
            this.mdSidenav = mdSidenav;
            this.geoService = geoService;
            this.timeout = timeout;
            this.log = log;
            this.locationSrv = locationSrv;
            this.icons = Array(4);
            this.fills = Array(4);
            this.labels = Array(4);
            this.icons1 = ['map', 'navigation', 'place'];
            this.icons2 = ['delivery', 'store', 'local_restaurant'];
            this.icons3 = ['chinese', 'pizza', 'hamburger'];
            this.icons4 = ['phone_iphone', 'tablet', 'desktop', 'devices_other'];
            this.colors1 = ['lightgreen', 'lightred', '#cc99ff'];
            this.colors2 = ['blueviolet', 'crimson', 'darkcyan'];
            this.colors3 = ['white', 'red', 'red'];
            this.colors4 = ['cadetblue', 'darkgreen', 'steelblue'];
            this.labels1 = ['Pick a restaurant', 'In your area', 'Or save your favorites'];
            this.labels2 = ['Delivery', 'Pickup', 'Anyway you like'];
            this.labels3 = ['Any kind', 'Any Price', 'The way you like'];
            this.labels4 = ['iPhone', 'Tablet', 'Desktop'];
            this.clss1 = [true, false, false];
            this.size = 12;
            this.icon = 'notifications';
            this.fill = 'lightgreen';
            this.cnt = 1;
            this.title = 'Your order';
            this.allIcon = "double_keyboard_arrow_up";
            this.singleIcon = "keyboard_arrow_up";
            this.allMsg = "Close";
            this.clue = "";
            this.categories = [];
            this.selected = [];
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
                        onKeydown: function (value, options) {
                            options.validation.show = false;
                        },
                        onBlur: function (value, options) {
                            options.validation.show = true;
                        }
                    },
                    asyncValidators: {
                        validAddress: {
                            expression: function ($viewValue, $modelValue, scope) {
                                if (scope.model.userPosition.address !== $viewValue) {
                                    return geoService.googleMapRequestAddress($viewValue).then(function (rsp) {
                                        bd.$rootScope.$broadcast('geo.positioned', { position: rsp });
                                        bd.user.userPosition = rsp;
                                        if (bd.currentState === 'locations')
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
                            { label: 'Delivery', knd: ZoEazySPA.Kind.DELIVERY },
                            { label: 'Pickup', knd: ZoEazySPA.Kind.PICKUP },
                        ]
                    },
                    watcher: {
                        expression: 'model.order.kind',
                        listener: function (field, newVal, oldVal, scope, stopWatching) {
                            if (!isNaN(newVal))
                                scope.model.order.calculate();
                        }
                    }
                }
            ];
            setInterval(function () {
                _this.icons[0] = _this.icons1[_this.cnt];
                _this.fills[0] = _this.colors1[_this.cnt];
                _this.icons[1] = _this.icons2[_this.cnt];
                _this.fills[1] = _this.colors2[_this.cnt];
                _this.icons[2] = _this.icons3[_this.cnt];
                _this.fills[2] = _this.colors3[_this.cnt];
                _this.icons[3] = _this.icons4[_this.cnt];
                _this.fills[3] = _this.colors4[_this.cnt];
                _this.clss1 = [(_this.cnt === 0), (_this.cnt === 1), (_this.cnt === 2)];
                _this.$scope.$apply();
                _this.cnt++;
                if (_this.cnt >= _this.icons1.length)
                    _this.cnt = 0;
            }, 5000);
            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                bd.currentState = toState.name;
            });
            $scope.$on('Logger.ShowToast', function (event, config) {
                var msg = config.message.substring(0, 60);
                if (msg.length < config.message.length)
                    msg += '...';
                mdToast.show({
                    controller: function () { $scope.closeToast = function () { mdToast.hide(); }; },
                    template: '<md-toast class=\'md-toast ' + config.toastType + '\'><span flex>'
                        + msg + '</span></md-toast>',
                    hideDelay: 4000,
                    position: 'top right'
                });
            });
            $scope.$on('auth.userCreated', function (event, args) {
                _this.user = args.user;
                _this.geoService.getPosition(args.loged)
                    .then(function (rsp) {
                    _this.$rootScope.$broadcast('geo.positioned', { position: rsp });
                    _this.user.systemPosition = rsp;
                    _this.$state.go('locations');
                }, function (err) {
                    if (_this.user.userPosition) {
                        _this.$state.go('locations');
                    }
                });
            });
            $scope.$on('auth.userLogedIn', function (event, args) {
                args.user.systemPosition = bd.user.systemPosition;
                bd.user = args.user;
            });
            $scope.$on('auth.userLogedOut', function (event, args) {
                args.user.systemPosition = bd.user.systemPosition;
                bd.user = args.user;
            });
            $scope.$on('location.yelpGraph', function (event, args) {
                bd.categories = bd.categories.concat(args.categories).sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                });
                bd.selected = angular.copy(bd.categories);
            });
            $scope.$on('location.zoeazyBusinesses', function (event, args) {
                bd.categories = bd.categories.concat(args.categories).sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                });
                bd.selected = angular.copy(bd.categories);
            });
            oAuth.fillAuthData();
        }
        BodyCtrl.prototype.bottomSheet = function (ev, kind) {
            if (kind === 'web') {
                var win = window.open('https://www.verticalviral.com', '_blank');
                win.focus();
            }
            else {
                this.mdBottomSheet.show({
                    templateUrl: 'app/body/bottomSheet.html',
                    controller: 'bottomSheetCtrl',
                    controllerAs: 'bs',
                    targetEvent: ev,
                    locals: { kind: kind }
                });
            }
        };
        BodyCtrl.prototype.buildDelayedToggler = function (navID) {
            var fun = function () {
                this.mdSidenav(navID)
                    .toggle()
                    .then(function () {
                    this.log.debug("toggle " + navID + " is done");
                });
            };
            return this.debounce(fun, 200, undefined);
        };
        BodyCtrl.prototype.buildToggler = function (navID) {
            return function () {
                this.mdSidenav(navID)
                    .toggle()
                    .then(function () {
                    this.log.debug("toggle " + navID + " is done");
                });
            };
        };
        BodyCtrl.prototype.goTo = function (ev, route) {
            this.$state.go(route, { user: this.user });
        };
        BodyCtrl.prototype.goHome = function () {
            this.goTo(undefined, 'home');
        };
        BodyCtrl.prototype.clearSearch = function () {
            this.clue = '';
            this.search();
        };
        BodyCtrl.prototype.debounce = function (func, wait, context) {
            var timer;
            return function debounced() {
                var context = this, args = Array.prototype.slice.call(arguments);
                this.timeout.cancel(timer);
                timer = this.timeout(function () {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        };
        BodyCtrl.prototype.help = function (ev) {
            this.mdDialog.show({
                templateUrl: '../material/help/' + this.$state.current.name + '.html',
                targetEvent: ev
            });
        };
        BodyCtrl.prototype.login = function (ev) {
            this.mdDialog.show({
                templateUrl: 'app/body/login/login.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                escapeToClose: true,
                focusOnOpen: true,
                controller: 'LoginCtrl',
                controllerAs: 'lg'
            });
        };
        BodyCtrl.prototype.logOut = function () {
            this.oAuth.logOut();
            this.geoService.logOut();
            this.$state.go('home');
        };
        BodyCtrl.prototype.newsletter = function (ev) {
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
        };
        BodyCtrl.prototype.register = function (ev) {
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
        };
        BodyCtrl.prototype.search = function () {
            this.$scope.$broadcast('body.search', { clue: this.clue });
        };
        BodyCtrl.prototype.toggle = function (id) {
            if (id === void 0) { id = 'order'; }
            var self = this;
            self.mdSidenav(id).toggle()
                .then(function () {
                if (id === 'order')
                    self.$scope.$broadcast('body.map');
            });
        };
        ;
        BodyCtrl.prototype.toSection = function (id) {
            var section = angular.element(document.getElementById('section' + id));
            var container = angular.element(document.getElementById('dishes-container'));
            container.scrollTo(section, 0, 1000);
            this.$scope.$broadcast('bd.toSection', { id: id });
        };
        BodyCtrl.prototype.toTop = function () {
            var container = angular.element(document.getElementById('dishes-container'));
            container.scrollTop(0, 2000);
        };
        BodyCtrl.prototype.toggleCB = function (category) {
            var idx = this.selected.indexOf(category);
            if (idx > -1)
                this.selected.splice(idx, 1);
            else
                this.selected.push(category);
            this.$scope.$broadcast('body.selected', { selected: this.selected });
        };
        ;
        BodyCtrl.prototype.exists = function (item) {
            return this.selected.indexOf(item) > -1;
        };
        ;
        BodyCtrl.prototype.isIndeterminate = function () {
            return (this.selected.length !== 0 && this.selected.length !== this.categories.length);
        };
        ;
        BodyCtrl.prototype.isChecked = function () {
            return this.selected.length === this.categories.length;
        };
        ;
        BodyCtrl.prototype.toggleAll = function () {
            if (this.selected.length === this.categories.length)
                this.selected = [];
            else
                this.selected = this.categories.slice(0);
            this.$scope.$broadcast('body.selected', { selected: this.selected });
        };
        ;
        BodyCtrl.$inject = [
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
        return BodyCtrl;
    }());
    angular
        .module('ZoEazySPA')
        .controller('BodyCtrl', BodyCtrl);
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=BodyCtrl.js.map