module VvFilters {

    export class EightBitsFilter {
        public static Factory() {
            return function (input:any): string {

                var padding: string = "00000000";

                if (angular.isNumber(input)) {
                    var result = padding + input.toString(2);
                    return result.substring(result.length - 8, result.length);
                }

                return input;
            }
        }
    }


    export class PhoneFmt {
        public static Factory() {
            return function (tel: number): string {
                if (!tel) { return ''; }

                var value = tel.toString().trim().replace(/^\+/, '');

                if (value.match(/[^0-9]/)) {
                    return tel.toString();
                }

                var country:any, city:string, number:string;

                switch (value.length) {
                    case 10: // +1PPP####### -> C (PPP) ###-####
                        country = 1;
                        city = value.slice(0, 3);
                        number = value.slice(3);
                        break;

                    case 11: // +CPPP####### -> CCC (PP) ###-####
                        country = value[0];
                        city = value.slice(1, 4);
                        number = value.slice(4);
                        break;

                    case 12: // +CCCPP####### -> CCC (PP) ###-####
                        country = value.slice(0, 3);
                        city = value.slice(3, 5);
                        number = value.slice(5);
                        break;

                    default:
                        return tel.toString();
                }

                if (country == 1) {
                    country = "";
                }

                number = number.slice(0, 3) + '-' + number.slice(3);

                return (country + " (" + city + ") " + number).trim();
            };
        }
    }

    angular.module('VvFilters', [])
    .filter("eightbits", [EightBitsFilter.Factory])
    .filter("phoneFmt", [PhoneFmt.Factory]);
}

