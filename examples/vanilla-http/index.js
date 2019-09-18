const http = require("http");
const urlTool = require("url");
const qs = require("qs");

const createMiddleware = require("../../lib/middleware");

const controllers = require("./controllers");
const handlers = require("./handlers");
const spec = require("./spec");

const apiHandler = createMiddleware(spec, controllers);

const server = http.createServer((req, res) => {
  const parsedUrl = urlTool.parse(req.url);

  req.path = parsedUrl.pathname;
  req.query = qs.parse(parsedUrl.query);

  apiHandler(req, res, err => {
    if (err) {
      handlers.error(err, req, res);
    } else {
      handlers.notFound(req, res);
    }
  });
});

server.listen(8080);
