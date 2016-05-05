var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    var LocationService = (function () {
        function LocationService($rootScope, $http, common, ngAuthSettings) {
            this.$rootScope = $rootScope;
            this.$http = $http;
            this.common = common;
            this.ngAuthSettings = ngAuthSettings;
            // Identify the endpoint for the remote data service
            this.zoeazyService = 'https://order.zoeazy.net/';
            //private zoeazyService: string = 'https://localhost:44301/';
            this.yelpService = 'https://api.yelp.com/v2/search?callback=JSON_CALLBACK';
            this.serviceName = 'api/locations/post'; // location web api controller
            this.postContent = "latitude:{latitude},longitude:{longitude},client_id:{clientId}{postalContent}";
            this.postalContent = ",postalCode:{postalCode}";
            this.header = { 'Content-Type': "application/x-www-form-urlencoded" };
            this.params = {
                callback: 'angular.callbacks._0',
                oauth_consumer_key: '-3OwR_HWi7730HUDpzyscA',
                oauth_token: 'Olgz6VFvmECKKpwiqAWlFlI2JdmcOs-Q',
                oauth_signature_method: "HMAC-SHA1",
                term: 'delivery',
                limit: 20,
                sort: 1,
                radius_filter: 40000
            };
            this.consumerSecret = 'yRPWzCYadFGFr8aQU9dM_XcPTNI';
            this.tokenSecret = 'z0arAljNRaWcaYwQeNNfPoKqPpk';
            this.customerId = ngAuthSettings.clientId;
        }
        LocationService.prototype.get = function (userPosition, systemPosition) {
            var self = this;
            var position = (userPosition) ? userPosition : systemPosition;
            var method = 'Get';
            var params = {
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
            params['oauth_signature'] = oauthSignature.generate(method, this.yelpService, params, this.consumerSecret, this.tokenSecret, { encodeSignature: false });
            this.$http.jsonp(this.yelpService, { params: params }).then(successYelp, error);
            this.postContent = this.postContent
                .replace('{latitude}', position.latitude.toString())
                .replace('{longitude}', position.longitude.toString())
                .replace('{clientId}', this.ngAuthSettings.clientId)
                .replace('{postalContent}', (position.postalCode ? this.postalContent.replace('{postalCode}', position.postalCode) : ''));
            var data = {
                longitude: position.longitude,
                latitude: position.latitude,
                customerId: this.customerId
            };
            if (position.postalCode)
                data.postalCode = position.postalCode;
            this.$http.post(this.zoeazyService + this.serviceName, data, this.header).then(successZoEazy, error);
            function successYelp(response) {
                var rsp = response, businesses = [], markers = [], categories = [];
                for (var iBsn = 0; iBsn < rsp.data.businesses.length; iBsn++) {
                    var b = rsp.data.businesses[iBsn], cats = '';
                    markers.push(new ZoEazySPA.Marker(businesses.length + 1000, b.location.coordinate.latitude, b.location.coordinate.longitude, b.name, b.url.toString(), 'yelp'));
                    for (var iCat = 0; iCat < b.categories.length; iCat++) {
                        var cat = b.categories[iCat][0].toString();
                        categories.push(cat);
                        cats += cat + ", ";
                    }
                    cats = cats.substr(0, cats.length - 2);
                    businesses.push(new ZoEazySPA.BusinessYelp(b.is_claimed, b.rating, b.mobile_url, b.rating_img_url, b.review_count, b.name, b.rating_img_url_small, b.url, cats, b.phone, b.snippet_text, b.image_url, b.snippet_image_url, b.display_phone, b.rating_img_url_large, b.id, b.is_closed, b.location));
                }
                var graph = new ZoEazySPA.YelpGraph(rsp.data.region, rsp.data.total, businesses);
                self.$rootScope.$broadcast('location.yelpGraph', { graph: graph, markers: markers, categories: categories });
            }
            function successZoEazy(response) {
                var rsp = JSON.parse(response.data), businesses = [], markers = [], categories = [];
                for (var iBsn = 0; iBsn < rsp.length; iBsn++) {
                    var b = rsp[iBsn];
                    var location = getLocation(b.person.addresses);
                    var cuisines = getCuisines(b.cuisines);
                    var phone = (b.person && b.person.phones && b.person.phones.length > 0) ? b.person.phones[0].number : '';
                    var reviews = (b.countReviews === 0) ? '' : (b.countReviews === 1) ? 'One review' : b.countReviews + ' reviews';
                    var picture = (b.urlPicture) ? b.urlPicture : undefined;
                    businesses.push(new ZoEazySPA.BusinessZoEazy((b.countReviews > 0) ? Math.round(b.sumReviews / b.countReviews) : 5, reviews, b.name, cuisines, phone, (b.reviews && b.reviews.count > 0) ? b.reviews[0].comment : '', location, b.url, (b.config && b.config.appName) ? b.config.appName : undefined, picture, (b.user_image_url) ? b.user_image_url : undefined));
                    markers.push(new ZoEazySPA.Marker(ZoEazySPA.Business.length, location.coordinate.latitude, location.coordinate.longitude, b.name, b.url));
                    for (var iCat = 0; iCat < b.cuisines.length; iCat++) {
                        categories.push(b.cuisines[iCat].name.toString());
                    }
                }
                self.$rootScope.$broadcast('location.zoeazyBusinesses', { businesses: businesses, markers: markers, categories: categories });
                function getLocation(addresses) {
                    var loc;
                    if (addresses && addresses.length > 0) {
                        var adr = addresses[0];
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
                function getCuisines(cuisines) {
                    var cus = [];
                    for (var iCus = 0; iCus < cuisines.length; iCus++) {
                        cus.push(cuisines[iCus].name);
                    }
                    return cus;
                }
            }
            function error(err) {
                if (err && err.status === 500)
                    return 'Formatting Error';
                else
                    return err.status.msg;
            }
            function randomString(length, chars) {
                if (length === void 0) { length = 32; }
                if (chars === void 0) { chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
                var result = '';
                for (var i = length; i > 0; --i)
                    result += chars[Math.round(Math.random() * (chars.length - 1))];
                return result;
            }
        };
        ;
        LocationService.$inject = ['$rootScope', '$http', 'Tools', 'ngAuthSettings'];
        return LocationService;
    }());
    ZoEazySPA.LocationService = LocationService;
    ;
    angular.module('ZoEazySPA')
        .service('LocationService', LocationService);
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=LocationService.js.map