module ZoEazySPA {
    'use strict';
    declare var oauthSignature;

    export interface ILocationService {
        get(userPosition: Position, systemPosition: Position): void;
    }

    export class LocationService implements ILocationService {

        static $inject = ['$rootScope', '$http', 'Tools', 'ngAuthSettings'];

        // Identify the endpoint for the remote data service
        private zoeazyService: string = 'https://order.zoeazy.net/';
        //private zoeazyService: string = 'https://localhost:44301/';
        private yelpService: string = 'https://api.yelp.com/v2/search?callback=JSON_CALLBACK';
        private serviceName: string = 'api/locations/post'; // location web api controller
        private config: {};
        private customerId: string;
        private postContent: string = "latitude:{latitude},longitude:{longitude},client_id:{clientId}{postalContent}";
        private postalContent: string = ",postalCode:{postalCode}";

        private header: {} = { 'Content-Type': "application/x-www-form-urlencoded" };
        private params: any = {
            callback: 'angular.callbacks._0',
            oauth_consumer_key: '-3OwR_HWi7730HUDpzyscA',
            oauth_token: 'Olgz6VFvmECKKpwiqAWlFlI2JdmcOs-Q',
            oauth_signature_method: "HMAC-SHA1",
            term: 'delivery',
            limit: 20,
            sort: 1,
            radius_filter: 40000
        };
        private consumerSecret = 'yRPWzCYadFGFr8aQU9dM_XcPTNI';
        private tokenSecret = 'z0arAljNRaWcaYwQeNNfPoKqPpk';
        private cll: string;

        constructor(
            private $rootScope: ng.IRootScopeService,
            private $http: ng.IHttpService,
            private common: Common.Tools,
            private ngAuthSettings: Common.INgAuthSettings
        ) {
            this.customerId = ngAuthSettings.clientId;
        }

        get(userPosition: Position, systemPosition: Position): void {
            var self: any = this;
            var position: Position = (userPosition) ? userPosition : systemPosition
            var method = 'Get';
            var params :any = {
                callback: 'angular.callbacks._0',
                oauth_consumer_key: '-3OwR_HWi7730HUDpzyscA',
                oauth_token: 'Olgz6VFvmECKKpwiqAWlFlI2JdmcOs-Q',
                oauth_signature_method: "HMAC-SHA1",
                term: 'delivery',
                limit: 20,
                sort: 1,
                radius_filter: 40000
            };

            params['oauth_timestamp'] = new Date().getTime();
            params['oauth_nonce'] = randomString();
            params['ll'] = position.latitude + "," + position.longitude;

            params['oauth_signature'] = oauthSignature.generate(method, this.yelpService,
                params, this.consumerSecret, this.tokenSecret, { encodeSignature: false });

            this.$http.jsonp(this.yelpService, { params: params }).then(successYelp, error);

            this.postContent = this.postContent
                .replace('{latitude}', position.latitude.toString())
                .replace('{longitude}', position.longitude.toString())
                .replace('{clientId}', this.ngAuthSettings.clientId)
                .replace('{postalContent}',
                (position.postalCode ? this.postalContent.replace('{postalCode}', position.postalCode) : ''));


            var data: any = {
                longitude: position.longitude,
                latitude: position.latitude,
                customerId: this.customerId
            };

            if (position.postalCode)
                data.postalCode = position.postalCode;

            this.$http.post(this.zoeazyService + this.serviceName, data, this.header).then(successZoEazy, error);

            function successYelp(response): void {
                var rsp: any = response,
                    businesses: Array<BusinessYelp> = [],
                    markers: Array<Marker> = [],
                    categories: Array<String> = [];


                for (var iBsn = 0; iBsn < rsp.data.businesses.length; iBsn++) {
                    var b: IBusinessYelp = rsp.data.businesses[iBsn],
                    cats: string = '';


                    markers.push(new Marker(businesses.length + 1000,
                        b.location.coordinate.latitude,
                        b.location.coordinate.longitude,
                        b.name,
                        b.url.toString(),
                        'yelp'
                    ));

                    for (var iCat = 0; iCat < b.categories.length; iCat++) {
                        var cat: any = b.categories[iCat][0].toString();
                        categories.push(cat);
                        cats += cat + ", ";
                    }
                    cats = cats.substr(0, cats.length - 2);

                    businesses.push(new BusinessYelp(
                        b.is_claimed,
                        b.rating,
                        b.mobile_url,
                        b.rating_img_url,
                        b.review_count,
                        b.name,
                        b.rating_img_url_small,
                        b.url,
                        cats,
                        b.phone,
                        b.snippet_text,
                        b.image_url,
                        b.snippet_image_url,
                        b.display_phone,
                        b.rating_img_url_large,
                        b.id,
                        b.is_closed,
                        b.location
                    ));
                }
                var graph = new YelpGraph(rsp.data.region, rsp.data.total, businesses);
                self.$rootScope.$broadcast('location.yelpGraph', { graph: graph, markers:markers, categories:categories });
            }

            function successZoEazy(response: any): void {
                var rsp: any = JSON.parse(response.data),
                    businesses: Array<BusinessZoEazy> = [],
                    markers: Array<Marker> = [],
                    categories: Array<string> = [];

                for (var iBsn = 0; iBsn < rsp.length; iBsn++) {
                    var b: any = rsp[iBsn];

                    var location: ILocation = getLocation(b.person.addresses);
                    var cuisines: Array<string> = getCuisines(b.cuisines);
                    var phone: string = (b.person && b.person.phones && b.person.phones.length > 0) ? b.person.phones[0].number : '';
                    var reviews = (b.countReviews === 0) ? '' : (b.countReviews === 1) ? 'One review' : b.countReviews + ' reviews';
                    var picture = (b.urlPicture) ? b.urlPicture : undefined;

                    businesses.push(new BusinessZoEazy(
                        (b.countReviews > 0) ? Math.round(b.sumReviews / b.countReviews) : 5,
                        reviews,
                        b.name,
                        cuisines,
                        phone,
                        (b.reviews && b.reviews.count > 0) ? b.reviews[0].comment : '',
                        location,
                        b.url,
                        (b.config && b.config.appName) ? b.config.appName : undefined,
                        picture,
                        (b.user_image_url) ? b.user_image_url : undefined
                    ));


                    markers.push(new Marker(Business.length,
                        location.coordinate.latitude,
                        location.coordinate.longitude,
                        b.name,
                        b.url
                    ));

                    for (var iCat = 0; iCat < b.cuisines.length; iCat++) {
                        categories.push(b.cuisines[iCat].name.toString())
                    }


                }

                self.$rootScope.$broadcast('location.zoeazyBusinesses', { businesses: businesses, markers: markers, categories:categories });

                function getLocation(addresses: Array<any>): ILocation {
                    var loc: ILocation;

                    if (addresses && addresses.length > 0) {
                        let adr = addresses[0];
                        loc = {
                            city: adr.city,
                            coordinate: {
                                latitude: adr.latitude,
                                longitude: adr.longitude
                            },
                            postal_code: adr.postalCode,
                            display_address: [adr.street, adr.city + ', ' + adr.state.code + ' ' + adr.postalCode]
                        };
                    }

                    return loc;
                }

                function getCuisines(cuisines: Array<any>): Array<string> {
                    let cus: Array<string> = [];

                    for (var iCus = 0; iCus < cuisines.length; iCus++) {
                        cus.push(cuisines[iCus].name)
                    }

                    return cus;
                }
            }

            function error(err): string {
                if (err && err.status === 500)
                    return 'Formatting Error';
                else
                    return err.status.msg;
            }

            function randomString(length = 32, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
                var result = '';
                for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
                return result;
            }
        };

    };

    angular.module('ZoEazySPA')
        .service('LocationService', LocationService);

}
