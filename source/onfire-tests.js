/*global jasmine, describe, it, expect*/

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

    describe('createContext', function () {
        it('should invoke listeners added to underlying events', function () {
            var showEvents = onfire.createEvents(['shown']);
            var hideEvents = onfire.createEvents(['hidden']);
            var onShown = jasmine.createSpy('onShown');
            var onHidden = jasmine.createSpy('onHidden');

            var context = onfire.createContext();

            context.add(showEvents.on.shown, onShown);
            context.add(hideEvents.on.hidden, onHidden);

            showEvents.fire.shown();
            hideEvents.fire.hidden();

            expect(onShown).toHaveBeenCalled();
            expect(onHidden).toHaveBeenCalled();
        });

        it('should not invoke manually removed listeners', function () {
            var showEvents = onfire.createEvents(['shown']);
            var hideEvents = onfire.createEvents(['hidden']);
            var onShown = jasmine.createSpy('onShown');
            var onHidden = jasmine.createSpy('onHidden');

            var context = onfire.createContext();

            context.add(showEvents.on.shown, onShown);
            context.add(hideEvents.on.hidden, onHidden);

            hideEvents.off.hidden(onHidden);

            showEvents.fire.shown();
            hideEvents.fire.hidden();

            expect(onShown).toHaveBeenCalled();
            expect(onHidden).not.toHaveBeenCalled();
        });

        it('should not invoke auto removed listeners', function () {
            var showEvents = onfire.createEvents(['shown']);
            var hideEvents = onfire.createEvents(['hidden']);
            var onShown = jasmine.createSpy('onShown');
            var onHidden = jasmine.createSpy('onHidden');

            var context = onfire.createContext();

            var offShown = context.add(showEvents.on.shown, onShown);
            context.add(hideEvents.on.hidden, onHidden);

            offShown();

            showEvents.fire.shown();
            hideEvents.fire.hidden();

            expect(onShown).not.toHaveBeenCalled();
            expect(onHidden).toHaveBeenCalled();
        });

        it('should not throw when removing multiple times', function () {
            var showEvents = onfire.createEvents(['shown']);
            var onShown = jasmine.createSpy('onShown');

            var context = onfire.createContext();

            var offShown = context.add(showEvents.on.shown, onShown);
            offShown();
            showEvents.off.shown(onShown);
            context.dispose();

            showEvents.fire.shown();

            expect(onShown).not.toHaveBeenCalled();
        });
    });

    it('should invoke event listener', function () {
        var actual = onfire.createEvents(['shown']);
        var onActualShown = jasmine.createSpy('onShown');

        actual.on.shown(onActualShown);
        actual.fire.shown();

        expect(onActualShown).toHaveBeenCalled();
    });

    it('should not invoke auto removed listener', function () {
        var actual = onfire.createEvents(['shown']);
        var onActualShown = jasmine.createSpy('onShown');

        var off = actual.on.shown(onActualShown);
        off();
        actual.fire.shown();

        expect(onActualShown).not.toHaveBeenCalled();
    });

    it('should not invoke manually removed listener', function () {
        var actual = onfire.createEvents(['shown']);
        var onActualShown = jasmine.createSpy('onShown');

        actual.on.shown(onActualShown);
        actual.off.shown(onActualShown);
        actual.fire.shown();

        expect(onActualShown).not.toHaveBeenCalled();
    });
});
