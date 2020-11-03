const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  })

  const token = signToken(newUser._id)

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new AppError('Incorrect email or password.', 401))
  }

  const isPasswordMatch = await User.isPasswordMatch(password, user.password)

  if (!isPasswordMatch) {
    return next(new AppError('Incorrect email or password.', 401))
  }

  const token = signToken(user._id)

  res.status(201).json({
    status: 'success',
    token,
  })
})

exports.protect = catchAsync(async (req, res, next) => {
  //check if the token exists
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return next(
      new AppError('Your are not logged in! Please log in to get access', 401)
    )
  }

  //verify the token
  const decodedJwt = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  //check if user still exists
  const currentUser = await User.findById(decodedJwt.id)

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exist', 401)
    )
  }

  //Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    )
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser

  next()
})
