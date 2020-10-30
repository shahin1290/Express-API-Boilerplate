const fs = require('fs')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

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

const articles = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/articles.json`)
)

app.get('/api/v1/articles', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: articles.length, data: { articles } })
})

const port = 3000
app.listen(port, function () {
  console.log(`App running on port ${port}...`)
})
