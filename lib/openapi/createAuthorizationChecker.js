function createAuthorizationChecker(securityHandlers, operation) {
  if (operation.security == null || operation.security.length == 0) {
    return;
  }

  return async req => {
    for (const securitySpec of operation.security) {
      const [securityHandlerName, ...extraNames] = Object.keys(securitySpec);
      const requiredPermissions = securitySpec[securityHandlerName];

      if (extraNames.length != 0) {
        throw new Error(
          "Only one name can be specified per security specification"
        );
      }

      const securityHandler = securityHandlers[securityHandlerName];

      if (securityHandler == null) {
        throw new Error(`Unknown security handler: ${securityHandlerName}`);
      }

      const inputData = securityHandler.getInput(req);

      if (inputData == null) {
        continue;
      }

      const isAuthorized = await securityHandler.isAuthorized(
        inputData,
        requiredPermissions,
        req
      );

      if (isAuthorized) {
        return true;
      }
    }
  };
}

module.exports = createAuthorizationChecker;
