var Fs = require("fs");
var Java = require("java");

function Microphone() {
  this._nativeMicrophone = Java.newInstanceSync("edu.cmu.sphinx.api.Microphone");
  this._readStream = Fs.createReadStream();
}

Microphone.prototype = Object.create(Object.prototype, {
  "startRecording": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function () {
      return this._nativeMicrophone.startRecordingPromise();
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
      var self = this;
      var chunkSize = Buffer.poolSize * 8;
      var nativeReadStream = this._nativeMicrophone.getStreamSync();
      var chunk = "";
      var promise;

      var syncStreams = function (byte) {
        if (byte == -1) {
          self._readStream.push(chunk || null);
          return;
        }

        var char = String.fromCharCode(byte);
        chunk += char;

        if (chunk.length >= chunkSize) {
          self._readStream.push(chunk);
          chunk = "";
        }

        promise = promise.then(syncStreams);
        return nativeReadStream.readPromise();
      };

      promise = nativeReadStream.readPromise().then(syncStreams);
      return this._readStream;
    }
  }
});

module.exports = Microphone;
