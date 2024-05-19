export const handleMongooseError = (error, data, nest) => {
  error.status = 404;
  error.message = "Not found'";
  next();
};
