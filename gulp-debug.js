'use strict';

var gulp = require('gulp');

require('./gulpfile.js');

function exit() {
    process.exit(0);
}

process.nextTick(function () {
    var args = process.argv;

    gulp.start(args[2], exit);
});
