var Java = require("java");
var JSONStorage = require("node-localstorage").JSONStorage;
var Maven = require("node-java-maven");
var Path = require("path");

var mavenResultsDir = Path.resolve(__dirname, "..");
var mavenResultsFileName = "maven_results.json";
var mavenResultsStorage = new JSONStorage(mavenResultsDir);

function main(argv) {
  if (argv.indexOf("install") != -1) {
    installPackages();
    console.log("\n  Java packages installation complete!\n")
  }
}

function installPackages() {
  Maven(function (error, mavenResults) {
    if (error) throw error;

    mavenResultsStorage.setItem(mavenResultsFileName, mavenResults);
  });
}

if (require.main === module) main(process.argv.slice(2));

module.exports = {
  install: installPackages
};
