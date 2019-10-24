const toJsonSchema = require("openapi-schema-to-json-schema");

function toJsonSchemaInput(schema) {
  const inputSchema = toJsonSchema(schema, { removeReadOnly: true });

  delete inputSchema.$schema;

  return inputSchema;
}

function generateRequestSchema(operation) {
  const parameterProperties = {};

  if (operation.parameters != null) {
    for (const parameter of operation.parameters) {
      parameterProperties[parameter.name] = toJsonSchemaInput(
        parameter.schema || {
          type: "string"
        }
      );
    }
  }

  const requiredParameterNames = (operation.parameters || [])
    .filter(x => x.required)
    .map(x => x.name);

  const schemas = {
    onlyParameters: {
      type: "object",
      properties: parameterProperties,
      required: requiredParameterNames
    },
    withBody: {}
  };

  if (operation.requestBody && operation.requestBody.content) {
    for (const contentType in operation.requestBody.content) {
      const contentTypeBody = operation.requestBody.content[contentType];

      if (!contentTypeBody.schema) {
        continue;
      }

      let requestBodySchema;

      if (contentTypeBody.schema.type == "object") {
        requestBodySchema = toJsonSchemaInput(contentTypeBody.schema);
      } else {
        requestBodySchema = {
          type: "object",
          properties: {
            requestBody: toJsonSchemaInput(contentTypeBody.schema)
          },
          required: ["requestBody"]
        };
      }

      schemas.withBody[contentType] = {
        ...requestBodySchema,
        type: "object",
        properties: {
          ...parameterProperties,
          ...requestBodySchema.properties
        },
        required: requiredParameterNames.concat(
          requestBodySchema.required || []
        )
      };
    }
  }

  return schemas;
}

module.exports = generateRequestSchema;
