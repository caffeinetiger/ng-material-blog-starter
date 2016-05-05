module ZoEazySPA {
    export enum Kind {
        PICKUP,
        DELIVERY
    }

    export enum PayMethod {
        CASH, CREDIT   
    }

    export enum AddressLabels {'Address', 'Incomplete Address', 'Temporal Address'}
    export enum AddressColors {'black', 'amber', 'red'};
    export class Percentage {
        private _rate: number = 0;
        static symbol: string = "%";

        constructor(newRate: number = 0) {
            this._rate = newRate;
        }

        get rate(): number {
            return this._rate;
        }

        set rate(newRate: number) {
            this._rate = newRate;
        }

        applyRate(): number {
            return this._rate / 100;
        }

        getRateStr(): string {
            return this._rate + Percentage.symbol;
        }
    }

    export class TaxPercentage extends Percentage {
        constructor() {
            super(8.5);
        }
    }

    export class TipPercentage extends Percentage {
        static _rate: number = 15;
        constructor() {
            super(TipPercentage._rate);
        }

        setRate(newRate: number) {
            TipPercentage._rate = newRate;
        }
    }

    export class DeliveryFeePercentage extends Percentage {
        constructor() {
            super();
        }
    }

    export interface IMoney {
        amount: number;
    }

    export class Money implements IMoney {
        static currency: server.Currency;

        constructor(public amount: number = 0) {
            if(Money.currency === undefined) Money.currency = new DataFactory().currency;
        }
    }

    export class Tax extends Money {
        private percentage: TaxPercentage;

        constructor(public purchase: Money, public fee: Money) {
            super(0);
            this.percentage = new TaxPercentage();
            this.amount = (purchase.amount + fee.amount) * this.percentage.applyRate();
        }
    }

    export class Tip extends Money {
        public percentage: TipPercentage;
        
        constructor(public purchase: Money, public deliveryFee: Money, public tax: Tax, kind: Kind, tip: Tip = undefined) {
            super(0);
            this.percentage = new TipPercentage();
            this.amount = (purchase.amount + deliveryFee.amount + tax.amount) * this.percentage.applyRate() * kind;
        }
    }

    export class DeliveryFee extends Money {
        private percentage: DeliveryFeePercentage;
        static fixed: number = 3;
        constructor(public purchase: Money, kind: Kind) {
            super(0);
            this.percentage = new DeliveryFeePercentage();
            this.amount = (purchase.amount * this.percentage.applyRate()) + DeliveryFee.fixed * kind;
        }
    }

    export class Subtotal extends Money {

        constructor(items: Array<Item>) {
            super(0);

            var amount = 0;
            for (var iItem = 0; iItem < items.length; iItem++) {
                amount += items[iItem].cost.cost;
            }
            this.amount = amount;
        }


    }

    export interface ITotal {
        subtotal: Subtotal;
        deliveryFee: DeliveryFee;
        tax: Tax;
        tip: Tip;
    }

    export class Total extends Money implements ITotal {
        subtotal: Subtotal;
        deliveryFee: DeliveryFee;
        tax: Tax;
        tip: Tip;

        constructor() {
            super(0);
        }

        set(): void {
            this.amount = this.subtotal.amount + this.deliveryFee.amount + this.tax.amount + this.tip.amount;
        }
    }
}