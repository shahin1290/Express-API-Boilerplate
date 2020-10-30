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

/* app.get('/api/v1/articles', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: articles.length, data: { articles } })
}) */

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

const port = 3000
app.listen(port, function () {
  console.log(`App running on port ${port}...`)
})
