const createFMWRouter = require("find-my-way");

const createAuthorizationChecker = require("../openapi/createAuthorizationChecker");
const createSecurityHandlers = require("../openapi/createSecurityHandlers");
const getSpecOperationsArray = require("../openapi/getSpecOperationsArray");
const openAPIPathToExpress = require("../openapi/openAPIPathToExpress");

const wrapHandler = require("./wrapHandler");

function getControllerByTagAndOperationId(operation, controllers) {
  const [primaryTag] = operation.tags || [];

  if (!primaryTag || !operation.operationId) {
    return;
  }

  const controller = controllers[primaryTag][operation.operationId];

  if (controller == null) {
    throw new Error(
      `Could not find controller ${primaryTag}.${operation.operationId}`
    );
  }

  return controller;
}

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

function createRouter(spec, controllers, authHandlers) {
  const router = createFMWRouter();
  const securityHandlers = createSecurityHandlers(spec, authHandlers);

  for (const { method, path, handler, operation } of getRoutes(
    spec,
    controllers
  )) {
    const checkAuthorization = createAuthorizationChecker(
      securityHandlers,
      operation
    );

    router.on(method, path, handler, { checkAuthorization, operation });
  }

  return router;
}

module.exports = createRouter;
