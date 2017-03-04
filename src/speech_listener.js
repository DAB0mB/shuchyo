var Map = require("es6-map");

function SpeechListener() {
  this._events = new Map();
  this._handlers = new Map();
}

SpeechListener.prototype = Object.create(Object.prototype, {
  "on": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (pattern, handler) {
      var handlers = this._events.get(pattern);

      if (!handlers) {
        handlers = new Map();
        this._events.set(pattern, handlers);
      }

      handlers.set(handler, handler);
    }
  },

  "once": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (pattern, handler) {
      var self = this;

      var wrappedHandler = function () {
        self.off(pattern, handler);
        handler.apply(null, arguments);
      };

      var handlers = this._events.get(pattern);

      if (!handlers) {
        handlers = new Map();
        this._events.set(pattern, handlers);
      }

      handlers.set(handler, wrappedHandler);
    }
  },

  "off": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (pattern, handler) {
      if (handler) {
        var handlers = this._events.get(pattern);
        if (handlers) handlers.delete(handler);
      }
      else {
        this._events.delete(pattern);
      }
    }
  },

  "trigger": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (phrase) {
      var args = [].slice.call(arguments, 1);
      var exists = false;

      this._events.forEach(function (handlers, pattern) {
        pattern = new RegExp(pattern, "i");
        var matches = phrase.match(pattern);

        if (!matches) return;

        exists = true;
        args = args.concat(matches);

        handlers.forEach(function (handler) {
          handler.apply(null, args);
        });
      });

      return exists;
    }
  },
});

module.exports = SpeechListener;
