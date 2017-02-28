var SpeechRecognizer = require(".");

SpeechRecognizer.Live = function LiveSpeechRecognizer(config) {
  SpeechRecognizer.call(this, config, "edu.cmu.sphinx.api.LiveSpeechRecognizer");
}

SpeechRecognizer.Live.prototype = Object.create(SpeechRecognizer.prototype);

module.exports = SpeechRecognizer.Live;
