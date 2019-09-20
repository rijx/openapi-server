function getControllerByTagAndOperationId(operation, controllers) {
  const [primaryTag] = operation.tags || [];

  if (!primaryTag || !operation.operationId) {
    return;
  }

  const controller = controllers[primaryTag][operation.operationId];

  if (controller == null) {
    throw new Error(
      `Could not find controller ${primaryTag}.${operation.operationId}`
    );
  }

  return controller;
}

module.exports = getControllerByTagAndOperationId;
