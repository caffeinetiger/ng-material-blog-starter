'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');
module.exports = function (options) {
    gulp.task('inject', ['scripts', 'styles'], function () {
        var injectStyles = gulp.src([
          options.tmp + '/serve/app/**/*.css',
          '!' + options.tmp + '/serve/app/vendor.css'
        ], { read: false });

        var sortOutput =
            require('../' + options.tmp
            + '/sortOutput.json');

        var injectScripts = gulp.src([options.src + '/app/**/*.js',
          '!' + options.src + '/app/**/*.spec.js',
          '!' + options.src + '/app/**/*.mock.js'
        ], { read: false })
        .pipe($.order(sortOutput, { base: options.tmp + '/serve/app' }));

        var injectOptions = {
            ignorePath: [
                options.src, options.tmp + '/serve'],
            addRootSlash: false
        };

        return gulp.src(options.src + '/*.html')
          .pipe($.inject(injectStyles, injectOptions))
          .pipe($.inject(injectScripts, injectOptions))
          .pipe(wiredep(_.extend({}, options.wiredep)))
          .pipe(gulp.dest(options.tmp + '/serve'));

    });


    gulp.task('injectSrc', ['scriptsSrc', 'stylesSrc'], function () {
        var injectStyles = gulp.src([
            options.src + '/app/**/*.css'],
            { read: false });

        var sortOutput =
            require('../' + options.tmp
            + '/sortOutput.json');

        var injectScripts = gulp.src([
          options.src + "/app/**/*.js",
          '!' + options.src + '/app/**/*.spec.js',
          '!' + options.src + '/app/**/*.mock.js'
        ], { read: false })
        .pipe($.order(sortOutput, { base: options.src + '/app' }));

        var injectOptions = {
            ignorePath: [
                options.src, options.tmp + '/serve'],
            addRootSlash: false
    };

        return gulp.src(options.src + '/Index.cshtml')
          .pipe($.inject(injectStyles, injectOptions))
          .pipe($.inject(injectScripts, injectOptions))
          .pipe(wiredep(_.extend({}, options.wiredep)))
          .pipe(gulp.dest(options.views));

    });

};
