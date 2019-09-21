const { response } = require("../../../lib/framework/response");

function helloWorld({ name, ["User-Agent"]: userAgent, x }, req) {
  const message = `Hello ${name}! You're on ${req.path} (Your IP is ${req.connection.remoteAddress} and your User-Agent is ${userAgent}, x = ${x})\n`;

  return response({ message });
}

module.exports = {
  helloWorld
};
