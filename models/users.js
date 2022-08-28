const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    username: {type:String, require: true, unique: true},
    password: {type:String, require: true}
})

const User = mongoose.model('User', userSchema);

module.exports = User;
