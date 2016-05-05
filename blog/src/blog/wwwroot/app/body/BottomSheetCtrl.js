var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    var BottomSheetCtrl = (function () {
        function BottomSheetCtrl(sheet, kind) {
            this.sheet = sheet;
            this.kind = kind;
            this.vvItems = [
                { name: 'ZoEazy', size: 64, fill: 'whitesmoke', icon: 'zoeazy_full' },
                { name: 'Restaurant\t\sOwner', size: 64, fill: 'whitesmoke', icon: 'zoeazy_full_admin' },
                { name: 'Send us an email', size: 64, fill: '#1a237e', icon: 'email' },
            ];
            this.snItems = [
                { name: 'Google Plus', size: 64, fill: '#1a237e', icon: 'google-plus-box' },
                { name: 'Facebook', size: 64, fill: '#1a237e', icon: 'facebook-box' },
                { name: 'Twitter', size: 64, fill: '#1a237e', icon: 'twitter' },
            ];
            this.labels = { subscribe: 'Subscribe', cancel: 'Cancel', title: 'Newsletter' };
            if (kind === 'vv')
                this.items = this.vvItems;
            else if (kind === 'sn')
                this.items = this.snItems;
            else {
                this.items = this.vvItems.concat(this.snItems);
            }
        }
        ;
        BottomSheetCtrl.prototype.cancel = function () {
            this.sheet.hide();
        };
        BottomSheetCtrl.prototype.pick = function (index) {
            window.alert('oooops, hehe, mhhh... ok, busted... but working on it!!!!');
            this.sheet.hide(index);
        };
        BottomSheetCtrl.prototype.web = function () {
            var win = window.open('https://www.verticalviral.com', '_blank');
            win.focus();
        };
        BottomSheetCtrl.$inject = ['$mdBottomSheet', 'kind'];
        return BottomSheetCtrl;
    }());
    ZoEazySPA.BottomSheetCtrl = BottomSheetCtrl;
    angular
        .module('ZoEazySPA')
        .controller('bottomSheetCtrl', BottomSheetCtrl);
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=BottomSheetCtrl.js.map