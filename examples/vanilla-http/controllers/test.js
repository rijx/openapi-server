const { response } = require("../../../lib/openapi/response");

function helloWorld({ name, ["User-Agent"]: userAgent, x }, req) {
  return response({
    message: `Hello ${name}! You're on ${req.path} (Your IP is ${req.connection.remoteAddress} and your User-Agent is ${userAgent}, x = ${x})`
  });
}

module.exports = {
  helloWorld
};
