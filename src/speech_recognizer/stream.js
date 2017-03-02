var BufferConcat = require("buffer-concat");
var Java = require("java");
var Buffer = require("safe-buffer").Buffer;
var SpeechRecognizer = require(".");

SpeechRecognizer.Stream = function StreamSpeechRecognizer() {
  SpeechRecognizer.call(this, config, "edu.cmu.sphinx.api.StreamSpeechRecognizer");
}

SpeechRecognizer.Stream.prototype = Object.create(SpeechRecognizer.prototype, {
  "startRecognition": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (readStream) {
      var nativeReadStream = Java.newInstanceSync("java.io.InputStream");
      var buffer = Buffer.alloc(0);
      var finished;

      var nativeReadStream = Java.newProxy("java.io.InputStream", {
        read: function () {
          if (finished) return -1;

          var byte = buffer[0];
          buffer = buffer.slice(1);

          return byte || 0;
        }
      });

      readStream.on("data", function (chunk) {
        buffer = BufferConcat([buffer, chunk]);
      });

      readStream.on("end", function () {
        finished = true;
      });

      SpeechRecognizer.prototype.startRecognition.call(this, nativeReadStream);
    }
  }
});

module.exports = SpeechRecognizer.Stream;
