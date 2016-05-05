var Common;
(function (Common) {
    'use strict';
    var Tools = (function () {
        function Tools($rootScope, $mdDialog, $log, http, gMap) {
            this.$rootScope = $rootScope;
            this.$mdDialog = $mdDialog;
            this.$log = $log;
            this.http = http;
            this.gMap = gMap;
            this.source = 'ZoEazy';
        }
        Tools.CommonToolsFactory = function ($rootScope, $mdDialog, $log, http, gMap) {
            return new Tools($rootScope, $mdDialog, $log, http, gMap);
        };
        Tools.prototype.configureDialog = function (header, msg, ok, cancel, aria) {
            return this.$mdDialog.confirm()
                .title(header)
                .content(msg)
                .ariaLabel(aria || 'cancel ')
                .ok(ok || 'Yes')
                .cancel(cancel || 'No');
        };
        Tools.prototype.dialog = function (msg, thn, els) {
            if (els === void 0) { els = null; }
            this.$mdDialog
                .show(msg)
                .then(function (response) {
                return thn(response.data);
            }, function (response) {
                return (els === null) ?
                    null :
                    els(response.data);
            });
        };
        Tools.prototype.getYears = function (yearsToShow) {
            var date = new Date();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var showYears = yearsToShow || 6;
            if (month === 12)
                --year;
            var yearArray = [];
            for (var iYear = year; iYear < year + showYears; iYear++) {
                var yearElem = { year: iYear, name: iYear };
                yearArray.push(yearElem);
            }
            return yearArray;
        };
        //getZEDateTime(zedate: { date: { year: number; month: number; day: number }; time: { hour: number; minute: number; second: number } }): moment.Moment {
        //    return null;
        //    //return moment({ y: zedate.date.year, M: zedate.date.month - 1, d: zedate.date.day, h: zedate.time.hour, m: zedate.time.minute, s: zedate.time.second });
        //}
        Tools.prototype.isNumber = function (val) {
            // negative or positive
            return /^[-]?\d+$/.test(val);
        };
        Tools.prototype.textContains = function (text, searchText) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        };
        Tools.prototype.endsWith = function (str, endStr) {
            var elng = endStr.length;
            var ilng = str.length - elng;
            return (str.substring(ilng, str.length) === endStr);
        };
        Tools.prototype.isEmpty = function (val) {
            return angular.isUndefined(val) || val === null || val === '';
        };
        Tools.prototype.isEven = function (x) {
            return !(x & 1);
        };
        Tools.prototype.isOdd = function (x) {
            return !!(x & 1);
        };
        Tools.prototype.hasValue = function (val) {
            return !angular.isUndefined(val) && val !== null && val !== '';
        };
        Tools.prototype.oddOrEven = function (x) {
            return (x & 1) ? "odd" : "even";
        };
        Tools.prototype.trim = function (str) {
            return str.toString().replace(/^\s+|\s+$/g, '');
        };
        Tools.prototype.nullToEmpty = function (str) {
            return str || '';
        };
        Tools.prototype.log = function (message, toastType, data, source) {
            if (toastType === void 0) { toastType = 'error'; }
            if (data === void 0) { data = undefined; }
            if (source === void 0) { source = undefined; }
            var write = (toastType === 'error') ? this.$log.error : this.$log.log;
            source = '[' + (source || this.source) + '] ';
            write(source, message, data);
            if (toastType) {
                this.$rootScope.$broadcast('Logger.ShowToast', { message: source + message, toastType: toastType });
            }
        };
        Tools.prototype.googleMapRequestAddress = function (address) {
            //address = "columbus ave, new york";
            try {
                var requestAddress = this.gMap + '?address=' + encodeURIComponent(address);
                return this.http.get(requestAddress)
                    .success(function (response) {
                    return response;
                }).error(function (err, status) {
                    return err;
                });
            }
            catch (e) {
                return [false, 'Invalid Address'];
            }
        };
        ;
        Tools.$inject = ['$rootScope', '$mdDialog', '$log', '$http', 'googleMapsUrl'];
        return Tools;
    }());
    Common.Tools = Tools;
    angular.module('Common', ['LocalStorageModule', 'ngMaterial'])
        .service('Tools', Tools);
})(Common || (Common = {}));
//# sourceMappingURL=common.js.map