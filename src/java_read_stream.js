var Stream = require("stream");

var MAX_CHUNK_SIZE = Buffer.poolSize * 8;

function JavaReadStream(nativeReadStream) {
  Stream.Readable.call(this);

  this._nativeReadStream = nativeReadStream;
}

JavaReadStream.prototype = Object.create(Stream.Readable.prototype, {
  "_read": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (size) {
      var self = this;
      var chunk = "";
      var promise;

      var syncStreams = function (byte) {
        if (!size-- || byte == -1) {
          self._readStream.push(chunk || null);
          return;
        }

        var char = String.fromCharCode(byte);
        chunk += char;

        if (chunk.length == MAX_CHUNK_SIZE) {
          self._readStream.push(chunk);
          chunk = "";
        }

        promise = promise.then(syncStreams);
        return self._nativeReadStream.readPromise();
      };

      promise = this._nativeReadStream.readPromise().then(syncStreams);
    }
  }
});

module.exports = JavaReadStream;
