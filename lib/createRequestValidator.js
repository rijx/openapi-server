const Ajv = require("ajv");

function generateRequestSchema(operation) {
  const parameterProperties = {};

  if (operation.parameters != null) {
    for (const parameter of operation.parameters) {
      parameterProperties[parameter.name] = parameter.schema || {
        type: "string"
      };
    }
  }

  const requiredParameterNames = operation.parameters
    .filter(x => x.required)
    .map(x => x.name);

  if (
    operation == null ||
    operation.requestBody == null ||
    operation.requestBody.content == null
  ) {
    return {
      type: "object",
      properties: parameterProperties,
      required: requiredParameterNames
    };
  }

  const schemas = [];

  for (const contentType in operation.requestBody.content) {
    const contentTypeBody = operation.requestBody.content[contentType];

    let requestBodyProperties = {};

    if (contentTypeBody.type == "object") {
      requestBodyProperties = contentTypeBody.properties || {};
    } else {
      requestBodyProperties = {
        requestBody: contentTypeBody
      };
    }

    schemas.push({
      type: "object",
      properties: {
        ...parameterProperties,
        ...requestBodyProperties
      },
      required: requiredParameterNames
    });
  }

  return {
    anyOf: schemas
  };
}

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
      const error = new Error(ajv.errorsText());
      error.status = 400;
      throw error;
    }

    return parsedRequest;
  };
}

module.exports = createRequestValidator;
