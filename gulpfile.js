'use strict';

var gulp = require('gulp');
var jslint = require('./gulp-jslint.js');
var jasmine = require('gulp-jasmine');

gulp.task('lint', function () {
    return gulp.src(['./**/*.js', './**/*.json', '!./node_modules/**'])
        .pipe(jslint({
            node: true
        }));
});

gulp.task('test', function () {
    return gulp.src(['source/**/*-tests.js'])
        .pipe(jasmine());
});
