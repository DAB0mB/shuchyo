var Java = require("java");
var SpeechListener = require("../speech_listener");

function SpeechRecognizer(config, javaClass) {
  SpeechListener.apply(this, arguments);

  var nativeConfig = Java.newInstanceSync("edu.cmu.sphinx.api.Configuration");
  if (config.acousticmodelpath)
    nativeConfig.setAcousticmodelpath(config.acousticmodelpath);
  if (config.dictionarypath)
    nativeConfig.setDictionarypath(config.dictionarypath);
  if (config.grammarname)
    nativeConfig.setGrammarname(config.grammarname);
  if (config.grammarpath)
    nativeConfig.setGrammarpath(config.grammarpath);
  if (config.languagemodelpath)
    nativeConfig.setLanguagemodelpath(config.languagemodelpath);
  if (config.usegrammar)
    nativeConfig.setUsegrammar(config.usegrammar);

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
      var promise = this._nativeSpeechRecognizer.startRecognitionPromise
        .apply(_nativeSpeechRecognizer, arguments);

      var handleResult = function (nativeResult) {
        if (nativeResult == null) return;

        var iterator = result.getLattice().allPaths().iterator();
        var selection = this.selectivity;

        while (iterator.hasNext() && selection--) {
          var path = iterator.next();
          this.trigger(path);
        }

        this._nativeSpeechRecognizer().getResultPromise().then(handleResult);
      };

      promise.then(function () {
        this._nativeSpeechRecognizer().getResultPromise().then(handleResult);
      });

      return promise;
    }
  },

  "stopRecognition": {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (event, handler) {
      return this._nativeSpeechRecognizer.startRecognitionPromise
        .apply(this._nativeSpeechRecognizer, arguments);
    }
  }
});

module.exports = SpeechRecognizer;
