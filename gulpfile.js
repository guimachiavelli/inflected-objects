/* jshint node: true */

'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass');

gulp.task('browserify', function() {
    browserify('./template/js/inflected-main.js')
              .bundle()
              .pipe(source('bundle.js'))
              .pipe(gulp.dest('./public/js/'));
});

gulp.task('sass', function () {
    gulp.src('./template/scss/inflected-main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('develop', function(){
    gulp.watch(['./template/scss/**/*.scss', './template/js/**/*.js'],
               ['sass', 'browserify']);
});
