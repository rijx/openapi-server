const getControllerByTagAndOperationId = require("../openapi/getControllerByTagAndOperationId");
const getSpecOperationsArray = require("../openapi/getSpecOperationsArray");
const openAPIPathToExpress = require("../openapi/openAPIPathToExpress");

const wrapHandler = require("./wrapHandler");

function getRoutes(spec, controllers) {
  const results = [];

  for (const { path, method, operation } of getSpecOperationsArray(spec)) {
    const vanillaHandler = getControllerByTagAndOperationId(
      operation,
      controllers
    );

    if (vanillaHandler == null) {
      continue;
    }

    results.push({
      method: method.toUpperCase(),
      path: openAPIPathToExpress(path),
      handler: wrapHandler(operation, vanillaHandler),
      operation
    });
  }

  return results;
}

module.exports = getRoutes;
