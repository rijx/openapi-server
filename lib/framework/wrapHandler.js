const createRequestDataExtractor = require("./createRequestParser");
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

      if (validateRequest != null) {
        const contentType = req.headers["content-type"];

        validateRequest(requestData, contentType);
      }
    }

    let response = await Promise.resolve(handlerFn(requestData, req));

    // TODO: support streams

    if (validateResponse != null) {
      validateResponse(response);
    }

    if (serializeResponse != null) {
      response = serializeResponse(response);
    }

    res.writeHead(response.status, response.headers);
    res.end(response.data);
  };
}

module.exports = wrapHandler;
