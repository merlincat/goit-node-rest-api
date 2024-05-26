export const handleMongooseError = (error, data, next) => {
  error.status = 404;
  error.message = "Not found'";
  next();
};

export const errorHandler = (err, req, res, next) => {
  const { name, code } = err;
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  err.status = status;
};
