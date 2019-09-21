function generateResponseSchemas(operation) {
  const schemas = {};

  if (operation.responses == null) {
    return;
  }

  for (const statusCode in operation.responses) {
    const responseDefinition = operation.responses[statusCode];

    schemas[statusCode] = {};

    if (responseDefinition.headers != null) {
      schemas[statusCode].headers = {
        type: "object",
        properties: responseDefinition.headers
      };
    }

    const jsonContent = responseDefinition.content["application/json"];

    if (jsonContent != null) {
      schemas[statusCode].json = jsonContent.schema;
    }
  }

  return schemas;
}

module.exports = generateResponseSchemas;
