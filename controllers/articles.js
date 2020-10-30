const Article = require('../models/Article')

module.exports.index = async (req, res) => {
  try {
    const articles = await Article.find()

    res.status(200).json({
      status: 'success',
      results: articles.length,
      data: { articles },
    })
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err })
  }
}

module.exports.show =  async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: { article },
    })
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err })
  }
}

module.exports.create = async (req, res) => {
  try {
    const newArticle = await Article.create(req.body)

    res.status(201).json({
      status: 'success',
      data: { article: newArticle },
    })
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err })
  }
}

module.exports.update = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: 'success',
      data: { article },
    })
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err })
  }
}

module.exports.destroy = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err })
  }
}