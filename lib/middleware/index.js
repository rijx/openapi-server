const createRouter = require("find-my-way");

const wrapHandler = require("../framework/wrapHandler");
const getSpecOperationsArray = require("../openapi/getSpecOperationsArray");
const openAPIPathToExpress = require("../openapi/openAPIPathToExpress");

function getControllerByTagAndOperationId(operation, controllers) {
  const [primaryTag] = operation.tags || [];

  if (!primaryTag || !operation.operationId) {
    return;
  }

  const controller = controllers[primaryTag][operation.operationId];

  if (controller == null) {
    throw new Error(`Could not find controller ${primaryTag}.${operation.operationId}`)
  }

  return controller;
}

function createMiddleware(spec, controllers) {
  const router = createRouter();

  for (const { path, method, operation } of getSpecOperationsArray(spec)) {
    const vanillaHandler = getControllerByTagAndOperationId(operation, controllers);

    if (vanillaHandler == null) {
      continue;
    }

    const handler = wrapHandler(operation, vanillaHandler);

    router.on(method.toUpperCase(), openAPIPathToExpress(path), handler);
  }

  return function apiHandler(req, res, next) {
    const route = router.find(req.method, req.path);

    if (route != null) {
      req.params = route.params;

      (async () => {
        try {
          await route.handler(req, res);
        } catch (err) {
          next(err);
        }
      })();
    } else {
      next();
    }
  };
}

module.exports = createMiddleware;
