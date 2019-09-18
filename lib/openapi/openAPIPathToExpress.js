function openAPIPathToExpress(path) {
  return String(path || "").replace(/{([^}]+)}/g, ":$1");
}

module.exports = openAPIPathToExpress;
