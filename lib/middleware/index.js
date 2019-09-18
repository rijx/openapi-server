const createRouter = require("../framework/createRouter");

function createMiddleware(spec, controllers) {
  const router = createRouter(spec, controllers);

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
