function getSpecOperationsArray(spec) {
  const results = [];

  for (const path in spec.paths) {
    const operations = spec.paths[path];

    for (const method in operations) {
      const operation = operations[method];

      results.push({ path, method, operation });
    }
  }

  return results;
}

module.exports = getSpecOperationsArray;
