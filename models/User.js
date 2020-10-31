const mongoose = require('mongoose')
const validate = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email!'],
    unique: true,
    lowerCase: true,
    validate: [validate.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //This only works on CREATE and SAVE!! (reminds on update)
      validator: function (val) {
        return val === this.password
      },
    },
    message: 'Passwords do not match',
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
