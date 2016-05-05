var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    var Cash = (function () {
        function Cash(pay) {
            if (pay === void 0) { pay = new ZoEazySPA.Money(); }
            this.pay = pay;
        }
        return Cash;
    }());
    ZoEazySPA.Cash = Cash;
    var CreditCardBrand = (function () {
        function CreditCardBrand(id, name, mnemonic, pattern, eagerPattern, groupPattern, cvcLength) {
            this.id = id;
            this.name = name;
            this.mnemonic = mnemonic;
            this.pattern = pattern;
            this.eagerPattern = eagerPattern;
            this.groupPattern = groupPattern;
            this.cvcLength = cvcLength;
            //this.rxPattern = new RegExp(this.pattern);
            //this.rxEagerPattern = new RegExp(this.eagerPattern);
        }
        return CreditCardBrand;
    }());
    ZoEazySPA.CreditCardBrand = CreditCardBrand;
    var CCNumber = (function () {
        function CCNumber(str) {
            if (str === void 0) { str = undefined; }
            this.str = str;
        }
        CCNumber.prototype.parse = function (val) {
            if (val === void 0) { val = this.str; }
            return +val.replace(new RegExp(CCNumber.regex), '');
        };
        CCNumber.prototype.luhn = function (val) {
            if (val === void 0) { val = this.str; }
            if (!val)
                return false;
            var len = val.length, mul = 0, sum = 0;
            while (len--) {
                sum += CCNumber.prodArr[mul][parseInt(val.charAt(len), 10)];
                mul ^= 1;
            }
            return sum % 10 === 0 && sum > 0;
        };
        CCNumber.prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]];
        CCNumber.regex = "/[^\d]/g";
        return CCNumber;
    }());
    ZoEazySPA.CCNumber = CCNumber;
    var CCV = (function () {
        function CCV(str) {
            this.str = str;
        }
        return CCV;
    }());
    var CreditCard = (function () {
        function CreditCard(cardName, postalCode, ccBrand, ccv, validThru, ccNumber) {
            this.initBrands();
            this.getCardName(cardName);
            this.getPostalCode(postalCode);
            this.getCcv(ccv);
            this.getValidThru(validThru);
            this.getCcNumber(ccNumber);
            this.getBrandInit(ccBrand);
        }
        Object.defineProperty(CreditCard.prototype, "name", {
            get: function () {
                return this.cardName.name;
            },
            set: function (val) {
                this.cardName.name = val;
                this.cardName.inherits = false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditCard.prototype, "cardCode", {
            get: function () {
                return this.postalCode.number;
            },
            set: function (val) {
                this.postalCode.number = val;
                this.postalCode.inherits = false;
            },
            enumerable: true,
            configurable: true
        });
        CreditCard.prototype.getFromPosition = function (val) {
            if (this.postalCode.inherits) {
                this.postalCode.number = val;
            }
        };
        CreditCard.prototype.initBrands = function () {
            if (CreditCard.brands !== undefined)
                return;
            CreditCard.brands = Array();
            var sBrands = new ZoEazySPA.DataFactory().brands;
            for (var iBrand = 0; iBrand < sBrands.length; iBrand++) {
                var sBrand = sBrands[iBrand];
                var brnd = new CreditCardBrand(sBrand.id, sBrand.name, sBrand.mnemonic, sBrand.pattern, sBrand.eagerPattern, sBrand.groupPattern, sBrand.cvcLength);
                CreditCard.brands.push(brnd);
            }
        };
        CreditCard.prototype.getBrandInit = function (ccBrand) {
            if (ccBrand && ccBrand.id !== 0) {
                this.ccBrand = getBrand(ccBrand.id);
            }
            function getBrand(id) {
                var brand;
                for (var iBrand = 0; iBrand < CreditCard.brands.length; iBrand++) {
                    var brand = CreditCard.brands[iBrand];
                    if (id === brand.id)
                        break;
                }
                return brand;
            }
        };
        CreditCard.prototype.getBrand = function (candidate) {
            var filtrd = candidate.replace(/-/g, '');
            var header = (new RegExp(CreditCard.numRegex)).test(filtrd)
                ? filtrd.substr(0, (new RegExp(CreditCard.numRegex)).exec(filtrd).index)
                : filtrd;
            this.ccNumber.str = header;
            if (this.ccBrand && this.ccBrand.id > 0 && (new RegExp(this.ccBrand.eagerPattern)).test(header))
                return;
            for (var iBrand = 0; iBrand < CreditCard.brands.length; iBrand++) {
                var brand = CreditCard.brands[iBrand];
                if ((new RegExp(brand.eagerPattern)).test(header)) {
                    this.ccBrand = brand;
                    break;
                }
            }
        };
        CreditCard.prototype.getCardName = function (cardName) {
            this.cardName = new ZoEazySPA.UserName((cardName ? cardName.name : undefined), (cardName ? cardName.inherits : undefined));
        };
        CreditCard.prototype.getCcNumber = function (ccNumber) {
            this.ccNumber = new CCNumber((ccNumber ? ccNumber.str : undefined));
        };
        CreditCard.prototype.getCcv = function (ccv) {
            this.ccv = new CCV((ccv ? ccv.str : undefined));
        };
        CreditCard.prototype.getPostalCode = function (postalCode) {
            this.postalCode = new ZoEazySPA.PostalCode((postalCode ? postalCode.number : undefined), (postalCode ? postalCode.inherits : undefined));
        };
        CreditCard.prototype.getValidThru = function (validThru) {
            this.validThru = new ZoEazySPA.YearMonth((validThru ? validThru.year : undefined), (validThru ? validThru.month : undefined));
        };
        CreditCard.prototype.nameChanged = function (val) {
            if (this.cardName.inherits) {
                this.cardName.name = val;
            }
        };
        CreditCard.prototype.valid = function (val) {
            if (!this.ccBrand)
                return;
            var num = val.trim();
            var valid = this.ccNumber.luhn(num) && (new RegExp(this.ccBrand.pattern)).test(num);
            this.ccNumber.err = (valid) ? '' : 'Invalid CC Number';
            return valid;
        };
        CreditCard.prototype.validCcv = function (val) {
            if (!this.ccBrand)
                return;
            var valid = (val.length && RegExp('^\\d{' + this.ccBrand.cvcLength + '}$').test(val));
            this.ccv.err = (valid) ? '' : 'Should be ' + this.ccBrand.cvcLength + ' digits long';
            return valid;
        };
        CreditCard.numRegex = "/[ -]/";
        return CreditCard;
    }());
    ZoEazySPA.CreditCard = CreditCard;
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=Payment.js.map