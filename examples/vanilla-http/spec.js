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
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" }
                }
              }
            }
          }
        },
        security: [
          {
            bearerAuth: ["test:hello"]
          }
        ]
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer"
      }
    }
  }
};
