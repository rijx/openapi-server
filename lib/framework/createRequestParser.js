const getParameterFromRequest = require("../openapi/getParameterFromRequest");

function getJSONRequestBodySchema(operation) {
  return operation.requestBody != null &&
    operation.requestBody.content != null &&
    operation.requestBody.content["application/json"] != null &&
    operation.requestBody.content["application/json"].schema != null &&
    operation.requestBody.content["application/json"].schema.type == "object"
    ? operation.requestBody.content["application/json"].schema
    : null;
}

function createRequestDataExtractor(operation) {
  if (operation.parameters == null && operation.requestBody == null) {
    return;
  }

  const jsonRequestBodySchema = getJSONRequestBodySchema(operation);

  return function extractRequestData(req) {
    const result = {};

    for (const parameter of operation.parameters || []) {
      const value = getParameterFromRequest(parameter, req);

      result[parameter.name] = value;
    }

    if (jsonRequestBodySchema != null && req.body != null) {
      const { properties } = jsonRequestBodySchema;

      for (const key in properties) {
        result[key] = req.body[key];
      }
    }

    return result;
  };
}

module.exports = createRequestDataExtractor;
