const createRequestDataExtractor = require("./createRequestDataExtractor");
const createRequestValidator = require("./createRequestValidator");
const createResponseValidator = require("./createResponseValidator");
const createResponseSerializer = require("./createResponseSerializer");

function wrapHandler(operation, handlerFn) {
  const extractRequestData = createRequestDataExtractor(operation);
  const validateRequest = createRequestValidator(operation);
  const validateResponse = createResponseValidator(operation);
  const serializeResponse = createResponseSerializer(operation);

  return async function(req, res) {
    let requestData;

    if (extractRequestData != null) {
      requestData = await extractRequestData(req);

      if (validateRequest != null && !validateRequest(requestData)) {
        res.writeHead(400);
        res.end();

        return;
      }
    }

    let response = await Promise.resolve(handlerFn(requestData, req));

    // TODO: support streams

    if (validateResponse != null) {
      const validationRequest = validateResponse(response);

      if (validationRequest.error != null) {
        throw validationRequest.error;
      }

      response = validationRequest.response;
    }

    if (serializeResponse != null) {
      response = serializeResponse(response);
    }

    res.writeHead(response.status, response.headers);
    res.end(response.data);
  };
}

function defineRoutesByTagAndOperation(spec, controllers, defineFn) {
  for (const path in spec.paths) {
    const operations = spec.paths[path];

    for (const method in operations) {
      const operation = operations[method];

      const [primaryTag] = operation.tags || [];

      if (!primaryTag || !operation.operationId) {
        continue;
      }

      const vanillaHandler = controllers[primaryTag][operation.operationId];

      const handler = wrapHandler(operation, vanillaHandler);

      // TODO: this can be express, koa-router, find-my-way, etc
      defineFn({
        path,
        method,
        handler
      });
    }
  }
}

module.exports = defineRoutesByTagAndOperation;
