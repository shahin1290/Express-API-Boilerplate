const express = require('express')
const articleRoutes = require('./routes/articles')

const app = express()
app.use(express.json())

app.use('/api/v1/articles', articleRoutes)

app.all('*', (req, res, next) => {
  res
    .status(404)
    .json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on this server!`,
    })
})

module.exports = app
