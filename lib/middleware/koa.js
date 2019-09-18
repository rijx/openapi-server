const createRouter = require("../framework/createRouter");

function createMiddleware(spec, controllers) {
  const router = createRouter(spec, controllers);

  return function apiHandler(ctx, next) {
    const route = router.find(req.method, req.path);

    if (route != null) {
      req.params = route.params;

      return route.handler(ctx.req, ctx.res);
    } else {
      return next();
    }
  };
}

module.exports = createMiddleware;
