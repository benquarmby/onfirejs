/*global describe, it, expect*/

var onfire = require('./onfire.js');

describe('onfire', function () {
    'use strict';

    describe('createEvents', function () {
        it('should create on methods for the specified events', function () {
            var actual = onfire.createEvents(['beforeEmailSend', 'emailSend']);

            expect(typeof actual.on.beforeEmailSend).toBe('function');
            expect(typeof actual.on.emailSend).toBe('function');
        });

        it('should create off methods for the specified events', function () {
            var actual = onfire.createEvents(['stateSave', 'afterStateSave']);

            expect(typeof actual.off.stateSave).toBe('function');
            expect(typeof actual.off.afterStateSave).toBe('function');
        });

        it('should create fire methods for the specified events', function () {
            var actual = onfire.createEvents(['mouseEnter', 'mouseLeave', 'click', 'doubleClick']);

            expect(typeof actual.fire.mouseEnter).toBe('function');
            expect(typeof actual.fire.mouseLeave).toBe('function');
            expect(typeof actual.fire.click).toBe('function');
            expect(typeof actual.fire.doubleClick).toBe('function');
        });
    });
});
