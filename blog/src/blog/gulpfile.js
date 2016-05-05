/// <binding AfterBuild='default, razor' />
'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');

var options = {
    src: 'wwwroot',
    dist: 'dist',
    tmp: 'tmp',
    e2e: 'e2e',
    views: 'Views/Home',
    errorHandler: function (title) {
        return function (err) {
            gutil.log(gutil.colors
                .red('[' + title + ']'), err.toString());
            this.emit('end');
        };
    },
    wiredep: {
        directory: 'wwwroot/lib'
    }
};

wrench.readdirSyncRecursive('./gulp')
    .filter(function (file) {
        return (/\.(js|coffee)$/i).test(file);
    }).map(function (file) {
        require('./gulp/' + file)(options);
    });

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
