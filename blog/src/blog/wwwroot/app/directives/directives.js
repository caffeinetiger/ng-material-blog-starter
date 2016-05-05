var VvDirectives;
(function (VvDirectives) {
    var VvDisplayName = (function () {
        function VvDisplayName() {
            this.scope = { clue: '=', clss: '=', name: '=' };
            this.rescrict = 'A';
            this.template = '{{pre}}<span class="{{clss}}">{{mid}}</span>{{post}}';
        }
        VvDisplayName.instance = function () {
            return new VvDisplayName();
        };
        VvDisplayName.prototype.link = function (scope, element, attrs) {
            if (scope.clue === undefined || scope.clue === "")
                scope.pre = scope.name, scope.mid = "", scope.post = "", scope.clss = "clue";
            else {
                var index = scope.name.toLowerCase().indexOf(scope.clue.toLowerCase());
                if (index === -1)
                    scope.pre = scope.name, scope.mid = "", scope.post = "", scope.clss = "clue";
                else {
                    scope.pre = scope.name.substring(0, index);
                    scope.mid = scope.name.substr(index, scope.clue.length);
                    scope.post = scope.name.substr(index + scope.clue.length);
                    scope.clss = scope.clss || 'clue';
                }
            }
        };
        return VvDisplayName;
    }());
    var VvHeaders = (function () {
        function VvHeaders() {
            this.scope = { menu: '=' };
            this.rescrict = 'A';
            this.template = '<div class="vv-subhead" flex="{{size}}">&nbsp;</div>' +
                '<div class="text-center" flex="{{size1}}">{{title1}}</div>' +
                '<div class="text-center" flex="{{size2}}" ng-hide="{{hide2}}">{{title2}}</div>' +
                '<div class="text-center" flex="{{size3}}" ng-hide="{{hide3}}">{{title3}}</div>' +
                '<div class="text-center" flex="{{size4}}" ng-hide="{{hide4}}">{{title4}}</div>';
        }
        VvHeaders.instance = function () {
            return new VvHeaders();
        };
        VvHeaders.prototype.link = function (scope, element, attrs) {
            var columns = 1;
            for (var iCol = 1; iCol <= 5; iCol++) {
                var title = eval('scope.menu.presentation' + iCol);
                if (title || iCol <= 1)
                    columns = iCol;
                else
                    break;
            }
            var colSize = 30;
            if (columns === 2)
                colSize = 20;
            else if (columns === 3)
                colSize = 15;
            else if (columns >= 4)
                colSize = 10;
            scope.size = (100 - (columns * colSize));
            var iCol;
            for (iCol = 1; iCol <= columns; iCol++) {
                eval('scope.title' + iCol + ' = scope.menu.presentation' + iCol);
                eval('if (scope.title' + iCol + ' === null) title' + iCol + ' = ""');
                eval('scope.hide' + iCol + ' = "false"');
                eval('scope.size' + iCol + ' = ' + colSize);
            }
            for (iCol = iCol; iCol <= 4; iCol++) {
                eval('scope.title' + iCol + ' = ""');
                eval('scope.hide' + iCol + ' = "true"');
            }
        };
        return VvHeaders;
    }());
    var VvItems = (function () {
        function VvItems(common, $filter) {
            this.common = common;
            this.rescrict = 'A';
            this.scope = { item: '=', index: '=', clue: '=' };
            this.template = '<div class="vv-name" class="vv-row" flex="{{size}}" style="outline: none" >{{pre}}<span class="clue">{{mid}}</span>{{post}}</div>' +
                '<div class="vv-price" flex="{{size1}}" style="outline: none">{{price1}}</div>' +
                '<div class="vv-price" flex="{{size2}}" ng-if="{{hide2}}" style="outline: none">{{price2}}</div>' +
                '<div class="vv-price" flex="{{size3}}" ng-if="{{hide3}}" style="outline: none">{{price3}}</div>' +
                '<div class="vv-price" flex="{{size4}}" ng-if="{{hide4}}" style="outline: none">{{price4}}</div>';
            this.link = function (scope, element, attrs) {
                var columns = 1;
                scope.pre = scope.item.name, scope.mid = "", scope.post = "";
                if (!(scope.clue === undefined || scope.clue === "")) {
                    var name = scope.item.name;
                    var index = name.toLowerCase().indexOf(scope.clue.toLowerCase());
                    if (index >= 0) {
                        scope.pre = name.substring(0, index);
                        scope.mid = name.substr(index, scope.clue.length);
                        scope.post = name.substr(index + scope.clue.length);
                    }
                }
                for (var iCol = 1; iCol <= 5; iCol++) {
                    var price = eval('scope.item.price' + iCol + '.amount');
                    if (price > 0 || iCol <= 1)
                        columns = iCol;
                    else
                        break;
                }
                var colSize = 20;
                if (columns === 2)
                    colSize = 15;
                else if (columns === 3)
                    colSize = 10;
                else if (columns >= 4)
                    colSize = 10;
                scope.size = (100 - (columns * colSize));
                var iCol;
                for (iCol = 1; iCol <= columns; iCol++) {
                    eval('scope.price' + iCol + ' = $filter("currency")(scope.item.price' + iCol + '.amount,"",2)');
                    eval('scope.hide' + iCol + ' = "false"');
                    eval('scope.size' + iCol + ' = ' + colSize);
                }
                for (iCol = iCol; iCol <= 4; iCol++) {
                    eval('scope.price' + iCol + ' = ""');
                    eval('scope.hide' + iCol + ' = "true"');
                }
            };
        }
        VvItems.factory = function () {
            var directive = function (tools, $filter) {
                return new VvItems(tools, $filter);
            };
            directive.$inject = ['Tools', '$filter'];
            return directive;
        };
        return VvItems;
    }());
    var VvMaxMin = (function () {
        function VvMaxMin() {
            this.rescrict = 'A';
            this.link = function (scope, element, attrs) {
                attrs.$set('wminimize', undefined);
                element.bind('click', function (e) {
                    var $wcontent = element.parent().next('.widget-content');
                    if ($wcontent.hasClass('in')) {
                        $wcontent.removeClass('in');
                        $wcontent.addClass('out');
                    }
                    else {
                        $wcontent.addClass('in');
                        $wcontent.removeClass('out');
                    }
                });
            };
        }
        VvMaxMin.instance = function () {
            return new VvMaxMin();
        };
        return VvMaxMin;
    }());
    var VvMaxMinAll = (function () {
        function VvMaxMinAll() {
            this.rescrict = 'A';
            this.scope = { state: '=' };
            this.link = function (scope, element, attrs) {
                element.bind('click', function (e) {
                    var widgets = document.getElementsByClassName('widget-content');
                    var $wcontent = angular.element(widgets);
                    if (scope.state === 'Close') {
                        $wcontent.removeClass('in');
                        $wcontent.addClass('out');
                    }
                    else {
                        $wcontent.addClass('in');
                        $wcontent.removeClass('out');
                    }
                });
            };
        }
        VvMaxMinAll.instance = function () {
            return new VvMaxMinAll();
        };
        return VvMaxMinAll;
    }());
    var VvPresentation = (function () {
        function VvPresentation(common, $filter) {
            var _this = this;
            this.common = common;
            this.rescrict = 'E';
            this.scope = { menu: '=', clue: '=' };
            this.transclude = false;
            this.headerOutput = '<div flex class="header flex">{{header}}</div>';
            this.menuOutput = '<div class="layout-gt-sm-row" layout-gt-sm="row">' +
                '<div class="flex layout-align-center-center layout-row" ' +
                'flex layout="row" layout-align="center center">' +
                '{{menu-cols}}</div>' +
                '<div class="hide-sm hide-xs layout-align-center-center layout-row flex vv-right-column"' +
                'hide-xs hide-sm layout="row" layout-align="center center">' +
                '{{menu-cols}}</div></div>' +
                '{{items}}' +
                '<div flex class="footer flex">{{footer}}</div>';
            this.itemOutput = '<div class="layout-gt-sm-row vv-line" layout-gt-sm="row">' +
                '<div class="{{last-row}} layout-align-start-center layout-row flex vv-row"' +
                ' flex layout layout-align="start center">{{menu-cols-0}}</div>' +
                '<div class="{{last-row}} layout-align-start-center layout-row flex vv-row vv-right-column"' +
                ' flex layout layout-align="start center">{{menu-cols-1}}</div>' +
                '</div>';
            this.link = function (scope, element, attrs) {
                var header = '', footer = '', columns = 1, cols, hasValue = common.hasValue, isOdd = common.isOdd, isEven = common.isEven, headerOutput = _this.headerOutput, menuOutput = _this.menuOutput, itemOutput = _this.itemOutput;
                for (var iCol = 1; iCol <= 5; iCol++) {
                    var title = eval('scope.menu.presentation' + iCol);
                    if (title || iCol <= 1)
                        columns = iCol;
                    else
                        break;
                }
                var colSize = 30;
                if (columns === 2)
                    colSize = 20;
                else if (columns === 3)
                    colSize = 15;
                else if (columns >= 4)
                    colSize = 10;
                var mainSize = (100 - (columns * colSize));
                cols = '<div class="vv-subhead flex-' + mainSize + '" flex="' + mainSize + '">&nbsp;</div>';
                for (var iCol = 1; iCol <= columns; iCol++) {
                    var title = eval('scope.menu.presentation' + iCol);
                    if (title === null)
                        title = '';
                    cols += '<div class="vv-subhead flex-' + colSize + '" flex="' + colSize + '">' + title + '</div>';
                }
                scope.menuCols = title;
                menuOutput = ((header !== '') ? headerOutput.replace('{{header}}', header) : '') +
                    menuOutput.replace('{{footer}}', footer)
                        .replace(/{{menu-cols}}/g, cols);
                var itemsSection = '';
                var aligner = 0;
                var output = itemOutput;
                scope.menu.menuItems[scope.menu.menuItems.length - 1].last = true;
                scope.menu.menuItems[scope.menu.menuItems.length - 1].odd = isOdd(scope.menu.menuItems.length);
                for (var iItem = 0; iItem < scope.menu.menuItems.length; iItem++) {
                    var item = scope.menu.menuItems[iItem];
                    var lastRow = (iItem >= scope.menu.menuItems.length - 2);
                    cols = '<div class="vv-name md-primary md-hue-3 flex-' + mainSize + '" flex="' + mainSize +
                        '" ng-click="mn.pickThis(' + scope.menu.id + ', ' + item.id + ')">' + displayName(item.name, scope.clue.toLowerCase()) + '</div>';
                    for (var iCol = 1; iCol <= columns; iCol++) {
                        var price = eval('item.price' + iCol + '.amount');
                        cols += '<div class="vv-price flex-' + colSize + '" flex="' + colSize + '">' + $filter('currency')(price, '', 2) + '</div>';
                    }
                    output = output
                        .replace('{{menu-cols-' + aligner + '}}', cols)
                        .replace('{{menuId-' + aligner + '}}', scope.menu.id.toString())
                        .replace('{{itemId-' + aligner + '}}', item.id.toString());
                    output = output.replace(/{{last-row}}/g, (lastRow) ? 'vv-last-row' : '');
                    if (aligner === 0) {
                        aligner = 1;
                        if (item.last && item.odd)
                            itemsSection += output.replace('{{menu-cols-1}}', '')
                                .replace('{{menuId-1}}', '')
                                .replace('{{itemId-1}}', '');
                    }
                    else {
                        itemsSection += output;
                        output = itemOutput;
                        aligner = 0;
                    }
                }
                ;
                menuOutput = menuOutput.replace('{{items}}', itemsSection);
                element.append(menuOutput);
            };
        }
        VvPresentation.factory = function () {
            var directive = function (tools, $filter) {
                return new VvPresentation(tools, $filter);
            };
            directive.$inject = ['Tools', '$filter'];
            return directive;
        };
        return VvPresentation;
    }());
    function displayName(name, clue, clss) {
        if (clss === void 0) { clss = undefined; }
        var pre = name, mid = "", post = "", clss = "clue";
        if (!(clue === undefined || clue === "")) {
            var index = name.toLowerCase().indexOf(clue);
            if (index >= 0) {
                pre = name.substring(0, index);
                mid = name.substr(index, clue.length);
                post = name.substr(index + clue.length);
                pre = '{{pre}}<span class="{{clss}}">{{mid}}</span>{{post}}'
                    .replace('{{pre}}', pre)
                    .replace('{{mid}}', mid)
                    .replace('{{post}}', post)
                    .replace('{{clss}}', clss);
            }
        }
        return pre;
    }
    angular.module('VvDirectives', ['Common'])
        .directive('vvDisplayName', VvDisplayName.instance)
        .directive('vvHeaders', VvHeaders.instance)
        .directive('vvItems', VvItems.factory())
        .directive('vvMaxMin', VvMaxMin.instance)
        .directive('vvMaxMinAll', VvMaxMinAll.instance)
        .directive('vvPresentations', VvPresentation.factory())
        .directive('ccWidgetMinimize', function () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;
        function link(scope, element, attrs) {
            element.bind('click', minimize);
            function minimize(e) {
                var $wcontent = element.parent().parent().next('.widget-content');
                var iElement = element.children('i');
                $wcontent.toggle(300);
            }
        }
    });
})(VvDirectives || (VvDirectives = {}));
//# sourceMappingURL=directives.js.map