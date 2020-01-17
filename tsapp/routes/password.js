var crypto = require('crypto');

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

module.exports = { 
  saltHashPassword: function (userpassword) {
      var salt = 'x#!@$&*'; // Do not produce different hashes everytime
      var passwordData = sha512(userpassword, salt);
      return passwordData.passwordHash;
  }
}