const getParameterFromRequest = require("../openapi/getParameterFromRequest");

function createRequestDataExtractor(operation) {
  if (operation.parameters == null) {
    return;
  }

  return function extractRequestData(req) {
    const result = {};

    for (const parameter of operation.parameters) {
      const value = getParameterFromRequest(parameter, req);

      result[parameter.name] = value;
    }

    return result;
  };
}

module.exports = createRequestDataExtractor;
