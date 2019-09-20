const createFMWRouter = require("find-my-way");

const createAuthorizationChecker = require("../openapi/createAuthorizationChecker");
const createSecurityHandlers = require("../openapi/createSecurityHandlers");

const getRoutes = require("./getRoutes");

function createRouter(spec, controllers, authHandlers) {
  const router = createFMWRouter();
  const securityHandlers = createSecurityHandlers(spec, authHandlers);
  const routes = getRoutes(spec, controllers);

  for (const { method, path, handler, operation } of routes) {
    const checkAuthorization = createAuthorizationChecker(
      securityHandlers,
      operation
    );

    router.on(method, path, handler, { checkAuthorization, operation });
  }

  return router;
}

module.exports = createRouter;
