'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');
module.exports = function(options) {
  gulp.task('styles', function () {
      //----------------------

      var sassOptions = {
          style: 'expanded'
      };

      console.log("source " + options.src);
      
      var injectFiles = gulp.src([
        options.src + '/app/**/*.scss',
        '!' + options.src + '/app/index.scss'
      ], { read: false });

      var injectOptions = {
          transform: function (filePath) {
              filePath = filePath.replace(options.src + '/app/', '');
              return '@import "' + filePath + '";';
          },
          starttag: '// injector',
          endtag: '// endinjector',
          addRootSlash: false
      };


      return gulp.src([
        options.src + '/app/index.scss'
      ])
        .pipe($.inject(injectFiles, injectOptions))
        .pipe(wiredep(_.extend({}, options.wiredep)))
        .pipe($.sourcemaps.init())
        .pipe($.sass({})).on('error', options.errorHandler('Sass'))
        .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
        .pipe($.sourcemaps.write())

        .pipe(gulp.dest(options.src + '/app'))

        .pipe(gulp.dest(options.tmp + '/serve/app/'))
        .pipe(browserSync.reload({ stream: true }));


      //------------------------

  });

  gulp.task('stylesSrc', function () {
      //----------------------

      var sassOptions = {
          style: 'expanded'
      };

      var injectFiles = gulp.src([
        options.src + '/app/**/*.scss',
        '!' + options.src + '/app/index.scss'
      ], { read: false });

      var injectOptions = {
          transform: function (filePath) {
              filePath = filePath.replace(options.src + '/app/', '');
              return '@import "' + filePath + '";';
          },
          starttag: '// injector',
          endtag: '// endinjector',
          addRootSlash: false
      };


      return gulp.src([
        options.src + '/app/**/*.scss'
      ])
        .pipe(wiredep(_.extend({}, options.wiredep)))
        .pipe($.sourcemaps.init())
        .pipe($.sass({})).on('error', options.errorHandler('Sass'))
        .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(options.src + '/app'))
        .pipe(browserSync.reload({ stream: true }));


      //------------------------

  });

};
