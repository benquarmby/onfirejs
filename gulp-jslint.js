'use strict';

var eventStream = require('event-stream');
var gulpUtil = require('gulp-util');
var jslint = require('./jslint.js');
var colors = require('colors/safe');

module.exports = function (options, globals) {
    var errors = 0;

    function lint(source, callback) {
        if (source.isStream()) {
            callback(new gulpUtil.PluginError('gulp-jslint', 'Bad input file ' + source.path), source);

            return;
        }

        if (source.isNull()) {
            callback(null, source);

            return;
        }

        var result = jslint(source.contents.toString('utf8'), options, globals);

        if (result.ok) {
            gulpUtil.log(colors.green(source.path));
        } else {
            gulpUtil.log(colors.red(source.path));

            errors += result.warnings.length;

            result.warnings.forEach(function (warning) {
                gulpUtil.log(colors.red('    ' +
                        (warning.line + 1) + ':' +
                        (warning.column + 1) + ': ' +
                        warning.message));
            });
        }

        callback(null, source);
    }

    function onEnd() {
        if (errors) {
            throw new gulpUtil.PluginError('gulp-jslint', errors + ' JSLint errors found.');
        }
    }

    return eventStream
        .map(lint)
        .on('end', onEnd);
};
