const createRequestDataExtractor = require("./createRequestParser");
const createRequestValidator = require("./createRequestValidator");
const createResponseValidator = require("./createResponseValidator");
const createResponseSerializer = require("./createResponseSerializer");

function wrapHandler(operation, handlerFn) {
  try {
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

      if (validateResponse != null) {
        validateResponse(response);
      }

      if (serializeResponse != null) {
        response = serializeResponse(response);
      }

      res.writeHead(response.status, response.headers);

      if (response.data && response.data.pipe) {
        response.data.pipe(res);
      } else {
        res.end(response.data);
      }
    };
  } catch (err) {
    throw new Error(
      `The following error occurred when preparing ${operation.tags[0]}.${
        operation.operationId
      }: ${err.message}`
    );
  }
}

module.exports = wrapHandler;
