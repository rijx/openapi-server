function notFoundHandler(req, res) {
  res.writeHead(404);
  res.end();
}

module.exports = notFoundHandler;
