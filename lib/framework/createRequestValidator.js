const Ajv = require("ajv");
const isStream = require("is-stream");

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

    let newSchema = { ...schema };

    if (newSchema.type == "object" && newSchema.properties) {
      for (const key in newSchema.properties) {
        const propertySchema = newSchema.properties[key];

        if (
          propertySchema.type == "string" &&
          propertySchema.format == "binary"
        ) {
          const value = parsedRequest[key];

          if (!Buffer.isBuffer(value) && !isStream(value)) {
            const error = new Error(`.${key} is not binary`);
            error.status = 400;
            throw error;
          }

          delete newSchema.properties[key];
        }
      }
    }

    // TODO: should clone or not modify original object
    const isValid = ajv.validate(newSchema, parsedRequest);

    if (!isValid) {
      const error = new Error(ajv.errorsText(ajv.errors, { dataVar: "" }));
      error.status = 400;
      throw error;
    }

    return parsedRequest;
  };
}

module.exports = createRequestValidator;
