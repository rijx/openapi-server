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

module.exports = {
  isObjectSchema,
  splitString
};
