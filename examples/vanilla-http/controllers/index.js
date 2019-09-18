const fs = require("fs");

module.exports = {};

for (const fileName of fs.readdirSync(__dirname)) {
  if (fileName != "index.js") {
    const name = fileName.replace(/\.js$/, "");

    module.exports[name] = require(`./${fileName}`);
  }
}
