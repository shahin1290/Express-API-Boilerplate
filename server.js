const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app = require('./app');

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


const port = 3000
app.listen(port, function () {
  console.log(`App running on port ${port}...`)
})