'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var _ = require('lodash');
function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options) {
    gulp.task('watch', ['markups', 'inject'], function () {

 //   gulp.watch([options.src + '/*.html', !options.src + '/base.html', 'bower.json'], ['inject']);

    gulp.watch([
      options.src + '/app/**/*.scss'
    ], function(event) {
      //if(isOnlyChange(event)) {
        gulp.start('stylesSrc');
     // } else {
       // gulp.start('inject');
      //}
    });

    gulp.watch([
      options.src + '/app/**/*.ts'
    ], function(event) {
        gulp.start('scriptsTsc');
    });

    //gulp.watch(options.src + '/app/**/*.jade', ['markups']);

    //gulp.watch(options.src + '/app/**/*.html', function(event) {
    //  browserSync.reload(event.path);
    //});

    //gulp.watch(options.src + '/base.html', function(event) {
    //    // gulp.start('build');
    //    runSequence('build', 'razor');
    //});
  });
};
