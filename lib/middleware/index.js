const createRouter = require("find-my-way");

const defineRoutesByTagAndOperation = require("../defineRoutesByTagAndOperation");
const openAPIPathToExpress = require("../openAPIPathToExpress");

function createMiddleware(spec, controllers) {
  const router = createRouter();

  defineRoutesByTagAndOperation(
    spec,
    controllers,
    ({ path, method, handler }) => {
      router.on(method.toUpperCase(), openAPIPathToExpress(path), handler);
    }
  );

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
