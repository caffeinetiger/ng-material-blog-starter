module ZoEazySPA {
    'use strict'

    interface IPayCash {
        pay: Money;
    }

    interface IPayCredit {
        pay: Money;
        ccard: CreditCard;
    }

    export class Cash implements IPayCash {
        constructor(public pay: Money = new Money()) {
        }
    }

    interface ICreditCardBrand extends server.CreditCardBrand {
        id: number;
        name: string;
        mnemonic: string;
        pattern: string;
        eagerPattern: string;
        groupPattern: string;
        cvcLength: number;
    }

    export class CreditCardBrand implements ICreditCardBrand {
        constructor(
            public id: number,
            public name: string,
            public mnemonic: string,
            public pattern: string,
            public eagerPattern: string,
            public groupPattern: string,
            public cvcLength: number

        ) {
            //this.rxPattern = new RegExp(this.pattern);
            //this.rxEagerPattern = new RegExp(this.eagerPattern);
        }
    }

    interface ICCNumber {

        str: string;
        //pattern: RegExp;
        parse(str: string): number;

        luhn(val: string): boolean;

    }

    export class CCNumber implements ICCNumber {
        static prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]];
        static regex: string = "/[^\d]/g";

        public err: string;

        constructor(
            public str: string = undefined
            //,
           // public pattern: string = undefined
        ) {
        }

        parse(val: string = this.str): number {
            return +val.replace(new RegExp(CCNumber.regex), '');
        }

        luhn(val: string = this.str): boolean {
            if (!val) return false;

            var len = val.length, mul = 0, sum = 0;

            while (len--) {
                sum += CCNumber.prodArr[mul][parseInt(val.charAt(len), 10)];
                mul ^= 1;
            }

            return sum % 10 === 0 && sum > 0;
        }
    }

    class CCV {
        public err: string;
        
        constructor(
            public str?: string
        ) {
        }
    }

    interface ICreditCard {
        ccv: CCV;
        ccBrand: server.CreditCardBrand;
        ccNumber: CCNumber;
        name: string;
        cardCode: string;
        validThru: YearMonth;
        save: boolean;
        getBrandInit(ccBrand: CreditCardBrand): void;
        getBrand(candidate: string): void
        getFromPosition(val: string): void
        valid(val: string): boolean;
        validCcv(val: string):boolean;
    }

    export class CreditCard implements ICreditCard {
        static brands: Array<CreditCardBrand>;
        static numRegex: string = "/[ -]/";
        
        cardName: UserName;
        postalCode: PostalCode;
        public ccBrand: CreditCardBrand;
        public save: boolean;
        public ccv: CCV;
        public validThru: YearMonth;
        public ccNumber: CCNumber;

        constructor(
            cardName?: UserName,
            postalCode?: PostalCode,
            ccBrand?: CreditCardBrand,
            ccv?: CCV,
            validThru?: YearMonth,
            ccNumber?: CCNumber
        ) {

            this.initBrands();
            this.getCardName(cardName);
            this.getPostalCode(postalCode);

            this.getCcv(ccv);
            this.getValidThru(validThru);
            this.getCcNumber(ccNumber);

            this.getBrandInit(ccBrand);
        }

        get name(): string {
            return this.cardName.name;
        }

        set name(val: string) {
            this.cardName.name = val;
            this.cardName.inherits = false;
        }

        get cardCode(): string {
            return this.postalCode.number
        }

        set cardCode(val: string) {
            this.postalCode.number = val;
            this.postalCode.inherits = false;
        }

        getFromPosition(val: string) {
            if (this.postalCode.inherits) {
                this.postalCode.number = val;
            }
        }

        initBrands(): void {
            if (CreditCard.brands !== undefined) return;

            CreditCard.brands = Array<CreditCardBrand>();
            var sBrands = new DataFactory().brands;

            for (var iBrand = 0; iBrand < sBrands.length; iBrand++) {
                var sBrand = sBrands[iBrand];
                var brnd: CreditCardBrand =
                    new CreditCardBrand(sBrand.id, sBrand.name, sBrand.mnemonic, sBrand.pattern, sBrand.eagerPattern, sBrand.groupPattern, sBrand.cvcLength);
                CreditCard.brands.push(brnd);
            }

        }

        getBrandInit(ccBrand: CreditCardBrand): void {
            if (ccBrand && ccBrand.id !== 0) {
                this.ccBrand = getBrand(ccBrand.id);
            }

            function getBrand(id: number): CreditCardBrand {
                var brand: CreditCardBrand;

                for (var iBrand = 0; iBrand < CreditCard.brands.length; iBrand++) {
                    var brand = CreditCard.brands[iBrand];

                    if (id === brand.id)
                        break;
                }
                return brand;
            }
        }

        getBrand(candidate: string): void {
            var filtrd = candidate.replace(/-/g, '');
            var header = (new RegExp(CreditCard.numRegex)).test(filtrd)
                ? filtrd.substr(0, (new RegExp(CreditCard.numRegex)).exec(filtrd).index)
                : filtrd;
            this.ccNumber.str = header;

            if (this.ccBrand && this.ccBrand.id > 0 && (new RegExp(this.ccBrand.eagerPattern)).test(header)) return;

            for (var iBrand = 0; iBrand < CreditCard.brands.length; iBrand++) {
                var brand: CreditCardBrand = CreditCard.brands[iBrand];

                if ((new RegExp(brand.eagerPattern)).test(header)) {
                    this.ccBrand = brand;
                    break;
                }
            }

        }

        getCardName(cardName: UserName) {
            this.cardName = new UserName((cardName ? cardName.name : undefined), (cardName ? cardName.inherits : undefined));
        }

        getCcNumber(ccNumber: CCNumber): void {
            this.ccNumber = new CCNumber((ccNumber ? ccNumber.str : undefined));
        }

        getCcv(ccv: CCV): void {
            this.ccv = new CCV((ccv ? ccv.str : undefined));
        }

        getPostalCode(postalCode: PostalCode) {
            this.postalCode = new PostalCode((postalCode ? postalCode.number : undefined), (postalCode ? postalCode.inherits : undefined));
        }

        getValidThru(validThru: YearMonth): void {
            this.validThru = new YearMonth((validThru ? validThru.year : undefined), (validThru ? validThru.month : undefined));
        }

        nameChanged(val: string) {
            if (this.cardName.inherits) {
                this.cardName.name = val;
            }
        }

        valid(val: string): boolean {
            if (!this.ccBrand) return;
            var num = val.trim();
            var valid = this.ccNumber.luhn(num) &&  (new RegExp(this.ccBrand.pattern)).test(num);
            this.ccNumber.err = (valid) ? '' : 'Invalid CC Number';
            return valid;
        }

        validCcv(val: string): boolean {
            if (!this.ccBrand) return;
            var valid = (val.length && RegExp('^\\d{' + this.ccBrand.cvcLength + '}$').test(val));
            this.ccv.err = (valid) ? '' : 'Should be ' + this.ccBrand.cvcLength + ' digits long';
            return valid;
        }
    }
}
