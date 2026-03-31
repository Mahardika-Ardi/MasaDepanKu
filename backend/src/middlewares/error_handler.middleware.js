/* eslint-disable no-unused-vars */

function errorHandler(err, req, res, next) {
  console.error("ERROR:", err.message);
  console.error(err.stack);

  res.status(500).json({
    message: err.message || "Internal Server Error!",
  });
}

export default errorHandler;
