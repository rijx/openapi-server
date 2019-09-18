const wrapHandler = require("./wrapHandler");

function defineRoutesByTagAndOperation(spec, controllers, defineFn) {
  for (const path in spec.paths) {
    const operations = spec.paths[path];

    for (const method in operations) {
      const operation = operations[method];

      const [primaryTag] = operation.tags || [];

      if (!primaryTag || !operation.operationId) {
        continue;
      }

      const vanillaHandler = controllers[primaryTag][operation.operationId];

      const handler = wrapHandler(operation, vanillaHandler);

      // TODO: this can be express, koa-router, find-my-way, etc
      defineFn({
        path,
        method,
        handler
      });
    }
  }
}

module.exports = defineRoutesByTagAndOperation;
