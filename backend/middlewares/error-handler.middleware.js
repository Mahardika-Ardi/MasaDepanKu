function errorHandler(err, req, res, next) {
  console.error("=====================");
  console.error(err);
  console.error("=====================");
  console.error("=====================");
  console.error(err.stack);
  console.error("=====================");

  res.status(500).json({
    message: err.message || "Internal Server Error!",
  });
}

export default errorHandler;
