const qs = require("qs");

const { isObjectSchema, splitString } = require("./utils");

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

module.exports = processParameterStyle;
