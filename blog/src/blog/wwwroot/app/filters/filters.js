var VvFilters;
(function (VvFilters) {
    var EightBitsFilter = (function () {
        function EightBitsFilter() {
        }
        EightBitsFilter.Factory = function () {
            return function (input) {
                var padding = "00000000";
                if (angular.isNumber(input)) {
                    var result = padding + input.toString(2);
                    return result.substring(result.length - 8, result.length);
                }
                return input;
            };
        };
        return EightBitsFilter;
    }());
    VvFilters.EightBitsFilter = EightBitsFilter;
    var PhoneFmt = (function () {
        function PhoneFmt() {
        }
        PhoneFmt.Factory = function () {
            return function (tel) {
                if (!tel) {
                    return '';
                }
                var value = tel.toString().trim().replace(/^\+/, '');
                if (value.match(/[^0-9]/)) {
                    return tel.toString();
                }
                var country, city, number;
                switch (value.length) {
                    case 10:
                        country = 1;
                        city = value.slice(0, 3);
                        number = value.slice(3);
                        break;
                    case 11:
                        country = value[0];
                        city = value.slice(1, 4);
                        number = value.slice(4);
                        break;
                    case 12:
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
        };
        return PhoneFmt;
    }());
    VvFilters.PhoneFmt = PhoneFmt;
    angular.module('VvFilters', [])
        .filter("eightbits", [EightBitsFilter.Factory])
        .filter("phoneFmt", [PhoneFmt.Factory]);
})(VvFilters || (VvFilters = {}));
//# sourceMappingURL=filters.js.map