var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt');

var PlayerSchema = new Schema({
  username: {type: String, required: true, trim: true},
  password: {type: String, required: true},
  email: {type: String, required: true, trim: true},
  created: Date
});

// generating a password hash
PlayerSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
PlayerSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// pre-save functionality
PlayerSchema.pre('save', function(next){
  now = new Date();
  if ( !this.created ) {
    this.created = now;
  }
  next();
});

module.exports = mongoose.model('Player', PlayerSchema);
