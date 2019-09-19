const createSecuritySchemeInputGetter = require("./createSecuritySchemeInputGetter");

function createSecurityHandlers(spec, authHandlers) {
  if (spec.components == null || spec.components.securitySchemes == null) {
    return {};
  }

  const securityHandlers = {};

  for (const internalName in spec.components.securitySchemes) {
    try {
      const securityScheme = spec.components.securitySchemes[internalName];
      const isAuthorized = authHandlers[internalName];

      if (isAuthorized == null) {
        throw new Error(`No auth handler is defined`);
      }

      const getInput = createSecuritySchemeInputGetter(securityScheme);

      if (getInput == null) {
        throw new Error(`Unknown security scheme type: ${securityScheme.type}`);
      }

      securityHandlers[internalName] = { getInput, isAuthorized };
    } catch (err) {
      throw new Error(
        `Could not generate security handler for ${internalName}: ${err.message}`
      );
    }
  }

  return securityHandlers;
}

module.exports = createSecurityHandlers;
