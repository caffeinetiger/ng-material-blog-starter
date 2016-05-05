var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ZoEazySPA;
(function (ZoEazySPA) {
    var Timestamp = (function () {
        function Timestamp(timeStamp) {
            this.timeStamp = timeStamp;
            if (!this.timeStamp)
                this.timeStamp = moment().unix();
        }
        Timestamp.prototype.stamp = function (val) {
            if (val === void 0) { val = moment(); }
            this.timeStamp = val.unix();
        };
        Timestamp.prototype.toDate = function () {
            return moment.unix(this.timeStamp);
        };
        Timestamp.prototype.toDateStr = function () {
            return moment.unix(this.timeStamp).format('LL');
        };
        return Timestamp;
    }());
    ZoEazySPA.Timestamp = Timestamp;
    var UserName = (function () {
        function UserName(name, inherits) {
            if (inherits === void 0) { inherits = true; }
            this.name = name;
            this.inherits = inherits;
        }
        return UserName;
    }());
    ZoEazySPA.UserName = UserName;
    var PostalCode = (function () {
        function PostalCode(number, inherits) {
            if (inherits === void 0) { inherits = true; }
            this.number = number;
            this.inherits = inherits;
        }
        PostalCode.prototype.valid = function (str) {
            var valid = (str.length && str.length === PostalCode.len);
            this.err = (valid) ? '' : 'Should be ' + PostalCode.len + 'digits long';
            return valid;
        };
        PostalCode.len = 5;
        return PostalCode;
    }());
    ZoEazySPA.PostalCode = PostalCode;
    var Order = (function () {
        function Order(kind, paymethod, userName, position, phone, card, cash, items, raised) {
            if (kind === void 0) { kind = ZoEazySPA.Kind.DELIVERY; }
            if (paymethod === void 0) { paymethod = ZoEazySPA.PayMethod.CREDIT; }
            this.kind = kind;
            this.paymethod = paymethod;
            this.getUserName(userName);
            this.getPhone(phone);
            this.getCash(cash);
            this.getPosition(position);
            this.getCard(card);
            this.getItems(items);
            this.getRaised(raised);
            this.calculate();
        }
        Object.defineProperty(Order.prototype, "name", {
            get: function () {
                return this.userName.name;
            },
            set: function (val) {
                this.userName.name = val;
                this.userName.inherits = false;
                this.card.nameChanged(this.userName.name);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Order.prototype, "payMethod", {
            get: function () { return this.paymethod; },
            set: function (payMethod) {
                this.paymethod = payMethod;
                this.calculate();
            },
            enumerable: true,
            configurable: true
        });
        Order.prototype.add = function (item) {
            this.items.push(item);
            this.calculate();
        };
        Order.prototype.calculate = function () {
            this.total = new ZoEazySPA.Total();
            this.total.subtotal = new ZoEazySPA.Subtotal(this.items);
            this.total.deliveryFee = new ZoEazySPA.DeliveryFee(this.total.subtotal, this.kind);
            this.total.tax = new ZoEazySPA.Tax(this.total.subtotal, this.total.deliveryFee);
            this.total.tip = new ZoEazySPA.Tip(this.total.subtotal, this.total.deliveryFee, this.total.tax, (this.kind * this.payMethod));
            this.total.set();
        };
        Order.prototype.getCard = function (card) {
            if (card) {
                this.card = new ZoEazySPA.CreditCard(new UserName(card.cardName.name, card.cardName.inherits), new PostalCode(card.postalCode.number, card.postalCode.inherits), card.ccBrand, card.ccv, new ZoEazySPA.YearMonth(card.validThru.year, card.validThru.month), card.ccNumber);
            }
            else {
                this.card = new ZoEazySPA.CreditCard();
            }
        };
        Order.prototype.getCash = function (cash) {
            this.cash = new ZoEazySPA.Cash((cash ? cash.pay : undefined));
        };
        Order.prototype.getItems = function (items) {
            this.items = new Array();
            if (items) {
                for (var iItem = 0; iItem < items.length; iItem++) {
                    var item = items[iItem];
                    this.items.push(new Item(item.menu, item.menuItem, item.priceField, item.quantity, item.instructions, item.prices, item.cost));
                }
            }
        };
        Order.prototype.getPhone = function (phone) {
            this.phone = new ZoEazySPA.Phone((phone ? phone.str : undefined));
        };
        Order.prototype.getPosition = function (position) {
            this.userPosition = (position)
                ? new ZoEazySPA.Position(position.longitude, position.latitude, position.accepted, position.defined, position.address, position.postalCode, position.status)
                : new ZoEazySPA.Position();
        };
        Order.prototype.getRaised = function (raised) {
            if (raised) {
                this.raised = new Timestamp(raised.timeStamp);
            }
        };
        Order.prototype.getUserName = function (userName) {
            this.userName = new UserName((userName ? userName.name : undefined), (userName ? userName.inherits : undefined));
        };
        Order.prototype.isCash = function () {
            return this.payMethod === ZoEazySPA.PayMethod.CASH;
        };
        Order.prototype.isCredit = function () {
            return this.payMethod === ZoEazySPA.PayMethod.CREDIT;
        };
        Order.prototype.nameChanged = function (val) {
            if (this.userName.inherits) {
                this.userName.name = val;
                if (this.card)
                    this.card.nameChanged(this.userName.name);
            }
        };
        Order.prototype.raise = function () {
            this.raised = new Timestamp();
        };
        return Order;
    }());
    ZoEazySPA.Order = Order;
    var Price = (function (_super) {
        __extends(Price, _super);
        function Price(amount, label) {
            _super.call(this, amount);
            this.amount = amount;
            this.label = label;
        }
        return Price;
    }(ZoEazySPA.Money));
    ZoEazySPA.Price = Price;
    var Item = (function () {
        function Item(menu, //to avoid error in the hash
            menuItem, priceField, quantity, instructions, prices, cost) {
            if (quantity === void 0) { quantity = 1; }
            if (instructions === void 0) { instructions = ''; }
            if (prices === void 0) { prices = []; }
            if (cost === void 0) { cost = undefined; }
            this.menu = menu;
            this.menuItem = menuItem;
            this.priceField = priceField;
            this.quantity = quantity;
            this.instructions = instructions;
            this.prices = prices;
            this.cost = cost;
            this.menu = menu;
            this.menuItem = menuItem;
            if (this.prices.length === 0)
                this.prices = this.getPrices(menu, menuItem);
            else {
                var savedPrices = angular.copy(this.prices);
                this.prices = [];
                for (var iPrice = 0; iPrice < prices.length; iPrice++) {
                    var price = prices[iPrice];
                    this.prices.push(new Price(price.amount, price.label));
                }
            }
            if (cost) {
                this.cost = new Cost(this.cost.amount, this.cost.quantity, this.cost.label);
            }
        }
        Item.prototype.getPrices = function (menu, item) {
            var prices = [], fieldExist = true, field = 0;
            while (fieldExist) {
                var lbl = field + 1;
                fieldExist = eval('item.price' + lbl + '.amount > 0');
                if (fieldExist) {
                    var label = eval('item.presentation' + lbl + ' || menu.presentation' + lbl);
                    var amount = eval('item.price' + lbl + '.amount');
                    prices.push(new Price(amount, label));
                }
                field += 1;
            }
            return prices;
        };
        Item.$inject = ['menu', 'item', 'priceField'];
        return Item;
    }());
    ZoEazySPA.Item = Item;
    var Cost = (function (_super) {
        __extends(Cost, _super);
        function Cost(amount, quantity, label) {
            _super.call(this, amount, label);
            this.amount = amount;
            this.quantity = quantity;
            this.label = label;
            this.cost = this.amount * this.quantity;
        }
        Cost.prototype.newPrice = function (amount, label) {
            this.amount = amount;
            this.label = label;
            this.cost = this.amount * this.quantity;
        };
        Cost.prototype.newQuantity = function (quantity) {
            this.quantity = quantity;
            this.cost = this.amount * this.quantity;
        };
        Cost.prototype.adjustQuantity = function (adjust) {
            this.quantity += adjust;
            this.cost = this.amount * this.quantity;
        };
        return Cost;
    }(Price));
    ZoEazySPA.Cost = Cost;
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=Order.js.map