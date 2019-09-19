const securitySchemeTypes = require("./securitySchemeTypes");

function createSecuritySchemeInputGetter(securityScheme) {
  const securityHandlerGenerator = securitySchemeTypes[securityScheme.type];

  if (securityHandlerGenerator == null) {
    return;
  }

  return securityHandlerGenerator(securityScheme);
}

module.exports = createSecuritySchemeInputGetter;
