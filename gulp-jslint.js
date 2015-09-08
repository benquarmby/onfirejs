'use strict';

var eventStream = require('event-stream');
var gulpUtil = require('gulp-util');
var jslint = require('./jslint.js');
var colors = require('colors/safe');

function logWarning(warning) {
    var message = [
        '    ',
        warning.line + 1,
        ':',
        warning.column + 1,
        ': ',
        warning.message
    ];

    gulpUtil.log(colors.red(message.join('')));
}

function lintStream(options, globals) {
    var errors = 0;

    function lint(source, callback) {
        var contents = source.contents.toString('utf8');
        var result = jslint(contents, options, globals);

        if (result.ok) {
            gulpUtil.log(colors.green(source.path));
        } else {
            gulpUtil.log(colors.red(source.path));

            errors += result.warnings.length;

            result.warnings.forEach(logWarning);
        }

        callback(null, source);
    }

    function onEnd() {
        if (errors) {
            var message = errors === 1
                ? 'JSLint found one error.'
                : 'JSLint found ' + errors + ' errors.';

            throw new gulpUtil.PluginError('gulp-jslint', message);
        }
    }

    return eventStream
        .map(lint)
        .on('end', onEnd);
}

module.exports = lintStream;
