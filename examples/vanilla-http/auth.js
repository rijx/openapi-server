function demoAuth(token, permissions, req) {
  return Promise.resolve(token == "test");
}

module.exports = {
  demoAuth
};
