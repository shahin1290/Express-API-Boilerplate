const express = require('express')
const router = express.Router()
const articles = require('../controllers/articles')

const Article = require('../models/Article')

router.route('/').get(articles.index).post(articles.create)

router
  .route('/:id')
  .get(articles.show)
  .patch(articles.update)
  .delete(articles.destroy)

module.exports = router
