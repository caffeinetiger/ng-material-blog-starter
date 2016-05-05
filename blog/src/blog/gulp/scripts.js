'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var mkdirp = require('mkdirp');

var $ = require('gulp-load-plugins')();

module.exports = function (options) {
    gulp.task('scripts', ['tsd:install'], function () {
        mkdirp.sync(options.tmp);

        gulp.src(options.src + '/app/**/*.js')
            .pipe(gulp.dest(options.tmp + '/serve/app'))
            .pipe($.size());

        return gulp.src(options.src + '/app/**/*.ts')
          .pipe($.sourcemaps.init())
          .pipe($.tslint())
          .pipe($.tslint.report('prose', { emitError: false }))
          .pipe($.typescript({ target: 'ES5', sourceMap: false, emitError: false })).on('error', options.errorHandler('TypeScript'))
          .pipe($.sourcemaps.write())
          .pipe($.toJson({ filename: options.tmp + '/sortOutput.json', relative: true }))
          .pipe(gulp.dest(options.tmp + '/serve/app'))
          .pipe(browserSync.reload({ stream: true }))
          .pipe($.size());
    });

    gulp.task('scriptsSrc', ['tsd:install'], function () {
        return gulp.src(options.src + '/app/**/*.ts')
          .pipe($.sourcemaps.init())
          .pipe($.tslint())
          .pipe($.tslint.report('prose', { emitError: false }))
          .pipe($.typescript({ target: 'ES5', sourceMap: true, emitError: false })).on('error', options.errorHandler('TypeScript'))
          .pipe($.sourcemaps.write())
          .pipe($.toJson({ filename: options.src + '/sortOutput.json', relative: true }))
          .pipe(gulp.dest(options.src + '/app'))
          .pipe(browserSync.reload({ stream: true }))
          .pipe($.size());
    });

    gulp.task('scriptsTsc', function () {
        return gulp.src(options.src + '/app/**/*.ts')
              .pipe($.tsc({ target: 'ES5', sourceMap: true, emitError: false }))
              .pipe(gulp.dest(options.src + '/app'));
    });
};

