function bearerAuth(token, permissions, req) {
  return Promise.resolve(token == "test");
}

module.exports = {
  bearerAuth
};
