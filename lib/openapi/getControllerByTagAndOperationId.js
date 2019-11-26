function getControllerByTagAndOperationId(operation, controllers) {
  const [primaryTag] = operation.tags || [];

  if (!primaryTag || !operation.operationId) {
    return;
  }

  const controllersByTag = controllers[primaryTag] || {};
  const controller = controllersByTag[operation.operationId];

  if (controller == null) {
    throw new Error(
      `Could not find controller ${primaryTag}.${operation.operationId}`
    );
  }

  return controller;
}

module.exports = getControllerByTagAndOperationId;
