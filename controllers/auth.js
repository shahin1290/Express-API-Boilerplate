const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
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
