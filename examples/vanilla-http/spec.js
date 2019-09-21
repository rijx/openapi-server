module.exports = {
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
        ],
        responses: {
          200: {
            content: {
              "text/plain": {},
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" }
                  }
                }
              }
            }
          }
        },
        security: [
          {
            demoAuth: ["test:hello"]
          }
        ]
      }
    }
  },
  components: {
    securitySchemes: {
      demoAuth: {
        type: "http",
        scheme: "bearer"
      }
    }
  }
};
