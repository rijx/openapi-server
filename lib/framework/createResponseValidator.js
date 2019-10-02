const Ajv = require("ajv");

const generateResponseSchemas = require("../openapi/generateResponseSchemas");

function createResponseValidator(operation) {
  const schemas = generateResponseSchemas(operation);

  if (schemas == null) {
    return;
  }

  const ajv = new Ajv({
    coerceTypes: true
  });

  return function validateResponse(response) {
    const statusCode =
      (response && response.status) ||
      (response && response.data != null ? 200 : 404);

    const schema = schemas[statusCode];

    if (schema == null) {
      throw new Error(`Unexpected status code: ${statusCode}`);
    }

    // TODO: should clone or not modify original object
    const isValid = ajv.validate(schema, response);

    if (!isValid) {
      throw new Error(ajv.errorsText(ajv.errors, { dataVar: "response" }));
    }

    return response;
  };
}

module.exports = createResponseValidator;
