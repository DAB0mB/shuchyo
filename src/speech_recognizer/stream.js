var Promise = require("bluebird");
var Fs = require("fs");
var Java = require("java");
var Tmp = require("tmp");
var SpeechRecognizer = require(".");

SpeechRecognizer.Stream = function StreamSpeechRecognizer(config) {
  SpeechRecognizer.call(this, config, "edu.cmu.sphinx.api.StreamSpeechRecognizer");
}

SpeechRecognizer.Stream.prototype = Object.create(SpeechRecognizer.prototype, {
  "startRecognition": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (readStream) {
      var self = this;

      var createTempFile = Promise.promisify(Tmp.file, {
        multiArgs: true
      });

      var removeTempFile;

      createTempFile().then(function (results) {
        var tempFilePath = results[0];
        removeTempFile = Promise.promisify(results[2]);
        var writeStream = Fs.createWriteStream(tempFilePath);
        readStream.pipe(writeStream);
        return Java.newInstancePromise("java.io.File", tempFilePath);
      })
      .then(function (nativeFile) {
        return Java.newInstancePromise("java.io.FileInputStream", nativeFile);
      })
      .then(function (nativeReadStream) {
        return SpeechRecognizer.prototype.startRecognition.call(self, nativeReadStream);
      })
      .then(function () {
        return removeTempFile();
      });
    }
  }
});

module.exports = SpeechRecognizer.Stream;
