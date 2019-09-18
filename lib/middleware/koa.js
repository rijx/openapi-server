const createMiddleware = require(".");

function createKoaMiddleware(spec, controllers) {
  const apiHandler = createMiddleware(spec, controllers);

  return ctx => {
    return new Promise((resolve, reject) => {
      apiHandler(ctx.req, ctx.res, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
}

module.exports = createKoaMiddleware;
