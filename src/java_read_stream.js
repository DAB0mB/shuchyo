var Java = require("java");
var Buffer = require("safe-buffer").Buffer;
var Stream = require("stream");

function JavaReadStream(nativeReadStream) {
  Stream.Readable.call(this);

  this._nativeReadStream = nativeReadStream;
}

JavaReadStream.prototype = Object.create(Stream.Readable.prototype, {
  "_read": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (maxSize) {
      // word
      maxSize *= 4;

      var self = this;
      var buffer = Array.apply(null, { length: maxSize }).map(Number.bind(null, 0));
      var nativeBuffer = Java.newArray("byte", buffer);

      self._nativeReadStream.readPromise(nativeBuffer).then(function (size) {
        if (size == -1) self.push(null);

        var chunk = Buffer.from(nativeBuffer).slice(0, size);
        self.push(chunk);
      });
    }
  }
});

module.exports = JavaReadStream;
