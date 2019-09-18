function mapArrayToObject(elements) {
  const result = {};

  let name;

  for (let i = 0; i < elements.length; i++) {
    if (i % 2 == 0) {
      name = elements[i];
    } else {
      result[name] = elements[i];
    }
  }

  return result;
}

function isObjectSchema(schema) {
  return schema != null && schema.type == "object";
}

function splitString(value, delimiter, isObject) {
  const elements = String(value || "").split(delimiter);

  if (isObject) {
    return mapArrayToObject(elements);
  }

  return elements;
}

const styleParsers = {
  matrix(value, parameter) {
    // TODO
  },
  label(value, parameter) {
    if (parameter.explode) {
      return qs.parse(value, { delimiter: "." });
    } else {
      return splitString(value, /\./g, isObjectSchema(parameter.schema));
    }
  },
  form(value, parameter) {
    const delimiter = parameter.explode ? "&" : ",";

    return qs.parse(value, { delimiter });
  },
  simple(value, parameter) {
    if (parameter.explode) {
      // use qs
    } else {
      return splitString(value, /,/g, isObjectSchema(parameter.schema));
    }
  },
  spaceDelimited(value, parameter) {
    return splitString(value, / /g, isObjectSchema(parameter.schema));
  },
  pipeDelimited(value, parameter) {
    return splitString(value, /\|/g, isObjectSchema(parameter.schema));
  },
  deepObject: x => qs.parse(x, { nested: true })
};

function processParameterStyle(parameter, value) {
  if (value == null || parameter.style == null) {
    return value;
  }

  const styleParser = styleParsers[parameter.style];

  if (styleParser == null) {
    return value;
  }

  return styleParser(value, parameter);
}

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

function createRequestDataExtractor(operation) {
  if (operation.parameters == null) {
    return;
  }

  return function extractRequestData(req) {
    const result = {};

    for (const parameter of operation.parameters) {
      const value = getParameterFromRequest(parameter, req);

      result[parameter.name] = value;
    }

    return result;
  };
}

module.exports = createRequestDataExtractor;
