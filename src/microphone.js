var Fs = require("fs");
var Java = require("java");
var JavaReadStream = require("./java_read_stream");

function Microphone(config) {
  this._nativeMicrophone = Java.newInstanceSync("edu.cmu.sphinx.api.Microphone",
    config.sampleRate,
    config.sampleSize,
    config.signed,
    config.bigEndian
  );

  var nativeReadStream = this._nativeMicrophone.getStream();
  this._readStream = new JavaReadStream(nativeReadStream);
}

Microphone.prototype = Object.create(Object.prototype, {
  "startRecording": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function () {
      var self = this;

      return this._nativeMicrophone.startRecordingPromise().then(function () {
        self._readStream.read(Infinity);
      });
    }
  },

  "stopRecording": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function () {
      return this._nativeMicrophone.stopRecordingPromise();
    }
  },

  "stream": {
    enumerable: true,
    configurable: true,
    get: function () {
      return this._readStream;
    }
  }
});

module.exports = Microphone;
