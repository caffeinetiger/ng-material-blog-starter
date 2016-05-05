module ZoEazySPA {
    'use strict';

    export class Phone {

        static regex: RegExp = /^([0-9](|-)?)?(\(?[0-9]{3}\)?|[0-9]{3})(|-)?([0-9]{3}(|-)?[0-9]{4}|[a-zA-Z0-9]{7})$/;
        private areaCode: string;
        private areaGroup: string;
        private areaNumber: string;
        private extension: string;
        public err: string;

        constructor(
            public str: string = ''
        ) {
            this.str = this.str.replace('(', '').replace(')', '').replace(/-/g, '').replace(' ', '');
            if (!this.valid()) throw "Invalid number: " + this.err;
            this.parse();
        }

        valid(val: string = this.str): boolean {
            if (val === '') return true;

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
        }

        parse(val: string = this.str): void {
            if (val === '') {
                this.areaCode = this.areaGroup = this.areaNumber = this.extension = '';
            } else {
                this.areaCode = val.slice(0, 3);
                this.areaGroup = val.slice(3, 6);
                this.areaNumber = val.slice(6, 10);
                this.extension = (val.length > 10) ? val.slice(11) : '';
            }
        }
    }

    export interface IUserBase {
        email: string;
        userName: string;
        phone: Phone;
    }

    export interface IUser extends IUserBase {
        orders: Array<Order>;
        order: Order;
        cards: Array<CreditCard>;
        addToOrder(item: Item): void;
        aggregate(order:Order):void;
        userPosition: Position;
        systemPosition: Position;
        isLoged: boolean;
        short: string;
    }

    export class User implements IUser {
        cards: Array<CreditCard>;
        cash: Cash;
        order: Order;
        phone: Phone;
        userPosition: Position;
        orders: Array<Order>;
        private _systemPosition: Position;
        short: string;
        constructor(
            public email?: string,
            public userName?: string,
            public isLoged: boolean = false,
            phone?: Phone,
            position?: Position,
            orders?: Array<Order>,
            order?: Order,
            cards?: Array<CreditCard>

        ) {
            this.getPhone(phone);
            this.getUserPosition(position);
            this.getOldOrders(orders);
            this.getCards(cards);
            this.getNewOrder(order);
            this.getShort();
        }

        get name(): string {
            return this.userName;
        }
        getShort(): void {
            if (!this.userName) return;
            var len = 7;
            var index = this.userName.indexOf(' ');
            var first = (index > 0) ? this.userName.substr(0, index) : this.userName;
            var second = (first.length > len) ? first.substr(0, len) : first;
            this.short = (index > 0) ? second.substr(0, second.length) : (first.length <= len)? second : second + '...';
        }

        set name(val: string) {
            this.userName = val;

            if (this.order)
                this.order.nameChanged(this.userName);
        }

        get systemPosition(): Position {
            return this._systemPosition;
        }

        set systemPosition(position: Position) {
            this._systemPosition = position;

            if (!this.userPosition || !this.userPosition.address) {
                this.userPosition = angular.copy(this._systemPosition);
                this.userPosition.needsConfirmation = true;
            }
        }

        addToOrder(item: Item): void {
            if (this.order === null) throw "Order do not exist..."
            this.order.add(item)
        }

        aggregate(order: Order): void {
            this.order = undefined;
            
            this.orders.splice(0, 0, order);
        }

        createOrder(): void {
            this.order = new Order(Kind.DELIVERY, PayMethod.CREDIT, new UserName(this.userName),
                this.userPosition, this.phone, this.cards[0]);
        }

        getCards(cards: Array<CreditCard>): void {
            this.cards = Array<CreditCard>();
            if (cards) {
                for (var iCard = 0; iCard < cards.length; iCard++) {
                    var card = cards[iCard];
                    this.cards.push(new CreditCard(card.cardName, card.postalCode, card.ccBrand, card.ccv, card.validThru, card.ccNumber));
                }
            }

            this.cards.push(new CreditCard(new UserName(this.userName), new PostalCode(this.userPosition.postalCode)));
        }

        getCash(cash: Cash): Cash {
            return (cash)
                ? new Cash(new Money(this.cash.pay.amount))
                : new Cash(new Money());
        }

        getNewOrder(order: any): void {
            if (order) {
                this.order = new Order(order.kind, order.payMethod, order.userName,
                    order.userPosition, order.phone, order.card, order.cash, order.items);
            } else {
                this.createOrder();
            }
        }

        getOldOrders(orders: Array<Order>): void {
            this.orders = Array<Order>();
            if (orders) {
                for (var iOrder = 0; iOrder < orders.length; iOrder++) {
                    var order = orders[iOrder];
                    this.orders.push(new Order(order.kind, order.paymethod, order.userName,
                        order.userPosition, order.phone, order.card, order.cash, order.items, order.raised));
                }
            }
        }

        getPhone(phone: Phone): void {
            this.phone = new Phone((phone ? phone.str : undefined));
        }

        getUserPosition(position: Position): void {
            this.userPosition = (position)
                ? new Position(position.longitude, position.latitude, position.accepted, position.defined, position.address, position.postalCode, position.status)
                : new Position();
        }

        copyPositions(): void {
            this.order.userPosition = angular.copy(this.userPosition)
            this.order.systemPosition = angular.copy(this.systemPosition)
        }

    }

    export interface IUserLog extends IUserBase {
        password: string;
        rememberMe: boolean;

    };

    export class UserLog {
        public userName: string;
        public phone: Phone;

        constructor(
            public email: string,
            public password: string,
            public rememberMe: boolean

        ) {

        }
    }

    export interface IUserReg extends IUserBase {
        password: string;
        reenterPassword: string;
        rememberMe: boolean;
        position: Position;

    };

    export class UserReg {
        constructor(public email: string,
            public userName: string,
            public phone: Phone,
            public password: string,
            public reenterPassword: string,
            public rememberMe: boolean,
            public position: Position) {

        }

    }
}
