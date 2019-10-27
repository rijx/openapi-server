const getParameterFromRequest = require("../openapi/getParameterFromRequest");

function createRequestDataExtractor(operation) {
  if (
    operation.parameters == null &&
    (operation.requestBody == null || operation.requestBody.content == null)
  ) {
    return;
  }

  return function extractRequestData(req) {
    const result = {};

    for (const parameter of operation.parameters || []) {
      const value = getParameterFromRequest(parameter, req);

      result[parameter.name] = value;
    }

    if (operation.requestBody && operation.requestBody.content) {
      const contentType = (req.headers["content-type"] || "").split(/;/)[0];

      const requestBodyForContentType =
        operation.requestBody.content[contentType];

      if (requestBodyForContentType) {
        if (
          requestBodyForContentType.schema &&
          requestBodyForContentType.schema.type == "object"
        ) {
          const { properties } = requestBodyForContentType.schema;

          for (const key in properties) {
            result[key] = req.body[key];
          }
        } else {
          result.requestBody = req;
        }
      }
    }

    return result;
  };
}

module.exports = createRequestDataExtractor;
