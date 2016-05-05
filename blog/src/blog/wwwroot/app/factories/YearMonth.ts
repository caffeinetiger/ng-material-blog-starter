module ZoEazySPA {
    export interface IYearMonth {
        month: string;
        year: string;
    }

    export class YearMonth implements IYearMonth {
        _str: string = '';
        err: string = '';

        constructor(public year?: string, public month?: string) {
            if (!year && !month) return undefined;

            this.str = month + year;

            if (!this.valid()) throw this.err;
        }

        isPastYear(): boolean {
            return moment().year() < Number(this.year);
        }

        get str(): string {
            return this._str;
        }

        set str(str: string) {
            this._str = str;
        }

        isValidMonth(): boolean {
            return Number(this.month) >= 1 && Number(this.month) <= 12;
        }

        isValidYear(): boolean {
            return Number(this.year) >= moment().year();
        }

        parseMonth(): string {
            if (!this.month) return '';
            return this.month.toString().length === 2 ? this.month.toString() : '0' + this.month;

        }

        parseString(val: string) {
            var month = Number(val.slice(0, 2)), year = Number(val.slice(2));

            if (month > 0 && month < 13 && year < 50) //mm/yy case
                year += 2000;

            this.month = (month === 0) ? '' : ('0' + month).toString().substr(-2);

            this.year = (year === 0) ? '' : year.toString();

            this._str = this.month + this.year;
        }

        parseYear(): string {
            if (!this.year) return '';
            return this.year.toString();
        }

        valid(): boolean;
        valid(val: string = this._str): boolean {
            if (typeof val == "string")
                this.parseString(val);


            if (!this.year && !this.month) return true;

            if (!moment({ y: this.year, M: Number(this.month) - 1, d: 1 }).isValid()) {
                this.err = "Invalid Date"
                return false;
            }

            if (this.year.toString().length < 4) {
                this.err = "Invalid Year"
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
        }
    }
}