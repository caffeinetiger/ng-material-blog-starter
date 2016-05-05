var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ZoEazySPA;
(function (ZoEazySPA) {
    'use strict';
    var Business = (function () {
        function Business(rating, mobile_url, review_count, name, url, phone, snippet_text, image_url, snippet_image_url) {
            this.rating = rating;
            this.mobile_url = mobile_url;
            this.review_count = review_count;
            this.name = name;
            this.url = url;
            this.phone = phone;
            this.snippet_text = snippet_text;
            this.image_url = image_url;
            this.snippet_image_url = snippet_image_url;
        }
        return Business;
    }());
    ZoEazySPA.Business = Business;
    var BusinessYelp = (function (_super) {
        __extends(BusinessYelp, _super);
        function BusinessYelp(is_claimed, rating, mobile_url, rating_img_url, review_count, name, rating_img_url_small, url, categories, phone, snippet_text, image_url, snippet_image_url, display_phone, rating_img_url_large, id, is_closed, location) {
            _super.call(this, rating, mobile_url, review_count, name, url, phone, snippet_text, image_url, snippet_image_url);
            this.is_claimed = is_claimed;
            this.rating = rating;
            this.mobile_url = mobile_url;
            this.rating_img_url = rating_img_url;
            this.review_count = review_count;
            this.name = name;
            this.rating_img_url_small = rating_img_url_small;
            this.url = url;
            this.categories = categories;
            this.phone = phone;
            this.snippet_text = snippet_text;
            this.image_url = image_url;
            this.snippet_image_url = snippet_image_url;
            this.display_phone = display_phone;
            this.rating_img_url_large = rating_img_url_large;
            this.id = id;
            this.is_closed = is_closed;
            this.location = location;
        }
        return BusinessYelp;
    }(Business));
    ZoEazySPA.BusinessYelp = BusinessYelp;
    var BusinessZoEazy = (function (_super) {
        __extends(BusinessZoEazy, _super);
        function BusinessZoEazy(rating, review_count, name, categories, phone, snippet_text, location, url, mobile_url, image_url, snippet_image_url) {
            _super.call(this, rating, mobile_url, review_count, name, url, phone, snippet_text, image_url, snippet_image_url);
            this.rating = rating;
            this.review_count = review_count;
            this.name = name;
            this.categories = categories;
            this.phone = phone;
            this.snippet_text = snippet_text;
            this.location = location;
            this.url = url;
            this.mobile_url = mobile_url;
            this.image_url = image_url;
            this.snippet_image_url = snippet_image_url;
        }
        return BusinessZoEazy;
    }(Business));
    ZoEazySPA.BusinessZoEazy = BusinessZoEazy;
    var YelpGraph = (function () {
        function YelpGraph(region, total, businesses) {
            this.region = region;
            this.total = total;
            this.businesses = businesses;
        }
        return YelpGraph;
    }());
    ZoEazySPA.YelpGraph = YelpGraph;
    var Marker = (function () {
        function Marker(id, latitude, longitude, labelContent, url, icn, animation, labelAnchor, labelClass, onClicked) {
            if (icn === void 0) { icn = 'zoeazy'; }
            if (animation === void 0) { animation = 2; }
            if (labelAnchor === void 0) { labelAnchor = '26 0'; }
            if (labelClass === void 0) { labelClass = 'map-icon'; }
            this.id = id;
            this.url = url;
            this.onClicked = onClicked;
            this.icon = 'assets/images/{icon}-icon.png';
            this.coord = { latitude: latitude, longitude: longitude };
            this.options = { animation: animation, labelContent: labelContent, labelAnchor: labelAnchor, labelClass: labelClass };
            this.icon = this.icon.replace('{icon}', icn);
            if (!this.onClicked) {
                this.onClicked = function () {
                    window.open(url, '_blank');
                };
            }
        }
        return Marker;
    }());
    ZoEazySPA.Marker = Marker;
})(ZoEazySPA || (ZoEazySPA = {}));
//# sourceMappingURL=Business.js.map