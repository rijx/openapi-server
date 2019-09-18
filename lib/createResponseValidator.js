function generateResponseSchema(operation) {
  const schemas = [];

  if (operation.responses == null) {
    return;
  }

  for (const statusCode in operation.responses) {
    const responseStructure = operation.responses[statusCode];

    for (const contentType in responseStructure.content) {
      const responseContent = responseStructure.content[contentType];

      let headers;

      if (contentType.headers != null) {
        headers = {
          type: "object",
          properties: contentType.headers
        };
      }

      schemas.push({
        description: responseStructure.description,
        type: "object",
        properties: {
          status: {
            enum: [Number(statusCode)]
          },
          data: responseContent,
          headers
        }
      });
    }
  }

  if (schemas.length == 0) {
    return;
  }

  return {
    anyOf: schemas
  };
}

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
      throw new Error(ajv.errorsText());
    }

    return response;
  };
}

module.exports = createResponseValidator;
