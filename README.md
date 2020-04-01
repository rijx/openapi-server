# openapi-server

Framework agnostic OpenAPI server.

## How is this different from existing OpenAPI server frameworks?

Existing frameworks assume a setting, like being integrated into Express.

This framework is completely agnostic and only assumes Node request and response objects to be used.

## Example

### Controller

In this example request variables are still used, but the parameters defined in the OpenAPI spec are passed in one object. Regardless whether they came from the path, headers or query string.

```js
const { response } = require("openapi-server");

function helloWorld({ name, ["User-Agent"]: userAgent, x }, req) {
  return response({
    message: `Hello ${name}! You're on ${req.path} (Your IP is ${req.connection.remoteAddress} and your User-Agent is ${userAgent}, x = ${x})`
  });
}

module.exports = {
  helloWorld
};
```

### Full example including authentication

```js
const bodyParser = require("body-parser");
const express = require("express");

const createMiddleware = require("openapi-server/lib/middleware");
const response = require("openapi-server/lib/response");

const controllers = {
  auth: {
    login({ username, password }) {
      if (username != "test@localhost" || password != "test") {
        return response(null, 401);
      }

      return response({
        token: "1234"
      });
    }
  }
};

const spec = {
  paths: {
    "/login": {
      post: {
        tags: ["auth"],
        operationId: "login",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  emailAddress: {
                    type: "string",
                    example: "test@localhost"
                  },
                  password: {
                    type: "string",
                    example: "test"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "The session was created.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" }
                  }
                }
              }
            }
          },
          401: {
            description: "The credentials were invalid.",
            content: {
              "text/plain": {
                schema: {
                  type: "string",
                  example: ""
                }
              }
            }
          }
        }
      }
    }
  }
};

const app = express();

app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.send("ok");
});

app.use("/api", createMiddleware(spec, controllers));

app.listen(8080);
```

We can use curl to do a test request:

```sh
curl -H "Content-Type: application/json" -d '{"emailAddress": "test@localhost","password": "test"}' http://localhost:8080/api/login
```

Above request will produce this result:

```json
{
  "token": "1234"
}
```
