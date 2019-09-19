const getInputForHTTP = {
  basic(securityScheme) {
    return req => {
      const { authorization } = req.headers;

      if (!authorization.startsWith("Basic ")) {
        return;
      }

      const plainText = Buffer.from(
        authorization.replace(/^Basic /, ""),
        "base64"
      );

      const [username, password] = plainText.split(/:/);

      return { username, password };
    };
  },
  bearer(securityScheme) {
    return req => {
      const { authorization } = req.headers;

      if (authorization == null || !authorization.startsWith("Bearer ")) {
        return;
      }

      return authorization.replace(/^Bearer /, "");
    };
  }
};

function createGetInput(securityScheme) {
  if (securityScheme.scheme == null) {
    throw new Error("Property 'scheme' is required");
  }

  const getInputGenerator = getInputForHTTP[securityScheme.scheme];

  if (getInputGenerator == null) {
    throw new Error(`Unsupported 'scheme' value: ${securityScheme.scheme}`);
  }

  return getInputGenerator(securityScheme);
}

module.exports = createGetInput;
