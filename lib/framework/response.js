function response(data, status = null) {
  if (!status) {
    status = data ? 200 : 204;
  }

  // TODO: add laravel style methods

  return { data, status };
}

module.exports = response;

// TODO: remove at next major release:
response.response = response;
