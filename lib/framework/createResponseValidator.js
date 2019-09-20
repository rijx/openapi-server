const Ajv = require("ajv");

const generateResponseSchema = require("../openapi/generateResponseSchema");

function createResponseValidator(operation) {
  const schema = generateResponseSchema(operation);

  if (schema == null) {
    return;
  }

  const ajv = new Ajv({
    coerceTypes: true
  });

  return function validateResponse(response) {
    // TODO: should clone or not modify original object
    const isValid = ajv.validate(schema, response);

    if (!isValid) {
      throw new Error(ajv.errorsText(ajv.errors, { dataVar: "response" }));
    }

    return response;
  };
}

module.exports = createResponseValidator;
