var Java = require("java");
var SpeechListener = require("../speech_listener");

function SpeechRecognizer(config, javaClass) {
  SpeechListener.apply(this, arguments);

  var nativeConfig = Java.newInstanceSync("edu.cmu.sphinx.api.Configuration");
  if (config.acousticModelPath)
    nativeConfig.setAcousticModelPath(config.acousticModelPath);
  if (config.dictionaryPath)
    nativeConfig.setDictionaryPath(config.dictionaryPath);
  if (config.grammarName)
    nativeConfig.setGrammarName(config.grammarName);
  if (config.grammarPath)
    nativeConfig.setGrammarpath(config.grammarPath);
  if (config.languageModelPath)
    nativeConfig.setLanguageModelPath(config.languageModelPath);
  if (config.useGrammar)
    nativeConfig.setUseGrammar(config.useGrammar);

  this._nativeSpeechRecognizer = Java.newInstanceSync(javaClass, nativeConfig);
  this._selectivity = config.selectivity || Infinity;
}

SpeechRecognizer.SENTENCE_MARKS = {
  get NOISE() { return "[NOISE]" },
  get SILENCE() { return "<sil>" },
  get SENTENCE() { return { start: "<s>", end: "</s>" } }
};

SpeechRecognizer.prototype = Object.create(SpeechListener.prototype, {
  "startRecognition": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function () {
      var self = this;

      var promise = this._nativeSpeechRecognizer.startRecognitionPromise
        .apply(this._nativeSpeechRecognizer, arguments);

      var handleResult = function (nativeResult) {
        if (nativeResult == null) {
          self.stopRecognition();
          return;
        }

        var iterator = nativeResult.getLattice().allPaths().iterator();
        var selection = self._selectivity;

        while (iterator.hasNext() && selection--) {
          var path = iterator.next();
          if (self.trigger(path)) break;
        }

        self._nativeSpeechRecognizer.getResultPromise().then(handleResult);
      };

      promise.then(function () {
        self._nativeSpeechRecognizer.getResultPromise().then(handleResult);
      });

      return promise;
    }
  },

  "stopRecognition": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (event, handler) {
      return this._nativeSpeechRecognizer.stopRecognitionPromise
        .apply(this._nativeSpeechRecognizer, arguments);
    }
  }
});

module.exports = SpeechRecognizer;

require("./live");
require("./stream");
