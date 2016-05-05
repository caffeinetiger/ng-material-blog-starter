var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    var Phone = (function () {
        function Phone(str) {
            if (str === void 0) { str = ''; }
            this.str = str;
            this.str = this.str.replace('(', '').replace(')', '').replace(/-/g, '').replace(' ', '');
            if (!this.valid())
                throw "Invalid number: " + this.err;
            this.parse();
        }
        Phone.prototype.valid = function (val) {
            if (val === void 0) { val = this.str; }
            if (val === '')
                return true;
            if (!(val[0] !== "1" || val[0] !== "0")) {
                this.err = "Invalid First Digit, 0 or 1";
                return false;
            }
            if ((val.length < 10 || val.length > 14)) {
                this.err = "Invalid length, should be 10 or with extension up to 14";
                return false;
            }
            if (!Phone.regex.test(val)) {
                this.err = "Invalid Number";
                return false;
            }
            return true;
        };
        Phone.prototype.parse = function (val) {
            if (val === void 0) { val = this.str; }
            if (val === '') {
                this.areaCode = this.areaGroup = this.areaNumber = this.extension = '';
            }
            else {
                this.areaCode = val.slice(0, 3);
                this.areaGroup = val.slice(3, 6);
                this.areaNumber = val.slice(6, 10);
                this.extension = (val.length > 10) ? val.slice(11) : '';
            }
        };
        Phone.regex = /^([0-9](|-)?)?(\(?[0-9]{3}\)?|[0-9]{3})(|-)?([0-9]{3}(|-)?[0-9]{4}|[a-zA-Z0-9]{7})$/;
        return Phone;
    }());
    ZoEazySPA.Phone = Phone;
    var User = (function () {
        function User(email, userName, isLoged, phone, position, orders, order, cards) {
            if (isLoged === void 0) { isLoged = false; }
            this.email = email;
            this.userName = userName;
            this.isLoged = isLoged;
            this.getPhone(phone);
            this.getUserPosition(position);
            this.getOldOrders(orders);
            this.getCards(cards);
            this.getNewOrder(order);
            this.getShort();
        }
        Object.defineProperty(User.prototype, "name", {
            get: function () {
                return this.userName;
            },
            set: function (val) {
                this.userName = val;
                if (this.order)
                    this.order.nameChanged(this.userName);
            },
            enumerable: true,
            configurable: true
        });
        User.prototype.getShort = function () {
            if (!this.userName)
                return;
            var len = 7;
            var index = this.userName.indexOf(' ');
            var first = (index > 0) ? this.userName.substr(0, index) : this.userName;
            var second = (first.length > len) ? first.substr(0, len) : first;
            this.short = (index > 0) ? second.substr(0, second.length) : (first.length <= len) ? second : second + '...';
        };
        Object.defineProperty(User.prototype, "systemPosition", {
            get: function () {
                return this._systemPosition;
            },
            set: function (position) {
                this._systemPosition = position;
                if (!this.userPosition || !this.userPosition.address) {
                    this.userPosition = angular.copy(this._systemPosition);
                    this.userPosition.needsConfirmation = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        User.prototype.addToOrder = function (item) {
            if (this.order === null)
                throw "Order do not exist...";
            this.order.add(item);
        };
        User.prototype.aggregate = function (order) {
            this.order = undefined;
            this.orders.splice(0, 0, order);
        };
        User.prototype.createOrder = function () {
            this.order = new ZoEazySPA.Order(ZoEazySPA.Kind.DELIVERY, ZoEazySPA.PayMethod.CREDIT, new ZoEazySPA.UserName(this.userName), this.userPosition, this.phone, this.cards[0]);
        };
        User.prototype.getCards = function (cards) {
            this.cards = Array();
            if (cards) {
                for (var iCard = 0; iCard < cards.length; iCard++) {
                    var card = cards[iCard];
                    this.cards.push(new ZoEazySPA.CreditCard(card.cardName, card.postalCode, card.ccBrand, card.ccv, card.validThru, card.ccNumber));
                }
            }
            this.cards.push(new ZoEazySPA.CreditCard(new ZoEazySPA.UserName(this.userName), new ZoEazySPA.PostalCode(this.userPosition.postalCode)));
        };
        User.prototype.getCash = function (cash) {
            return (cash)
                ? new ZoEazySPA.Cash(new ZoEazySPA.Money(this.cash.pay.amount))
                : new ZoEazySPA.Cash(new ZoEazySPA.Money());
        };
        User.prototype.getNewOrder = function (order) {
            if (order) {
                this.order = new ZoEazySPA.Order(order.kind, order.payMethod, order.userName, order.userPosition, order.phone, order.card, order.cash, order.items);
            }
            else {
                this.createOrder();
            }
        };
        User.prototype.getOldOrders = function (orders) {
            this.orders = Array();
            if (orders) {
                for (var iOrder = 0; iOrder < orders.length; iOrder++) {
                    var order = orders[iOrder];
                    this.orders.push(new ZoEazySPA.Order(order.kind, order.paymethod, order.userName, order.userPosition, order.phone, order.card, order.cash, order.items, order.raised));
                }
            }
        };
        User.prototype.getPhone = function (phone) {
            this.phone = new Phone((phone ? phone.str : undefined));
        };
        User.prototype.getUserPosition = function (position) {
            this.userPosition = (position)
                ? new ZoEazySPA.Position(position.longitude, position.latitude, position.accepted, position.defined, position.address, position.postalCode, position.status)
                : new ZoEazySPA.Position();
        };
        User.prototype.copyPositions = function () {
            this.order.userPosition = angular.copy(this.userPosition);
            this.order.systemPosition = angular.copy(this.systemPosition);
        };
        return User;
    }());
    ZoEazySPA.User = User;
    ;
    var UserLog = (function () {
        function UserLog(email, password, rememberMe) {
            this.email = email;
            this.password = password;
            this.rememberMe = rememberMe;
        }
        return UserLog;
    }());
    ZoEazySPA.UserLog = UserLog;
    ;
    var UserReg = (function () {
        function UserReg(email, userName, phone, password, reenterPassword, rememberMe, position) {
            this.email = email;
            this.userName = userName;
            this.phone = phone;
            this.password = password;
            this.reenterPassword = reenterPassword;
            this.rememberMe = rememberMe;
            this.position = position;
        }
        return UserReg;
    }());
    ZoEazySPA.UserReg = UserReg;
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=User.js.map