const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'A tour must have description'],
  },
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article
