'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function (options) {


    gulp.task('publish:clean', function (done) {
        $.del(options.views + '/Index.cshtml', done);
        $.rd(options.src + '/scripts', done);
        $.rd(options.src + '/styles', done);
    });
    gulp.task('publish:move', function () {
        gulp.src(options.dist + "/base.html")
        .pipe($.rename("Index.cshtml"))
        .pipe(gulp.dest(options.views));
    });

    gulp.task('publish:move2', function () {
        $.del(options.src + '/scripts/*.js', function() {
            return gulp.src(options.dist + '/scripts/*')
          .pipe(gulp.dest(options.src + '/scripts'));
        });
        
    });
    gulp.task('publish:move3', function () {
        $.del(options.src + '/styles/*.css', function() {
            return gulp.src(options.dist + '/styles/*')
                .pipe(gulp.dest(options.src + '/styles'));
        });
    });

    gulp.task('publish', function(cb) {
        runSequence('publish:move', 'publish:move2', 'publish:move3');
    });
};
