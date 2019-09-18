const Ajv = require("ajv");

const generateRequestSchema = require("../openapi/generateRequestSchema");

function createRequestValidator(operation) {
  const schema = generateRequestSchema(operation);

  if (schema == null) {
    return;
  }

  const ajv = new Ajv({
    coerceTypes: true
  });

  return function validateRequest(parsedRequest) {
    // TODO: should clone or not modify original object
    const isValid = ajv.validate(schema, parsedRequest);

    if (!isValid) {
      const error = new Error(
        ajv.errorsText(ajv.errors, { dataVar: "parameters" })
      );
      error.status = 400;
      throw error;
    }

    return parsedRequest;
  };
}

module.exports = createRequestValidator;
