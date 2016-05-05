module Common {
    'use strict';

    export interface ICommonTools {
        configureDialog(header: string, msg: string, ok: string, cancel: string, aria: string): any;
        dialog(msg: string, thn: Function, els: Function): any;
        getYears(yearsToShow: number): {}[];
        isNumber(val: any): boolean;
        textContains(text: any, searchText: string): boolean;
        endsWith(str: string, endStr: string): boolean;
        isEmpty(val: any): boolean;
        isEven(x: number): boolean;
        isOdd(x: number): boolean;
        hasValue(val: any): boolean;
        oddOrEven(x: number): string;
        trim(str: any): string;
        log(message: string, toastType: string, data: any, source: string): void;
        googleMapRequestAddress(address: string): any;
    }

    export class Tools implements ICommonTools {
        static $inject: Array<string> = ['$rootScope', '$mdDialog', '$log', '$http', 'googleMapsUrl'];

        source: string = 'ZoEazy';

        constructor(
            private $rootScope: ng.IRootScopeService,
            private $mdDialog: ng.material.IDialogService,
            private $log: ng.ILogService,
            private http: ng.IHttpService,
            private gMap: string
        ) {
        }

        public static CommonToolsFactory($rootScope: ng.IRootScopeService,
            $mdDialog: ng.material.IDialogService, 
            $log: ng.ILogService,
            http: ng.IHttpService,
            gMap: string): Tools {
            return new Tools($rootScope, $mdDialog, $log, http, gMap);
        }

        configureDialog(header: string, msg: string, ok: string, cancel: string, aria: string): any {
            return this.$mdDialog.confirm()
                .title(header)
                .content(msg)
                .ariaLabel(aria || 'cancel ')
                .ok(ok || 'Yes')
                .cancel(cancel || 'No');
        }

        dialog(msg: string, thn: Function, els: Function = null): any {
            this.$mdDialog
                .show(msg)
                .then((response: ng.IHttpPromiseCallbackArg<any>): any => {
                    return thn(<any>response.data);
                }, (response: ng.IHttpPromiseCallbackArg<any>): any => {
                    return (els === null) ?
                        null :
                        els(<any>response.data);
                });

       
        }

        getYears(yearsToShow: number): {}[] {

            var date = new Date();
            var month = date.getMonth() + 1;

            var year = date.getFullYear();

            var showYears = yearsToShow || 6;

            if (month === 12)--year;

            var yearArray: {}[] = [];

            for (var iYear = year; iYear < year + showYears; iYear++) {

                var yearElem = { year: iYear, name: iYear };

                yearArray.push(yearElem);
            }

            return yearArray;
        }

        //getZEDateTime(zedate: { date: { year: number; month: number; day: number }; time: { hour: number; minute: number; second: number } }): moment.Moment {
        //    return null;
        //    //return moment({ y: zedate.date.year, M: zedate.date.month - 1, d: zedate.date.day, h: zedate.time.hour, m: zedate.time.minute, s: zedate.time.second });
        //}

        isNumber(val: any): boolean {
            // negative or positive
            return /^[-]?\d+$/.test(val);
        }

        textContains(text: any, searchText: string): boolean {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }

        endsWith(str: string, endStr: string): boolean {
            var elng = endStr.length;
            var ilng = str.length - elng;
            return (str.substring(ilng, str.length) === endStr);
        }

        isEmpty(val: any): boolean {
            return angular.isUndefined(val) || val === null || val === '';
        }

        isEven(x: number): boolean {
            return !(x & 1);
        }

        isOdd(x: number): boolean {
            return !!(x & 1);
        }

        hasValue(val: any): boolean {
            return !angular.isUndefined(val) && val !== null && val !== '';
        }

        oddOrEven(x: number):string {
            return (x & 1) ? "odd" : "even";
        }

        trim(str: any): string {
            return str.toString().replace(/^\s+|\s+$/g, '');
        }

        nullToEmpty(str: any): any {
            return str || '';
        }

        log(message: string, toastType: string = 'error',
            data: any = undefined, source: string = undefined): void {
            var write = (toastType === 'error') ? this.$log.error : this.$log.log;
            source = '[' + (source || this.source) + '] ';
            write(source, message, data);

            if (toastType) {
                this.$rootScope.$broadcast('Logger.ShowToast', { message: source + message, toastType: toastType });
            }
        }

        googleMapRequestAddress(address: string): any {

            //address = "columbus ave, new york";
            try {
                var requestAddress = this.gMap + '?address=' + encodeURIComponent(address);

                return this.http.get(requestAddress)
                    .success(function (response: any) {
                        return response;
                    }).error(function (err: any, status: any) {

                        return err;
                    });

            } catch (e) {
                return [false, 'Invalid Address'];
            }
        };
    }

    angular.module('Common', ['LocalStorageModule', 'ngMaterial'])
        .service('Tools', Tools);
}
