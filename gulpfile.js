'use strict';

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var jslint = require('./gulp-jslint.js');

gulp.task('lint', function () {
    return gulp.src(['./**/*.js', './**/*.json', '!./node_modules/**', '!./jslint/**'])
        .pipe(jslint.lint({
            node: true
        }));
});

gulp.task('test', function () {
    return gulp.src(['source/**/*-tests.js'])
        .pipe(jasmine());
});
