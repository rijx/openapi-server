const createRouter = require("../framework/createRouter");

function createMiddleware(spec, controllers, authHandlers) {
  const router = createRouter(spec, controllers, authHandlers);

  return async function apiHandler(ctx, next) {
    const route = router.find(ctx.method, ctx.path);

    if (route != null) {
      ctx.req.params = route.params;

      if (route.store.checkAuthorization != null) {
        const isAuthorized = await route.store.checkAuthorization(ctx.req);

        if (!isAuthorized) {
          ctx.throw(401);
        }
      }

      return route.handler(ctx.request, ctx.res);
    } else {
      return next();
    }
  };
}

module.exports = createMiddleware;
