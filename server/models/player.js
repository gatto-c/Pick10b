var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var Schema = mongoose.Schema;
var co = require('co');
var logger = require('../../logger');

var PlayerSchema = new Schema({
  username: {type: String, required: true, trim: true},
  password: {type: String, required: true},
  email: {type: String, required: true, trim: true},
  created: Date
});

//generate password hash function
var genHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//// generating a password hash
//PlayerSchema.methods.generateHash = genHash;

// checking if password is valid
PlayerSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * pre save will insert or update player info
 */
PlayerSchema.pre('save', function(done){
  var self = this;

  co(function*() {
    try {
      yield mongoose.models["Player"].findOne({username: self.username}, function(err, myplayer) {
        if(myplayer) {
          done(new Error('duplicate'));
        } else {
          //if this is a new player then hash the incoming password and set created date
          now = new Date();
          if ( !self.created ) {
            self.password = genHash(self.password);
            self.created = now;
          }
          done();
        }
      });
    } catch(err) {
      logger.error(err);
      done(err);
    }
  });

});

module.exports = mongoose.model('Player', PlayerSchema);
