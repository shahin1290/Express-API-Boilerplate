const Article = require('../models/Article')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('../utils/appError')

module.exports.index = catchAsync(async (req, res) => {
  const articles = await Article.find()

  res.status(200).json({
    status: 'success',
    results: articles.length,
    data: { articles },
  })
})

module.exports.show = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id)

  if (!article) {
    return next(new AppError('No article found with that ID'), 404)
  }

  res.status(200).json({
    status: 'success',
    data: { article },
  })
})

module.exports.create = catchAsync(async (req, res) => {
  const newArticle = await Article.create(req.body)

  res.status(201).json({
    status: 'success',
    data: { article: newArticle },
  })
})

module.exports.update = catchAsync(async (req, res, next) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!article) {
    return next(new AppError('No article found with that ID'), 404)
  }

  res.status(200).json({
    status: 'success',
    data: { article },
  })
})

module.exports.destroy = catchAsync(async (req, res, next) => {
  await Article.findByIdAndDelete(req.params.id)

  if (!article) {
    return next(new AppError('No article found with that ID'), 404)
  }

  res.status(204).json({
    status: 'success',
    data: null,
  })
})
