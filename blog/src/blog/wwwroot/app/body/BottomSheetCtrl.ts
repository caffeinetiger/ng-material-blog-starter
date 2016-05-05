module ZoEazySPA {
    'use strict';


    export class BottomSheetCtrl {

        static $inject = ['$mdBottomSheet', 'kind'];
        vvItems: Array<{}> = [
            { name: 'ZoEazy', size: 64,  fill: 'whitesmoke', icon: 'zoeazy_full' },
            { name: 'Restaurant\t\sOwner', size: 64, fill: 'whitesmoke', icon: 'zoeazy_full_admin' },
            { name: 'Send us an email', size: 64, fill: '#1a237e', icon: 'email' },
        ];
        snItems: Array<{}> = [
            { name: 'Google Plus', size: 64, fill: '#1a237e', icon: 'google-plus-box' },
            { name: 'Facebook', size: 64, fill: '#1a237e', icon: 'facebook-box' },
            { name: 'Twitter', size: 64, fill: '#1a237e', icon: 'twitter' },

        ];
        items: Array<{}>;
        private labels: {} = { subscribe: 'Subscribe', cancel: 'Cancel', title: 'Newsletter' };

        constructor(
            private sheet: ng.material.IBottomSheetService,
            private kind: string
        ) {
            if (kind === 'vv')
                this.items = this.vvItems;
            else if (kind === 'sn')
                this.items = this.snItems;
            else {
                this.items = this.vvItems.concat(this.snItems);
            }
        };

        cancel(): void {
            this.sheet.hide();
        }

        pick(index: number): void {

            window.alert('oooops, hehe, mhhh... ok, busted... but working on it!!!!')
            this.sheet.hide(index);
        }

        web(): void {
            var win = window.open('https://www.verticalviral.com', '_blank');
            win.focus();
        }
    }

    angular
        .module('ZoEazySPA')
        .controller('bottomSheetCtrl', BottomSheetCtrl);
}
