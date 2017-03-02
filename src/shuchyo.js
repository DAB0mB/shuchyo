var Promise = require("bluebird");
var Java = require("java");
var JSONStorage = require("node-localstorage").JSONStorage;
var Path = require("path");

var mavenResultsDir = Path.resolve(__dirname, "..");
var mavenResultsFileName = "maven_results.json";
var mavenResultsStorage = new JSONStorage(mavenResultsDir);
var mavenResults = mavenResultsStorage.getItem(mavenResultsFileName);

Java.asyncOptions = {
  asyncSuffix: "Callback",
  syncSuffix: "",
  promiseSuffix: "Promise",
  promisify: Promise.promisify
};

mavenResults.classpath.forEach(function (classpath) {
  Java.classpath.push(classpath);
});

module.exports = {
  Microphone: require("./microphone"),
  SpeechListener: require("./speech_listener"),
  SpeechRecognizer: require("./speech_recognizer")
};
