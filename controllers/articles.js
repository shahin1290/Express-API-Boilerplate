const Article = require('../models/Article')
const catchAsync = require('./../utils/catchAsync')

module.exports.index = catchAsync(async (req, res) => {
  const articles = await Article.find()

  res.status(200).json({
    status: 'success',
    results: articles.length,
    data: { articles },
  })
})

module.exports.show = catchAsync(async (req, res) => {
  const article = await Article.findById(req.params.id)

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

module.exports.update = catchAsync(async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: 'success',
    data: { article },
  })
})

module.exports.destroy = catchAsync(async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: 'success',
    data: null,
  })
})
