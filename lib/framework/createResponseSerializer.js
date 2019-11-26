const fastJson = require("fast-json-stringify");

const generateResponseSchemas = require("../openapi/generateResponseSchemas");

function createResponseDataSerializers(operation) {
  const serializers = {};

  const schemas = generateResponseSchemas(operation);

  for (const statusCode in schemas) {
    const schemasForStatusCode = schemas[statusCode];

    if (schemasForStatusCode.json != null) {
      try {
        serializers[statusCode] = fastJson(schemasForStatusCode.json);
      } catch (err) {
        err.message = `Could not create JSON serializer for ${
          operation.tags[0]
        }.${
          operation.operationId
        }.responses[${statusCode}].content['application/json']: ${err.message}`;

        throw err;
      }
    }
  }

  return serializers;
}

function createResponseSerializer(operation) {
  const serializers = createResponseDataSerializers(operation);

  return function responseSerializer(response) {
    const result = {
      ...(response || {}),
      headers: {}
    };

    if (!result.status) {
      if (result.data != null) {
        result.status = 200;
      } else if (response) {
        result.status = 204;
      } else {
        result.status = 404;
      }
    }

    if (response.headers != null) {
      for (const name in response.headers) {
        const value = response.headers[name];

        result.headers[name.toLowerCase()] = value;
      }
    }

    const contentType = result.headers["content-type"];

    if (
      contentType == "application/json" ||
      (contentType != null && contentType.startsWith("application/json;")) ||
      (contentType == null && typeof result.data == "object")
    ) {
      const serializer = serializers[result.status];

      if (serializer != null) {
        result.data = serializer(result.data);
      } else {
        throw new Error(
          `Expected responses[${result.status}].content['application/json'].schema to be defined`
        );
      }
    }

    return result;
  };
}

module.exports = createResponseSerializer;
