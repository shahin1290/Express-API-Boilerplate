const AppError = require('../utils/appError')

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
  const key = Object.keys(err.keyValue).join('')
  const message = `The key '${key}' has duplicate value of '${err.keyValue[key]}'`
  return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`

  return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const sendErrorProd = (err, res) => {
  //Operational, trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
    //Programming or other unknown error; don't leak error details
  } else {
    console.log('ERROR', err)

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
    })
  }
}

const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleTokenExpiredError = () =>
  new AppError('Your token exired!. Please login again', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error._message && error._message.toLowerCase().includes('validation failed')) error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error)
    if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error)
    sendErrorProd(error, res)
  }
}
