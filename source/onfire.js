/*!
   Copyright 2015 Ben Quarmby

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
!*/

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
