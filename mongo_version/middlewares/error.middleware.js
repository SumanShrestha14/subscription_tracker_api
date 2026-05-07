const errorMiddleware = (err, req, res, next) => {
  let error = err;
  let statusCode = err.statusCode || err.status || 500;

  if (res.headersSent) {
    return next(error);
  }

  if (err.name === 'CastError') {
    error = new Error('Resource not found');
    statusCode = 404;
  }

  if (err.code === 11000) {
    error = new Error('Duplicate key error');
    statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    error = new Error(Object.values(err.errors).map((value) => value.message).join(', '));
    statusCode = 400;
  }

  console.error(error);

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};

export default errorMiddleware;
