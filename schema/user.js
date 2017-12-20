const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  dob: Date
});

module.exports = mongoose.model('user', userSchema);
