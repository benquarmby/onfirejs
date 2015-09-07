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

        function removeByIndex(index) {
            delete listeners[index];
        }

        function removeByReference(reference) {
            listeners.forEach(function (listener, index) {
                if (listener === reference) {
                    removeByIndex(index);
                }
            });
        }

        function addListener(listener) {
            var index = listeners.length;
            listeners[index] = listener;

            return function () {
                removeByIndex(index);
            };
        }

        function fireEvent(data) {
            listeners.forEach(function (listener) {
                listener(data);
            });
        }

        target.on[event] = addListener;
        target.off[event] = removeByReference;
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
        var definitions = [];

        function removeByIndex(index) {
            definitions[index].remover();

            delete definitions[index];
        }

        function removeByReference(event, listener) {
            definitions.forEach(function (definition, index) {
                if (definition.listener === listener && definition.event === event) {
                    removeByIndex(index);
                }
            });
        }

        function addListener(event, listener) {
            var remover = event(listener);
            var index = definitions.length;

            definitions[index] = {
                event: event,
                listener: listener,
                remover: remover
            };

            return function () {
                removeByIndex(index);
            };
        }

        function dispose() {
            definitions.forEach(function (ignore, index) {
                removeByIndex(index);
            });

            definitions = null;
        }

        return {
            on: addListener,
            off: removeByReference,
            dispose: dispose
        };
    }

    exports.createEvents = createEvents;
    exports.createContext = createContext;
}));
