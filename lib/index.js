// - extractParameters(operation, request)
// - generateJSONSchema(operation) -> merges every requestBody + parameters with anyOf
// - parameters -> json schema -> ajv -> validate on every request (return 400)
// - response helper function (like laravel)
// - validate response against spec

const http = require("http");
const urlTool = require("url");
const qs = require("qs");

const { response } = require("./response");

const spec = {
  paths: {
    "/hello/{name}/{age}": {
      get: {
        operationId: "helloWorld",
        tags: ["test"],
        parameters: [
          {
            name: "x",
            in: "query",
            required: true
          },
          {
            name: "y",
            in: "query",
            required: true
          },
          {
            name: "name",
            in: "path"
          },
          {
            name: "age",
            in: "path",
            schema: {
              type: "number"
            }
          },
          {
            name: "User-Agent",
            in: "header"
          }
        ]
      }
    }
  }
};

const controllers = {
  test: {
    helloWorld({ name, ["User-Agent"]: userAgent, x }, req) {
      return response(
        `Hello ${name}! You're on ${req.path} (Your IP is ${req.connection.remoteAddress} and your User-Agent is ${userAgent}, x = ${x})`
      );
    }
  }
};

const createMiddleware = require("./createMiddleware");

const apiHandler = createMiddleware(spec, controllers);

const server = http.createServer((req, res) => {
  const parsedUrl = urlTool.parse(req.url);

  req.path = parsedUrl.pathname;
  req.query = qs.parse(parsedUrl.query);

  apiHandler(req, res, err => {
    if (err) {
      if (err.status != null) {
        res.writeHead(err.status, {
          "Content-Type": "text/plain"
        });
        res.end(`${err.message.trim()}\n`);
      } else {
        // TODO: log error, handle HTTP facing errors?, output if in dev mode, etc
        console.error(err);

        res.writeHead(500);
        res.end(`${err.stack}\n`);
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  });
});

server.listen(8080);
