module ZoEazySPA {
    'use strict';
    export interface IData {
        countries: Array<server.Country>;
        brands: Array<server.CreditCardBrand>;
        currency: server.Currency;
    }

    export class DataFactory implements IData {
        countries: Array<server.Country>;
        brands: Array<server.CreditCardBrand>;
        currency: server.Currency;

        constructor() {
            this.brands = [
                {
                    'id': 1,
                    'name': 'MasterCard',
                    'mnemonic': 'mc',
                    'pattern': '^5[1-5]\\d{14}$',
                    'eagerPattern': '^5[1-5]',
                    'groupPattern': '(\\d{1,4})(\\d{1,4})?(\\d{1,4})?(\\d{1,4})?(\\d{1,3})?',
                    'cvcLength': 3
                },
                {
                    'id': 2,
                    'name': 'Visa',
                    'mnemonic': 'visa',
                    'pattern': '^4\\d{12}(\\d{3}|\\d{6})?$',
                    'eagerPattern': '^4',
                    'groupPattern': '(\\d{1,4})(\\d{1,4})?(\\d{1,4})?(\\d{1,4})?(\\d{1,3})?',
                    'cvcLength': 3
                },
                {
                    'id': 3,
                    'name': 'AmericanExpress',
                    'mnemonic': 'amex',
                    'pattern': '^3[47]\\d{13}$',
                    'eagerPattern': '^3[47]',
                    'groupPattern': '(\\d{1,4})(\\d{1,6})?(\\d{1,5})?',
                    'cvcLength': 4
                },
                {
                    'id': 4,
                    'name': 'Discover',
                    'mnemonic': 'disc',
                    'pattern': '^6(011(0[0-9]|[2-4]\\d|74|7[7-9]|8[6-9]|9[0-9])|4[4-9]\\d{3}|5\\d{4})\\d{10}$',
                    'eagerPattern': '^6(011(0[0-9]|[2-4]|74|7[7-9]|8[6-9]|9[0-9])|4[4-9]|5)',
                    'groupPattern': '(\\d{1,4})(\\d{1,4})?(\\d{1,4})?(\\d{1,4})?(\\d{1,3})?',
                    'cvcLength': 3
                },
                {
                    'id': 6,
                    'name': 'DinersClub',
                    'mnemonic': 'diners',
                    'pattern': '^3(0[0-5]|[68]\\d)\\d{11}$',
                    'eagerPattern': '^3(0|[68])',
                    'groupPattern': '(\\d{1,4})?(\\d{1,6})?(\\d{1,4})?',
                    'cvcLength': 3
                }
            ];
            this.currency = {
                'id': 1,
                'code': 'USD',
                'name': 'US Dollar',
                'short': 'Dollar',
                'symbol': '$'
            };
            this.countries = [
                {
                    'id': 1,
                    'code': 'US',
                    'name': 'United States',
                    'abbreviation': 'U.S.',
                    'states': [
                        {
                            'id': 1,
                            'code': 'NY',
                            'name': 'New York',
                            'abbreviation': 'N.Y.',
                            'country_Id': 1,
                            'addresses': [
                                {
                                    'id': 3,
                                    'street': '15 Hamilton St.',
                                    'apartment': null,
                                    'city': 'Staten Island',
                                    'postalCode': '10304',
                                    'latitude': 40.615321,
                                    'longitude': -74.08712899999999,
                                    'position': null,
                                    'state_Id': 1,
                                    'person_Id': 4,
                                    'person': null
                                }
                            ]
                        },
                        {
                            'id': 2,
                            'code': 'CA',
                            'name': 'California',
                            'abbreviation': 'Cal.',
                            'country_Id': 1,
                            'addresses': null
                        },
                        {
                            'id': 3,
                            'code': 'FL',
                            'name': 'Florida',
                            'abbreviation': 'Fla.',
                            'country_Id': 1,
                            'addresses': null
                        },
                        {
                            'id': 4,
                            'code': 'MA',
                            'name': 'Massachusets',
                            'abbreviation': 'Mass',
                            'country_Id': 1,
                            'addresses': null
                        },
                        {
                            'id': 5,
                            'code': 'NJ',
                            'name': 'New Jersey',
                            'abbreviation': 'N.J.',
                            'country_Id': 1,
                            'addresses': null
                        },
                        {
                            'id': 6,
                            'code': 'CT',
                            'name': 'Connecticut',
                            'abbreviation': 'Conn.',
                            'country_Id': 1,
                            'addresses': null
                        }
                    ]
                }
            ];
            return this;
        }
    }

    function factory(): IData {
        return new DataFactory();
    }


    angular.module('ZoEazySPA')
        .factory('DataFactory', factory);
}
