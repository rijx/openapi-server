function errorHandler(err, req, res) {
  if (err.status != null) {
    res.writeHead(err.status, {
      "Content-Type": "text/plain"
    });
    res.end(`${err.message.trim()}\n`);

    return;
  }

  console.error(err);

  res.writeHead(500);
  res.end(process.env.NODE_ENV != "production" ? `${err.stack}\n` : "");
}

module.exports = errorHandler;
