const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Article = require('./models/articleModel')

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'))

const app = express()
app.use(express.json())

/* const articles = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/articles.json`)
) */

app.get('/api/v1/articles', async (req, res) => {
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
})

app.get('/api/v1/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: { article },
    })
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err })
  }
})

app.post('/api/v1/articles', async (req, res) => {
  try {
    const newArticle = await Article.create(req.body)

    res.status(201).json({
      status: 'success',
      data: { article: newArticle },
    })
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err })
  }
})

app.patch('/api/v1/articles/:id', async (req, res) => {
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
})

app.delete('/api/v1/articles/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err })
  }
})

const port = 3000
app.listen(port, function () {
  console.log(`App running on port ${port}...`)
})
