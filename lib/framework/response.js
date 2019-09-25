function response(data, status = 200) {
  // TODO: add laravel style methods
  return { data, status };
}

module.exports = response;

// TODO: remove at next major release:
response.response = response;
