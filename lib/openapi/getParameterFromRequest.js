const processParameterStyle = require("./processParameterStyle");

const parameterGetters = {
  query(param, req) {
    return req.query[param.name];
  },
  header(param, req) {
    return req.headers[param.name.toLowerCase()];
  },
  path(param, req) {
    return req.params[param.name];
  }
};

function getParameterFromRequest(parameter, request) {
  const getterFn = parameterGetters[parameter.in];

  if (getterFn == null) {
    return;
  }

  const value = getterFn(parameter, request);

  return processParameterStyle(parameter, value);
}

module.exports = getParameterFromRequest;
