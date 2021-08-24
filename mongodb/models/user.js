const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
    required: true,
  }
}, {
  timestamps: true,
})

const User = mongoose.model('User', userSchema); //model name is singular from our users collection

module.exports = User;

