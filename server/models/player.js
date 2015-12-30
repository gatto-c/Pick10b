var mongoose = require('mongoose');

module.exports = mongoose.model('Player', {
  username: String,
  password: String,
  email: String,
  created: Date
});
