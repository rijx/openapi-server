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

module.exports = generateRequestSchema;
