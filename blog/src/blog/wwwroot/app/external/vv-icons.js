/*
 * angular-material-icons v0.6.0
 * (c) 2014 Klar Systems
 * License: MIT
 */

/* jshint -W097, -W101 */
'use strict';

angular.module('vvNgMdIcons', [])
    .directive('vvNgMdIcon', ['vvNgMdIconService', function (vvNgMdIconService) {
        var shapes = vvNgMdIconService.getShapes();

        return {
            restrict: 'AE',
            link: function(scope, element, attr) {

                var icon, size, viewBox;

                var render = function() {
                    // icon
                    if (attr.icon !== undefined) {
                        icon = attr.icon;
                        // Check for material-design-icons style name, and extract icon / size
                        var ss = icon.match(/ic_(.*)_([0-9]+)px.svg/m);
                        if (ss !== null) {
                            icon = ss[1];
                            size = ss[2];
                        }
                    } else {
                        icon = 'help';
                    }
                    // validate
                    if (shapes[icon] === undefined) {
                        icon = 'help';
                    }

                    // size
                    if (attr.size !== undefined) {
                        size = attr.size;
                    }
                    else if (size !== null) {
                        size = 24;
                    }

                    // viewBox
                    if (attr.viewBox !== undefined) {
                        viewBox = attr.viewBox;
                    }
                    else {
                        viewBox = '0 0 24 24';
                    }

                    // render
                    element.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" width="' + size + '" height="' + size + '">' + shapes[icon] + '</svg>');
                };

                var replace = function(newicon) {
                    // validate
                    if (shapes[newicon] === undefined) {
                        newicon = 'help';
                    }
                    if (newicon === icon) { return; }
                    try {
                        // this block will succeed if SVGMorpheus is available
                        // render new and old icons (old icon will be shown by default)
                        element.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + size + '" height="' + size + '"><g id="' + newicon + '" style="display:none">' + shapes[newicon] + '</g><g id="' + icon + '" style="display:none">' + shapes[icon] + '</g></svg>');
                        // morph
                        new SVGMorpheus(element.children()[0]).to(newicon, JSON.parse(attr.options || null));
                    } catch (error) {
                        // fallback
                        element.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + size + '" height="' + size + '">' + shapes[newicon] + '</svg>');
                    }
                    icon = newicon;
                };

                var resize = function(newsize) {
                    if (newsize === size) { return; }
                    element.children()[0].setAttribute('width', newsize);
                    element.children()[0].setAttribute('height', newsize);
                    size = newsize;
                };

                // render the first time
                render();

                // watch for any changes
                if (attr.icon !== undefined) { attr.$observe('icon', replace); }
                if (attr.size !== undefined) { attr.$observe('size', resize); }

                //scope.$watch('clicked', function () {
                //    console.log('innerFunc called');
                //})
            }
        };
    }])
    .provider('vvNgMdIconService', function () {
        var provider, service, shapes;

        shapes = includedShapes();

        service = {
            getShape : getShape,
            getShapes: getShapes,
            setShape : addShape,
            setShapes: addShapes,
            addShape : addShape,
            addShapes: addShapes
        };

        provider = {
            $get     : vvNgMdIconServiceFactory,
            getShape : getShape,
            getShapes: getShapes,
            setShape : addShape,
            setShapes: addShapes,
            addShape : addShape,
            addShapes: addShapes
        };

        return provider;

        function addShape(name, shape) {
            shapes[name] = shape;

            return provider; // chainable function
        }

        function addShapes(newShapes) {
            shapes = angular.extend(shapes, newShapes);

            return provider; // chainable function
        }

        function getShape(name) {
            return shapes[name];
        }

        function getShapes() {
            return shapes;
        }

        function includedShapes() {
            return {
                'add_shopping_cart': '<path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3z"/><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/><path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/><path d="M7.17 14.75l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/>',
                'background': '<rect width="24" height="24" x="0" y="0" ry="0.61827207" />',
                'backToItems': '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z" id="path3338" /><path sodipodi:nodetypes="cccccssccscccsccsscccc" inkscape:connector-curvature="0" d="m 1,2 0,2 2,0 3.6,7.59 -1.35,2.45 C 5.09,14.32 5,14.65 5,15 c 0,1.1 0.9,2 2,2 l 12,0 0,-2 -11.58,0 C 7.28,15 7.17,14.89 7.17,14.75 L 7.2,14.63 8.1,13 l 7.45,0 c 0.75,0 1.41,-0.41 1.75,-1.03 L 20.88,5.48 C 20.96,5.34 21,5.17 21,5 21,4.45 20.079875,3.9216508 19.801887,4.3962264 L 15.831415,11.174528 8.5213207,11.160377 4.27,2 Z" id="path3340" /><path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" id="path3342" /><path d="m 11.537061,8.9009433 0,-2.44407 6.74124,0 0,-3.0080863 -6.74124,0 0,-2.44407 -5.0559291,3.9481132 5.0559291,3.9481131" id="path3361" inkscape:connector-curvature="0" />',
                'car': '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
                'charge': '<path d="M 16,6 16,4 C 16,2.89 15.11,2 14,2 L 10,2 C 8.89,2 8,2.89 8,4 L 8,6 2,6 2,19 c 0,1.11 0.89,2 2,2 l 16,0 c 1.11,0 2,-0.89 2,-2 L 22,6 Z m -6,-2 4,0 0,2 -4,0 z" id="path4140" inkscape:connector-curvature="0" sodipodi:nodetypes="cssssccssssccccccc" /><path d="M 9.1459912,14.233516 11.09374,12.285775 6.2622322,7.4611646 c -1.073666,1.0736661 -1.073666,2.8149314 0,3.8954764 l 2.883759,2.876875 z m 4.6663338,-1.245729 c 1.053018,0.488657 2.532751,0.144533 3.627065,-0.949781 1.314554,-1.314551 1.569204,-3.2003463 0.557481,-4.2120705 C 16.99203,6.8210938 15.10623,7.0688635 13.784795,8.3834168 12.690481,9.4777296 12.346356,10.957459 12.835013,12.010476 l -6.7173128,6.717297 0.97043,0.97043 4.7420378,-4.728261 4.735148,4.735144 0.970429,-0.97043 -4.735145,-4.735144 1.011725,-1.011725 z" id="path4147" inkscape:connector-curvature="0" style="fill:#f4511e" />  ',
                'checkout': '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z" id="path3338" /><path sodipodi:nodetypes="cccccssccscccsccsscccc" inkscape:connector-curvature="0" d="m 1,2 0,2 2,0 3.6,7.59 -1.35,2.45 C 5.09,14.32 5,14.65 5,15 c 0,1.1 0.9,2 2,2 l 12,0 0,-2 -11.58,0 C 7.28,15 7.17,14.89 7.17,14.75 L 7.2,14.63 8.1,13 l 7.45,0 c 0.75,0 1.41,-0.41 1.75,-1.03 L 20.88,5.48 C 20.96,5.34 21,5.17 21,5 21,4.45 20.079875,3.9216508 19.801887,4.3962264 L 15.831415,11.174528 8.5213207,11.160377 4.27,2 Z" id="path3340" /> <path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" id="path3342" /><path d="m 13.424528,8.9575471 0,-2.4791105 -5.1886789,0 0,-3.0512129 5.1886789,0 0,-2.47911051 3.89151,4.00471701 -3.89151,4.0047169" id="path3361" inkscape:connector-curvature="0" />',

                'chinese':'<path style="fill:white;" inkscape:connector-curvature="0" id="path4755" d="M 14.68106,9.7250024 12.157629,2.1275825 c -0.109464,-0.32428 -0.293824,-0.4864201 -0.478184,-0.4864201 -0.18436,0 -0.368721,0.1621401 -0.478185,0.4980016 l -2.5234307,7.5858384 -2.7596425,0 c -0.3168692,0 -0.5761258,0.5211646 -0.5761258,1.1581436 0,0.104228 0.00576,0.208465 0.023045,0.312699 l 1.4633595,10.735986 c 0.1325087,0.972842 0.5761255,1.690891 1.1061612,1.690891 l 7.4896353,0 c 0.530036,0 0.973653,-0.718049 1.111923,-1.690891 l 1.46336,-10.735986 0.01728,-0.312699 c 0,-0.636979 -0.259257,-1.1581436 -0.576126,-1.1581436 z m -4.7299931,0 1.7283781,-5.0958305 1.728377,5.0958305 z" sodipodi:nodetypes="ccsccssccsscccsccccc" /><path id="path5312" d="m 13.694027,18.342385 -1.101255,-1.034196 0.01301,-0.01236 c 0.754403,-0.799339 1.292023,-1.718166 1.608526,-2.690558 l 1.270345,0 0,-0.824061 -3.034955,0 0,-0.824061 -0.86713,0 0,0.824061 -3.0349555,0 0,0.81994 4.8429215,0 c -0.290489,0.795219 -0.750067,1.549235 -1.374401,2.208483 -0.403215,-0.424391 -0.73706,-0.889985 -1.001535,-1.380301 l -0.86713,0 c 0.316502,0.671609 0.750067,1.306136 1.292024,1.878858 l -2.2068465,2.068393 0.615662,0.585083 2.1678255,-2.060152 1.348387,1.281415 0.32951,-0.840543 z" inkscape:connector-curvature="0" style="fill:#000;" />',


                'close': '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
                'content_copy': '<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>',
                'delete': '<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>',
                'delivery': '<path d="m 19.971698,5.9056594 -3,0 0,-0.0094 -14.4245282,0 c -1.1,0 -1.64054761,0.56041 -1.63207546,1.660377 l 0.0566038,7.3490156 1.99999996,0 c 0,1.66 1.34,3 3,3 1.66,0 3,-1.34 3,-3 l 5.9999999,0 c 0,1.66 1.34,3 3,3 1.66,0 3,-1.34 3,-3 l 2,0 0,-4.9999996 z M 5.9716981,16.405652 c -0.83,0 -1.5,-0.67 -1.5,-1.5 0,-0.83 0.67,-1.5 1.5,-1.5 0.83,0 1.5,0.67 1.5,1.5 0,0.83 -0.67,1.5 -1.5,1.5 z m 13.4999999,-8.9999926 1.96,2.499993 -4.46,0 0,-2.499993 z m -1.5,8.9999926 c -0.83,0 -1.5,-0.67 -1.5,-1.5 0,-0.83 0.67,-1.5 1.5,-1.5 0.83,0 1.5,0.67 1.5,1.5 0,0.83 -0.67,1.5 -1.5,1.5 z" id="path4152" inkscape:connector-curvature="0" sodipodi:nodetypes="cccssccsccsccccssssscccccsssss" /><path d="M 8.7914767,10.525357 9.9543215,9.3625143 7.069809,6.4821142 c -0.6410028,0.641003 -0.6410028,1.680578 0,2.3256881 L 8.7914767,10.525357 Z M 11.577376,9.7816298 c 0.628676,0.2917382 1.512109,0.08629 2.165439,-0.567039 0.784817,-0.7848142 0.936849,-1.9106776 0.332828,-2.5146996 -0.599913,-0.599913 -1.725776,-0.451989 -2.514703,0.332828 -0.65333,0.65333 -0.85878,1.5367619 -0.567041,2.1654367 l -4.0103788,4.0103721 0.5793678,0.579368 2.831097,-2.822877 2.826987,2.826986 0.579368,-0.579368 -2.826986,-2.826986 0.604022,-0.6040212 z" id="path4154" inkscape:connector-curvature="0" style="fill:whitesmoke;fill-opacity:1" />',
                'desktop': '<path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>',
                'devices_other': '<path d="M3 6h18V4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v-2H3V6zm10 6H9v1.78c-.61.55-1 1.33-1 2.22s.39 1.67 1 2.22V20h4v-1.78c.61-.55 1-1.34 1-2.22s-.39-1.67-1-2.22V12zm-2 5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM22 8h-6c-.5 0-1 .5-1 1v10c0 .5.5 1 1 1h6c.5 0 1-.5 1-1V9c0-.5-.5-1-1-1zm-1 10h-4v-8h4v8z"/>',

                'double_keyboard_arrow_down': '<path id="svg_1" d="m7.41,9.84081l4.59,4.58l4.59,-4.58l1.41,1.41l-6,6.00001l-6,-6.00001l1.41,-1.41z"/><path id="svg_3" d="m7.41,4.90591l4.59,4.58l4.59,-4.58l1.41,1.41l-6,6.00001l-6,-6.00001l1.41,-1.41z"/>',
                'double_keyboard_arrow_up': '<path id="svg_2" d="m7.41,17.2297l4.59,-4.58003l4.59,4.58003l1.41,-1.41003l-6,-6l-6,6l1.41,1.41003z"/><path id="svg_6" d="m7.41,12.34965l4.59,-4.58l4.59,4.58l1.41,-1.41l-6,-6.00003l-6,6.00003l1.41,1.41z"/>',
                'email': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
                'edit': '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
                'exposure_minus_1': '<path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"/>',
                'exposure_plus_1': '<path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"/>',
                'forward': '<path d="m 14,9 0,-4 7,7 -7,7 0,-4.1 C 9,14.9 5.5,16.5 3,20 4,15 7,10 14,9 Z" id="path4162" inkscape:connector-curvature="0" />',

                'hamburger':'<path d="m 3,12.958788 c 8.089299,0.104569 10.435245,0.13371 18,0 0.666563,-0.01178 0.666647,-1.99485 0,-2 -5.991122,-0.04629 -12.5334226,-0.366841 -18,0 -0.6651706,0.04464 -0.666611,1.991383 0,2 z" id="path5881" inkscape:connector-curvature="0" sodipodi:nodetypes="sssss" style="fill:#2b1100" /><path d="m 3,17.379509 c 9.064455,-0.0022 10.707665,-0.02281 18,0 0.666663,0.0021 0.666664,-1.997995 0,-2 -5.699708,-0.01715 -11.892313,-0.04629 -18,0 -0.6666475,0.0051 -0.6666666,2.000162 0,2 z" id="path5879" inkscape:connector-curvature="0" sodipodi:nodetypes="sssss" style="fill:#803300;fill-opacity:1" /><path d="m 3.5906447,8.783028 c -2.2023379,2.357023 0,2 0,2 l 16.8187103,0 c 0,0 2.202339,0.357023 0,-2 -2.202338,-2.357023 -14.6163725,-2.357023 -16.8187103,0 z" id="path5883" inkscape:connector-curvature="0" sodipodi:nodetypes="zcczz" style="fill:#803300;fill-opacity:1" /><path d="m 2.8894024,15.250584 c 8.0893026,0.104569 10.4352486,0.13371 18.0000036,0 0.666563,-0.01178 0.666647,-1.99485 0,-2 -5.991122,-0.04629 -12.5334256,-0.366841 -18.0000036,0 -0.66517,0.04464 -0.666611,1.991383 0,2 z" id="path5881-8" inkscape:connector-curvature="0" sodipodi:nodetypes="sssss" style="fill:#2b1100;fill-opacity:1" /><path d="m 10.890935,10.773486 c 0,0 5.875897,2.887856 6.119117,2.746077 0.508164,-0.296222 3.16764,-2.759781 3.16764,-2.759781 z" id="path7056" inkscape:connector-curvature="0" inkscape:transform-center-x="2.8835119" inkscape:transform-center-y="0.36014068" sodipodi:nodetypes="cscc" style="fill:#d38d5f;fill-opacity:1" />',

                'home': '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
                'keyboard_arrow_down': '<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>',
                'keyboard_arrow_up': '<path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>',

                'local_restaurant': '<path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>',

                'login': '<path d="M10 17.25V14H3v-4h7V6.75L15.25 12 10 17.25"/><path d="M8 2h9a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4h2v4h9V4H8v4H6V4a2 2 0 0 1 2-2z"/>',
                'logout': '<path d="M17 17.25V14h-7v-4h7V6.75L22.25 12 17 17.25"/><path d="M13 2a2 2 0 0 1 2 2v4h-2V4H4v16h9v-4h2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z"/>',

                'map': '<path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>',
                'menu': '<path d="M3 18h18v-2H3v2z"/><path d="M3 13h18v-2H3v2z"/><path d="M3 6v2h18V6H3z"/>',
                'navigation': '<path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>',
                'notifications': '<path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/><path d="M18 16v-5.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2z"/>',
                'notifications_on': '<path d="M6.58 3.58L5.15 2.15C2.76 3.97 1.18 6.8 1.03 10h2c.15-2.65 1.51-4.97 3.55-6.42z"/><path d="M19.97 10h2c-.15-3.2-1.73-6.03-4.13-7.85l-1.43 1.43c2.05 1.45 3.41 3.77 3.56 6.42z"/><path d="M18 10.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2v-5.5z"/><path d="M11.5 22c.14 0 .27-.01.4-.04.65-.13 1.19-.58 1.44-1.18.1-.24.16-.5.16-.78h-4c0 1.1.9 2 2 2z"/>',
                'notifications_paused': '<path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/><path d="M14 9.8l-2.8 3.4H14V15H9v-1.8l2.8-3.4H9V8h5v1.8zm4 6.2v-5.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2z"/>',
                'person': '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
                'person_add': '<path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M6 10V7H4v3H1v2h3v3h2v-3h3v-2H6z"/><path d="M15 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',

                'phone_android': '<path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3.25-3H6.75V4h10.5v14z"/>',
                'phone_iphone': '<path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>',

                'pickup': '<path d="M20 4H4v2h16V4z"/><path d="M12 18H6v-4h6v4zm9-4v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1z"/>',

                'pizza': '<path style="fill: red;" d="M12 2C8.43 2 5.23 3.54 3.01 6L12 22l8.99-16C18.78 3.55 15.57 2 12 2zM7 7c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm5 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>',

                'place': '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
                'reply': '<path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>',
                'restaurant_menu': '<path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>',
                'shopping_cart': '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/><path d="M1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1z"/><path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>',
                'search': '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>',
                'store': '<path d="M20 4H4v2h16V4z"/><path style="fill: crimson;" d="M12 18H6v-4h6v4zm9-4v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1z"/>',
                'tablet': '<path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 1.99-.9 1.99-2L23 6c0-1.1-.9-2-2-2zm-2 14H5V6h14v12z"/>',
                'zoeazy_full': '<rect style="fill:#ffffff;fill-opacity:1" id="rect3348" width="24" height="24" x="1.3337947" y="1.8724899" ry="0.61827207" /> <path inkscape:connector-curvature="0" d="M 9.9173113,16.763389 5.0226955,11.642901 3.3559429,13.37429 9.9173113,20.238444 22.547819,6.2536129 19.703866,6.2519263 Z" id="path3338" style="fill:#ff0000" sodipodi:nodetypes="ccccccc"/> <path d="m 6.2102118,8.6532288 7.2083742,-0.009 -8.5683742,6.5467332 0.99834,1.625235 12.9798932,-0.06368 -1.726795,-2.643867 -7.2630745,0 7.3943475,-5.4606642 -1.601615,-2.386036 -11.0046832,0.04002 z" id="path3340" inkscape:connector-curvature="0" style="fill:#000080" sodipodi:nodetypes="ccccccccccc" /> <path inkscape:connector-curvature="0" d="m 9.4875623,17.099744 1.3492597,0.402954 -1.946916,0.170417 1.358129,2.221264 5.597009,-6.236181 -2.972918,-0.02408 z" id="path3338-2" style="fill:#ff0000" sodipodi:nodetypes="ccccccc" />',
                'zoeazy': '<rect style="fill:transparent;fill-opacity:0" id="rect3348" width="24" height="24" x="0.028302193" y="3.5277823e-015" ry="0.61827207" inkscape:export-filename="C:\Users\mdelg\Documents\Visual Studio 2015\Projects\ZoEazy\ZoEazy.SPA\wwwroot\zoeazy.png" inkscape:export-xdpi="120" inkscape:export-ydpi="120" /><path inkscape:connector-curvature="0" d="M 7.9724174,18.777926 2.5142117,12.935772 0.65553901,14.911178 7.9724174,22.742745 23.679491,5.9307827 21.833909,3.9553784 Z" id="path3338" style="fill:#ff0000" /> <path d="M 4.4540474,6.8052978 14.871981,6.8447798 2.2235694,14.809183 3.6004974,16.808256 22.361674,16.821166 19.973267,13.568431 9.4766454,13.517531 20.384326,6.8761154 18.166381,3.9402868 2.2607444,3.9122308 Z" id="path3340" inkscape:connector-curvature="0" style="fill:whitesmoke" sodipodi:nodetypes="ccccccccccc" />',
                'zoeazy_full_admin': '<rect style="fill:#ffffff;fill-opacity:1" id="rect3348" width="24" height="24" x="1.3337947" y="1.8724899" ry="0.61827207" inkscape:export-xdpi="120" inkscape:export-ydpi="120" /> <path inkscape:connector-curvature="0" d="M 9.9173113,16.763389 5.0226955,11.642901 3.3559429,13.37429 9.9173113,20.238444 22.547819,6.2536129 19.703866,6.2519263 Z" id="path3338" style="fill:#ff0000" sodipodi:nodetypes="ccccccc" inkscape:export-xdpi="120" inkscape:export-ydpi="120" /> <path d="m 6.2102118,8.6532288 7.2083742,-0.009 -8.5683742,6.5467332 0.99834,1.625235 12.9798932,-0.06368 -1.726795,-2.643867 -7.2630745,0 7.3943475,-5.4606642 -1.601615,-2.386036 -11.0046832,0.04002 z" id="path3340" inkscape:connector-curvature="0" style="fill:#000080" sodipodi:nodetypes="ccccccccccc" /> <path inkscape:connector-curvature="0" d="m 9.4875623,17.099744 1.3492597,0.402954 -1.946916,0.170417 1.358129,2.221264 5.597009,-6.236181 -2.972918,-0.02408 z" id="path3338-2" style="fill:#ff0000" sodipodi:nodetypes="ccccccc" /> <text xml:space="preserve" style="font-style:italic;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:10.71141148px;line-height:125%;font-family:\'Prisoner SF\';-inkscape-font-specification:\'Prisoner SF Bold Italic\';letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" x="10.953309" y="19.218266" id="text4222" sodipodi:linespacing="125%" transform="scale(0.95012815,1.0524896)"><tspan sodipodi:role="line" id="tspan4224" x="10.953309" y="19.218266">R</tspan></text>',
                'facebook-box': '<path d="M19 4v3h-2a1 1 0 0 0-1 1v2h3v3h-3v7h-3v-7h-2v-3h2V7.5C13 5.56 14.57 4 16.5 4M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4c0-1.11-.9-2-2-2z"/>',
                'twitter': '<path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.27 0-.54-.03-.8-.08.54 1.69 2.11 2.95 4 2.98-1.46 1.16-3.31 1.84-5.33 1.84-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>',
                'google-plus-box': '<path d="M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4c0-1.11-.9-2-2-2M9.07 19.2C6.27 19.2 5 17.64 5 16.18c0-.45.14-1.59 1.5-2.38.75-.47 1.83-.8 3.12-.91-.19-.25-.34-.55-.34-.99 0-.15.02-.31.06-.46h-.39C7 11.44 5.8 9.89 5.8 8.39c0-1.73 1.29-3.59 4.11-3.59h4.22l-.34.34-.71.71-.08.06h-.7c.41.42.9 1.09.9 2.16 0 1.4-.74 2.09-1.56 2.73-.14.12-.42.38-.42.7 0 .32.24.5.39.64.13.11.29.22.47.36.81.55 1.92 1.33 1.92 2.86 0 1.77-1.29 3.84-4.93 3.84M19 12h-2v2h-1v-2h-2v-1h2V9h1v2h2"/><path d="M10.57 13.81c-.11-.01-.19-.01-.32-.01h-.02c-.26 0-1.15.05-1.82.27-.64.24-1.41.72-1.41 1.7C7 16.85 8.04 18 9.96 18c1.54 0 2.44-1 2.44-2 0-.75-.46-1.21-1.83-2.19"/><path d="M11.2 8.87c0-1.02-.63-3.02-2.08-3.02-.62 0-1.32.44-1.32 1.65 0 1.2.62 2.95 1.97 2.95.06 0 1.43-.01 1.43-1.58z"/>',
            };
        }

        function vvNgMdIconServiceFactory() {
            return service;
        }
    })
;
