var ZoEazySPA;
(function (ZoEazySPA) {
    var YearMonth = (function () {
        function YearMonth(year, month) {
            this.year = year;
            this.month = month;
            this._str = '';
            this.err = '';
            if (!year && !month)
                return undefined;
            this.str = month + year;
            if (!this.valid())
                throw this.err;
        }
        YearMonth.prototype.isPastYear = function () {
            return moment().year() < Number(this.year);
        };
        Object.defineProperty(YearMonth.prototype, "str", {
            get: function () {
                return this._str;
            },
            set: function (str) {
                this._str = str;
            },
            enumerable: true,
            configurable: true
        });
        YearMonth.prototype.isValidMonth = function () {
            return Number(this.month) >= 1 && Number(this.month) <= 12;
        };
        YearMonth.prototype.isValidYear = function () {
            return Number(this.year) >= moment().year();
        };
        YearMonth.prototype.parseMonth = function () {
            if (!this.month)
                return '';
            return this.month.toString().length === 2 ? this.month.toString() : '0' + this.month;
        };
        YearMonth.prototype.parseString = function (val) {
            var month = Number(val.slice(0, 2)), year = Number(val.slice(2));
            if (month > 0 && month < 13 && year < 50)
                year += 2000;
            this.month = (month === 0) ? '' : ('0' + month).toString().substr(-2);
            this.year = (year === 0) ? '' : year.toString();
            this._str = this.month + this.year;
        };
        YearMonth.prototype.parseYear = function () {
            if (!this.year)
                return '';
            return this.year.toString();
        };
        YearMonth.prototype.valid = function (val) {
            if (val === void 0) { val = this._str; }
            if (typeof val == "string")
                this.parseString(val);
            if (!this.year && !this.month)
                return true;
            if (!moment({ y: this.year, M: Number(this.month) - 1, d: 1 }).isValid()) {
                this.err = "Invalid Date";
                return false;
            }
            if (this.year.toString().length < 4) {
                this.err = "Invalid Year";
                return false;
            }
            if (moment({ y: this.year, M: Number(this.month) - 1, d: 1 }).endOf('month').isBefore()) {
                this.err = "Invalid Date is past";
                return false;
            }
            if (moment({ y: this.year, M: Number(this.month) - 1, d: 1 }).isAfter([(moment().year() + 10)])) {
                this.err = "Invalid Far future (more than 10 years)";
                return false;
            }
            this.err = '';
            return true;
        };
        return YearMonth;
    }());
    ZoEazySPA.YearMonth = YearMonth;
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=YearMonth.js.map