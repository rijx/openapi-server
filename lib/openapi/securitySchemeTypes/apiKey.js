const getInputForApiKey = {
  header(securityScheme) {
    return req => req.headers[securityScheme.name.toLowerCase()];
  },
  query(securityScheme) {
    return req => req.query[securityScheme.name];
  },
  cookie(securityScheme) {
    return req => req.cookies.get(securityScheme.name);
  }
};

function createGetInput(securityScheme) {
  if (securityScheme.name == null) {
    throw new Error("Property 'name' is required");
  }

  if (securityScheme.in == null) {
    throw new Error("Property 'in' is required");
  }

  const getInputGenerator = getInputForApiKey[securityScheme.in];

  if (getInputGenerator == null) {
    throw new Error(`Unsupported 'in' value: ${securityScheme.in}`);
  }

  return getInputGenerator(securityScheme);
}

module.exports = createGetInput;
