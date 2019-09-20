function generateResponseSchema(operation) {
  const schemas = [];

  if (operation.responses == null) {
    return;
  }

  for (const statusCode in operation.responses) {
    const responseStructure = operation.responses[statusCode];

    for (const contentType in responseStructure.content) {
      const responseContent = responseStructure.content[contentType];

      const schema = {
        type: "object",
        properties: {
          status: {
            enum: [Number(statusCode)]
          },
          data: responseContent
        }
      };

      if (contentType.headers != null) {
        schema.properties.headers = {
          type: "object",
          properties: contentType.headers
        };
      }

      schemas.push(schema);
    }
  }

  if (schemas.length == 0) {
    return;
  }

  return {
    anyOf: schemas
  };
}

module.exports = generateResponseSchema;
