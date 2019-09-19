const createRouter = require("../framework/createRouter");

function createMiddleware(spec, controllers, authHandlers) {
  const router = createRouter(spec, controllers, authHandlers);

  return function apiHandler(req, res, next) {
    const route = router.find(req.method, req.path);

    if (route != null) {
      req.params = route.params;

      (async () => {
        try {
          if (route.store.checkAuthorization != null) {
            const isAuthorized = await route.store.checkAuthorization(req);

            if (!isAuthorized) {
              res.writeHead(401);
              res.end();

              return;
            }
          }

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
