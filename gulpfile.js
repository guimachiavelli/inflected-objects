/* jshint node: true */

'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-sass');

gulp.task('browserify', function() {
    browserify('./src/assets/js/inflected-main.js')
              .bundle()
              .pipe(source('bundle.js'))
              .pipe(gulp.dest('./public/js/'));

});
gulp.task('sass', function () {
    gulp.src('./src/assets/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('develop', function(){
    gulp.watch(['./src/assets/scss/**/*.scss', './src/assets/js/**/*.js'],
               ['sass', 'browserify']);
});
