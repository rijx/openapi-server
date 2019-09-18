function createResponseSerializer(operation) {
  // TODO: use fast-json-stringify

  return function responseSerializer(response) {
    return {
      ...response,
      data: `${JSON.stringify(response.data)}\n`
    };
  };
}

module.exports = createResponseSerializer;
