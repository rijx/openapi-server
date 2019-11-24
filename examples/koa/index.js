const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const mount = require("koa-mount");

const createMiddleware = require("../../lib/middleware/koa");
const response = require("../../lib/framework/response");

const controllers = {
  auth: {
    login({ emailAddress, password }) {
      if (emailAddress != "test@localhost" || password != "test") {
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

const app = new Koa();

app.use(bodyParser());

app.use(
  mount("/health", ctx => {
    ctx.body = "ok";
  })
);

app.use(mount("/api", createMiddleware(spec, controllers)));

app.listen(process.env.PORT || 8080);
