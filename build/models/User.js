const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        default: '',
    },
    lastName: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    confirmed: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});
const User = mongoose.model('User', userSchema); //model name is singular from our users collection
module.exports = User;
