const Ajv = require("ajv");

const generateRequestSchema = require("../openapi/generateRequestSchema");

function createRequestValidator(operation) {
  const schemas = generateRequestSchema(operation);

  if (schemas == null) {
    return;
  }

  const ajv = new Ajv({
    coerceTypes: true,
    removeAdditional: true
  });

  return function validateRequest(parsedRequest, contentType = null) {
    const schema = contentType
      ? schemas.withBody[contentType.split(/;/)[0]]
      : schemas.onlyParameters;

    if (!schema) {
      const error = new Error();
      error.status = 415;
      throw error;
    }

    // TODO: should clone or not modify original object
    const isValid = ajv.validate(schema, parsedRequest);

    if (!isValid) {
      const error = new Error(ajv.errorsText(ajv.errors, { dataVar: "" }));
      error.status = 400;
      throw error;
    }

    return parsedRequest;
  };
}

module.exports = createRequestValidator;
