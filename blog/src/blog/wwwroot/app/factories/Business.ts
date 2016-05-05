module ZoEazySPA {
    'use strict';

    export interface IBusiness {
        rating: number;
        mobile_url: URL;
        review_count: string;
        name: string;
        url: URL;
        phone: string;
        snippet_text: string;
        image_url: URL;
        snippet_image_url: URL;
    }

    export class Business implements IBusiness {


        constructor(
            public rating: number,
            public mobile_url: URL,
            public review_count: string,
            public name: string,
            public url: URL,
            public phone: string,
            public snippet_text: string,
            public image_url: URL,
            public snippet_image_url: URL
        ) {

        }



    }

    export interface IBusinessYelp extends IBusiness {
        is_claimed: boolean;
        rating_img_url: URL;
        rating_img_url_small: URL;
        snippet_image_url: URL;
        display_phone: string;
        rating_img_url_large: URL;
        id: string;
        is_closed: boolean;
        location: ILocationYelp;
        categories: string;
    }
    export interface ILocation {
        city: string;
        display_address: Array<string>;
        postal_code: string;
        coordinate: {
            latitude: number;
            longitude: number;
        };
    }
    export interface ILocationYelp extends ILocation {
        geo_accuracy: number;
        neighborhoods: Array<string>;
        country_code: string;
        address: Array<string>;
        state_code: string;
    }

    export class BusinessYelp extends Business implements IBusinessYelp {

        constructor(
            public is_claimed: boolean,
            public rating: number,
            public mobile_url: URL,
            public rating_img_url: URL,
            public review_count: string,
            public name: string,
            public rating_img_url_small: URL,
            public url: URL,
            public categories: string,
            public phone: string,
            public snippet_text: string,
            public image_url: URL,
            public snippet_image_url: URL,
            public display_phone: string,
            public rating_img_url_large: URL,
            public id: string,
            public is_closed: boolean,
            public location: ILocationYelp
        ) {
            super(rating, mobile_url, review_count, name, url, phone, snippet_text, image_url, snippet_image_url);
        }
    }

    export interface IBusinessZoEazy extends IBusiness {
        location: ILocation
    }
    export class BusinessZoEazy extends Business implements IBusinessZoEazy {
        constructor(
            public rating: number,
            public review_count: string,
            public name: string,
            public categories: Array<string>,
            public phone: string,
            public snippet_text: string,
            public location: ILocation,
            public url: URL,
            public mobile_url: URL,
            public image_url: URL,
            public snippet_image_url: URL
        ) {
            super(rating, mobile_url, review_count, name, url, phone, snippet_text, image_url, snippet_image_url);
        }
    }

    export interface IYelpGraph {
        region: IYelpRegion;
        total: number;
        businesses: Array<BusinessYelp>;
    }

    export interface IYelpRegion {

        span: {
            latitude_delta: number;
            longitude_delta: number;
        }
        center: {
            latitude: number;
            longitude: number;
        }

    }

    export class YelpGraph implements IYelpGraph {


        constructor(
            public region: IYelpRegion,
            public total: number,
            public businesses: Array<BusinessYelp>
        ) {

        }
    }

    export interface IMarker {
        id:number;
        coord: {
            latitude: number;
            longitude: number;
        },
        icon: string,
        onClicked: Function,
        //url: string,
        options: {
            animation: number,
            labelContent: string,
            labelAnchor: string,
            labelClass: string
        }
    }

    export class Marker implements IMarker {
        public coord: {latitude: number, longitude:number};
        public options: {animation:number,labelContent:string, labelAnchor:string , labelClass: string};
        public icon: string = 'assets/images/{icon}-icon.png';

        constructor(
            public id: number,
             latitude: number,
             longitude: number,
             labelContent: string,
             private url?: string,
             icn: string = 'zoeazy',
             animation: number = 2,
             labelAnchor: string = '26 0',
             labelClass: string = 'map-icon',
             public onClicked?: Function

        ) {
            this.coord = { latitude: latitude, longitude: longitude };
            this.options = { animation: animation, labelContent: labelContent, labelAnchor: labelAnchor, labelClass: labelClass };

            this.icon = this.icon.replace('{icon}', icn);

            if (!this.onClicked) {
                this.onClicked = function () {
                    window.open(url, '_blank');
                }
            }
        }
    }
}
