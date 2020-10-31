const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'Tour name must have less or equal 40 characters'],
    minlength: [6, 'Tour name must have more or equal 6 characters'],
  },
  description: {
    type: String,
    required: [true, 'A tour must have description'],
    minlength: [10, 'Tour name must have more or equal 10 characters'],
  },
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article
