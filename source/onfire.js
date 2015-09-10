/*global define, window*/

(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(module.exports);
    } else {
        window.onfire = {};
        factory(window.onfire);
    }
}(function (exports) {
    'use strict';

    function createEvent(target, event) {
        var listeners = [];
        var removers = [];

        function removeByIndex(index) {
            delete listeners[index];
            delete removers[index];
        }

        function createRemover(index) {
            function remove() {
                removeByIndex(index);
            }

            remove.isRemover = true;
            removers[index] = remove;

            return remove;
        }

        function eventOn(listener) {
            if (typeof listener !== 'function') {
                throw new Error('The specified listener is not a function.');
            }

            var index = listeners.indexOf(listener);

            if (index >= 0) {
                return removers[index];
            }

            index = listeners.length;
            listeners[index] = listener;

            return createRemover(index);
        }

        function eventOff(reference) {
            var index = listeners.indexOf(reference);

            if (index >= 0) {
                removeByIndex(index);
            }
        }

        function fireEvent(data) {
            listeners.forEach(function (listener) {
                listener(data);
            });
        }

        target.on[event] = eventOn;
        target.off[event] = eventOff;
        target.fire[event] = fireEvent;
    }

    function createEvents(events) {
        var target = {
            on: {},
            off: {},
            fire: {}
        };

        events.forEach(function (event) {
            createEvent(target, event);
        });

        return target;
    }

    function createContext() {
        var removers = [];

        function add(event, listener) {
            var remover = event(listener);

            removers.push(remover);

            return remover;
        }

        function dispose() {
            removers.forEach(function (remover) {
                remover();
            });

            removers = null;
        }

        return {
            add: add,
            dispose: dispose
        };
    }

    exports.createEvents = createEvents;
    exports.createContext = createContext;
}));
