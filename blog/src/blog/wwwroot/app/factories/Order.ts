module ZoEazySPA {

    export interface IUserName {
        name: string;
        inherits: boolean;
    }

    export interface ITimestamp {
        timeStamp: number;
        stamp(val: moment.Moment): void;
        toDate(): moment.Moment;
        toDateStr(): string;

    }

    export class Timestamp implements ITimestamp {
        constructor(
            public timeStamp?: number
        ) {
            if (!this.timeStamp)
                this.timeStamp = moment().unix();
        }

        stamp(val: moment.Moment = moment()): void {
            this.timeStamp = val.unix();
        }

        toDate(): moment.Moment {
            return moment.unix(this.timeStamp);
        }

        toDateStr(): string {
            return moment.unix(this.timeStamp).format('LL');
        }
    }


    export class UserName {
        constructor(public name?: string, public inherits: boolean = true) {

        }
    }
    export interface IPostalCode {
        number: string;
        inherits: boolean;
        valid(val: string): boolean;
    }

    export class PostalCode {
        static len = 5;
        public err: string;
        constructor(
            public number?: string,
            public inherits: boolean = true) {

        }

        valid(str: string) {
            var valid = (str.length && str.length === PostalCode.len);
            this.err = (valid) ? '' : 'Should be ' + PostalCode.len + 'digits long';
            return valid;
        }
    }

    export interface IOrder {
        id: string;
        userName: UserName;
        phone: Phone;
        items: Array<Item>;
        total: Total;
        card: CreditCard;
        cash: Cash;
        add(item: Item): void;
        calculate(): void;
        kind: Kind;
        payMethod: PayMethod;
        userPosition: Position;
        systemPosition: Position;
        isCredit(): boolean;
        isCash(): boolean;
        raised: Timestamp;
    }

    export class Order implements IOrder {
        id: string;
        userName: UserName;
        total: Total;
        items: Array<Item>;
        card: CreditCard;
        phone: Phone;
        userPosition: Position;
        systemPosition: Position;
        cash: Cash;
        raised: Timestamp;
        constructor(
            public kind: Kind = Kind.DELIVERY,
            public paymethod: PayMethod = PayMethod.CREDIT,
            userName?: UserName,
            position?: Position,
            phone?: Phone,
            card?: CreditCard,
            cash?: Cash,
            items?: Array<Item>,
            raised?: Timestamp
        ) {
            this.getUserName(userName);
            this.getPhone(phone);
            this.getCash(cash);
            this.getPosition(position);
            this.getCard(card);
            this.getItems(items);
            this.getRaised(raised);
            this.calculate();
        }

        get name(): string {
            return this.userName.name;
        }

        set name(val: string) {
            this.userName.name = val;
            this.userName.inherits = false;
            this.card.nameChanged(this.userName.name);
        }

        get payMethod(): PayMethod { return this.paymethod; }

        set payMethod(payMethod: PayMethod) {
            this.paymethod = payMethod;
            this.calculate();
        }

        add(item: Item): void {
            this.items.push(item);
            this.calculate();
        }

        calculate(): void {
            this.total = new Total();
            this.total.subtotal = new Subtotal(this.items);
            this.total.deliveryFee = new DeliveryFee(this.total.subtotal, this.kind);
            this.total.tax = new Tax(this.total.subtotal, this.total.deliveryFee);
            this.total.tip = new Tip(this.total.subtotal, this.total.deliveryFee, this.total.tax, (this.kind * this.payMethod));
            this.total.set();
        }

        getCard(card: CreditCard): void {
            if (card) {
                this.card = new CreditCard(new UserName(card.cardName.name, card.cardName.inherits), new PostalCode(card.postalCode.number, card.postalCode.inherits), card.ccBrand, card.ccv, new YearMonth(card.validThru.year, card.validThru.month), card.ccNumber);
            } else {
                this.card = new CreditCard();
            }
        }

        getCash(cash: Cash): void {
            this.cash = new Cash((cash ? cash.pay : undefined));
        }

        getItems(items: Array<Item>): void {
            this.items = new Array<Item>();
            if (items) {
                for (var iItem = 0; iItem < items.length; iItem++) {
                    var item = items[iItem];
                    this.items.push(new Item(item.menu, item.menuItem, item.priceField, item.quantity, item.instructions, item.prices, item.cost));
                }
            }
        }

        getPhone(phone: Phone): void {
            this.phone = new Phone((phone ? phone.str : undefined));
        }

        getPosition(position: Position): void {
            this.userPosition = (position)
                ? new Position(position.longitude, position.latitude, position.accepted, position.defined, position.address, position.postalCode, position.status)
                : new Position();
        }

        getRaised(raised: Timestamp) {
            if (raised) {
                this.raised = new Timestamp(raised.timeStamp);
            }
        }

        getUserName(userName: UserName): void {
            this.userName = new UserName((userName ? userName.name : undefined), (userName ? userName.inherits : undefined));
        }

        public isCash(): boolean {
            return this.payMethod === PayMethod.CASH;
        }
        public isCredit(): boolean {
            return this.payMethod === PayMethod.CREDIT;
        }

        nameChanged(val: string) {
            if (this.userName.inherits) {
                this.userName.name = val;

                if (this.card)
                    this.card.nameChanged(this.userName.name);
            }
        }

        raise() {
            this.raised = new Timestamp();
        }
    }

    export interface IPrice extends IMoney {
        label: string;
    }

    export class Price extends Money implements IPrice {
        constructor(
            public amount: number,
            public label: string
        ) {
            super(amount);
        }
    }

    export interface IItem {

        menu: server.Menu;
        menuItem: server.MenuItem;
        instructions: string;
        quantity: number;
        priceField: number;
        prices: Price[];
        cost: Cost;
    }

    export class Item implements IItem {

        del: boolean;

        static $inject = ['menu', 'item', 'priceField'];

        constructor(
            public menu: server.Menu, //to avoid error in the hash
            public menuItem: server.MenuItem,
            public priceField: number,
            public quantity: number = 1,
            public instructions: string = '',
            public prices: Array<Price> = [],
            public cost: Cost = undefined
        ) {
            this.menu = <server.Menu>menu;
            this.menuItem = <server.MenuItem>menuItem;

            if (this.prices.length === 0)
                this.prices = this.getPrices(menu, menuItem);
            else {
                var savedPrices = angular.copy(this.prices);
                this.prices = [];
                for (var iPrice = 0; iPrice < prices.length; iPrice++) {
                    var price = prices[iPrice];
                    this.prices.push(new Price(price.amount, price.label))
                }
            }

            if (cost) {
                this.cost = new Cost(this.cost.amount, this.cost.quantity, this.cost.label);
            }
        }

        getPrices(menu: server.Menu, item: server.MenuItem): Price[] {
            var prices: Price[] = [], fieldExist: boolean = true, field: number = 0;

            while (fieldExist) {
                var lbl = field + 1;
                fieldExist = eval('item.price' + lbl + '.amount > 0')

                if (fieldExist) {
                    var label: string = eval('item.presentation' + lbl + ' || menu.presentation' + lbl);
                    var amount: number = eval('item.price' + lbl + '.amount');
                    prices.push(new Price(amount, label));
                }

                field += 1;
            }


            return prices;
        }


    }

    export interface ICost {
        amount: number;
        label: string;
        quantity: number;
        cost: number;
        newPrice(amount: number, label: string): void;
        newQuantity(quantity: number): void;
    }

    export class Cost extends Price implements ICost {
        cost: number;
        constructor(
            public amount: number,
            public quantity: number,
            public label: string) {

            super(amount, label);
            this.cost = this.amount * this.quantity;
        }

        public newPrice(amount: number, label: string): void {
            this.amount = amount;
            this.label = label;
            this.cost = this.amount * this.quantity;
        }

        public newQuantity(quantity: number): void {
            this.quantity = quantity;
            this.cost = this.amount * this.quantity;
        }

        public adjustQuantity(adjust: number): void {
            this.quantity += adjust;
            this.cost = this.amount * this.quantity;
        }

    }


}