'use strict';

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var jslint = require('./gulp-jslint.js');

gulp.task('load-jslint', function () {
    return gulp.src('./jslint/jslint.js')
        .pipe(jslint.load());
});

gulp.task('lint', ['load-jslint'], function () {
    return gulp.src(['./**/*.js', './**/*.json', '!./node_modules/**', '!./jslint/**'])
        .pipe(jslint.lint({
            node: true
        }));
});

gulp.task('test', function () {
    return gulp.src(['source/**/*-tests.js'])
        .pipe(jasmine());
});
