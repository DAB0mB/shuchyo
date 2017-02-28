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
        this._events.set(handlers);
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
        this._events.set(handlers);
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
    value: function (phrase, args) {
      this._events.enteries().forEach(function (entery) {
        var pattern = entery[0];
        var handlers = entery[1];
        var matches = phrase.match(pattern);

        if (!matches) return;

        args = args.concat(matches);

        handlers.values().forEach(function (handler) {
          handler.apply(null, args);
        });
      });
    }
  },
});

module.exports = SpeechListener;
