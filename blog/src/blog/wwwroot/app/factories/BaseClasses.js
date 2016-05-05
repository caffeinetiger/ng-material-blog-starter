var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ZoEazySPA;
(function (ZoEazySPA) {
    (function (Kind) {
        Kind[Kind["PICKUP"] = 0] = "PICKUP";
        Kind[Kind["DELIVERY"] = 1] = "DELIVERY";
    })(ZoEazySPA.Kind || (ZoEazySPA.Kind = {}));
    var Kind = ZoEazySPA.Kind;
    (function (PayMethod) {
        PayMethod[PayMethod["CASH"] = 0] = "CASH";
        PayMethod[PayMethod["CREDIT"] = 1] = "CREDIT";
    })(ZoEazySPA.PayMethod || (ZoEazySPA.PayMethod = {}));
    var PayMethod = ZoEazySPA.PayMethod;
    (function (AddressLabels) {
        AddressLabels[AddressLabels['Address'] = 0] = 'Address';
        AddressLabels[AddressLabels['Incomplete Address'] = 1] = 'Incomplete Address';
        AddressLabels[AddressLabels['Temporal Address'] = 2] = 'Temporal Address';
    })(ZoEazySPA.AddressLabels || (ZoEazySPA.AddressLabels = {}));
    var AddressLabels = ZoEazySPA.AddressLabels;
    (function (AddressColors) {
        AddressColors[AddressColors['black'] = 0] = 'black';
        AddressColors[AddressColors['amber'] = 1] = 'amber';
        AddressColors[AddressColors['red'] = 2] = 'red';
    })(ZoEazySPA.AddressColors || (ZoEazySPA.AddressColors = {}));
    var AddressColors = ZoEazySPA.AddressColors;
    ;
    var Percentage = (function () {
        function Percentage(newRate) {
            if (newRate === void 0) { newRate = 0; }
            this._rate = 0;
            this._rate = newRate;
        }
        Object.defineProperty(Percentage.prototype, "rate", {
            get: function () {
                return this._rate;
            },
            set: function (newRate) {
                this._rate = newRate;
            },
            enumerable: true,
            configurable: true
        });
        Percentage.prototype.applyRate = function () {
            return this._rate / 100;
        };
        Percentage.prototype.getRateStr = function () {
            return this._rate + Percentage.symbol;
        };
        Percentage.symbol = "%";
        return Percentage;
    }());
    ZoEazySPA.Percentage = Percentage;
    var TaxPercentage = (function (_super) {
        __extends(TaxPercentage, _super);
        function TaxPercentage() {
            _super.call(this, 8.5);
        }
        return TaxPercentage;
    }(Percentage));
    ZoEazySPA.TaxPercentage = TaxPercentage;
    var TipPercentage = (function (_super) {
        __extends(TipPercentage, _super);
        function TipPercentage() {
            _super.call(this, TipPercentage._rate);
        }
        TipPercentage.prototype.setRate = function (newRate) {
            TipPercentage._rate = newRate;
        };
        TipPercentage._rate = 15;
        return TipPercentage;
    }(Percentage));
    ZoEazySPA.TipPercentage = TipPercentage;
    var DeliveryFeePercentage = (function (_super) {
        __extends(DeliveryFeePercentage, _super);
        function DeliveryFeePercentage() {
            _super.call(this);
        }
        return DeliveryFeePercentage;
    }(Percentage));
    ZoEazySPA.DeliveryFeePercentage = DeliveryFeePercentage;
    var Money = (function () {
        function Money(amount) {
            if (amount === void 0) { amount = 0; }
            this.amount = amount;
            if (Money.currency === undefined)
                Money.currency = new ZoEazySPA.DataFactory().currency;
        }
        return Money;
    }());
    ZoEazySPA.Money = Money;
    var Tax = (function (_super) {
        __extends(Tax, _super);
        function Tax(purchase, fee) {
            _super.call(this, 0);
            this.purchase = purchase;
            this.fee = fee;
            this.percentage = new TaxPercentage();
            this.amount = (purchase.amount + fee.amount) * this.percentage.applyRate();
        }
        return Tax;
    }(Money));
    ZoEazySPA.Tax = Tax;
    var Tip = (function (_super) {
        __extends(Tip, _super);
        function Tip(purchase, deliveryFee, tax, kind, tip) {
            if (tip === void 0) { tip = undefined; }
            _super.call(this, 0);
            this.purchase = purchase;
            this.deliveryFee = deliveryFee;
            this.tax = tax;
            this.percentage = new TipPercentage();
            this.amount = (purchase.amount + deliveryFee.amount + tax.amount) * this.percentage.applyRate() * kind;
        }
        return Tip;
    }(Money));
    ZoEazySPA.Tip = Tip;
    var DeliveryFee = (function (_super) {
        __extends(DeliveryFee, _super);
        function DeliveryFee(purchase, kind) {
            _super.call(this, 0);
            this.purchase = purchase;
            this.percentage = new DeliveryFeePercentage();
            this.amount = (purchase.amount * this.percentage.applyRate()) + DeliveryFee.fixed * kind;
        }
        DeliveryFee.fixed = 3;
        return DeliveryFee;
    }(Money));
    ZoEazySPA.DeliveryFee = DeliveryFee;
    var Subtotal = (function (_super) {
        __extends(Subtotal, _super);
        function Subtotal(items) {
            _super.call(this, 0);
            var amount = 0;
            for (var iItem = 0; iItem < items.length; iItem++) {
                amount += items[iItem].cost.cost;
            }
            this.amount = amount;
        }
        return Subtotal;
    }(Money));
    ZoEazySPA.Subtotal = Subtotal;
    var Total = (function (_super) {
        __extends(Total, _super);
        function Total() {
            _super.call(this, 0);
        }
        Total.prototype.set = function () {
            this.amount = this.subtotal.amount + this.deliveryFee.amount + this.tax.amount + this.tip.amount;
        };
        return Total;
    }(Money));
    ZoEazySPA.Total = Total;
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=BaseClasses.js.map