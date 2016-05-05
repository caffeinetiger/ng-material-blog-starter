module ZoEazySPA {
    'use strict';

    export interface IFooterCtrl {
        submitFeedback(action: boolean): void;
    }

    export class FooterCtrl implements IFooterCtrl {

        // constructor() {
        // }

        submitFeedback(action: boolean): void {
            // good or bad...
            if (action) { 
                // good
                // submit using $http or service
            }else {
                // bad
                // submit using $http or service
            }
        }
    }
}
