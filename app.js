const express = require('express')
const articleRoutes = require('./routes/articles')
const userRoutes = require('./routes/users')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errors')

const app = express()
app.use(express.json())

app.use('/api/v1/articles', articleRoutes)
app.use('/api/v1/users', userRoutes)


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
