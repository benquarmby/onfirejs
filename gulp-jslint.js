'use strict';

var eventStream = require('event-stream');
var gulpUtil = require('gulp-util');
var colors = require('colors/safe');
var vm = require('vm');
var fs = require('fs');

var pluginName = 'gulp-jslint';
var context = {};

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
        var result = context.jslint(contents, options, globals);

        if (result.ok) {
            gulpUtil.log(colors.green(source.path));
        } else {
            gulpUtil.log(colors.red(source.path));

            errors += result.warnings.length;

            result.warnings.forEach(logWarning);
        }

        callback(null, source);
    }

    function map(source, callback) {
        if (context.jslint) {
            lint(source, callback);

            return;
        }

        fs.readFile('./jslint/jslint.js', 'utf8', function (err, jslint) {
            if (err) {
                throw new gulpUtil.PluginError(pluginName, err);
            }

            vm.runInNewContext(jslint, context);

            lint(source, callback);
        });
    }

    function onEnd() {
        if (errors) {
            var message = errors === 1
                ? 'JSLint found one error.'
                : 'JSLint found ' + errors + ' errors.';

            throw new gulpUtil.PluginError(pluginName, message);
        }
    }

    return eventStream
        .map(map)
        .on('end', onEnd);
}

module.exports = lintStream;
