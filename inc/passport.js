var passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt        = require('bcrypt-nodejs');

var passportAuth = function(app) {
  

  passport.use(new LocalStrategy(
    function(username, password, done) {
      return check_auth_user(username,password,done);
    } 
  ));
   

  passport.serializeUser(function(res, done) {
    done(null,res);
  });

  passport.deserializeUser(function(res, done) {
    done(null,res);
  });


  function check_auth_user(username, password, done) {

    db.query("SELECT * FROM users WHERE email = ? OR username = ? limit 1", [username, username], function (err,results) {

      if (err) throw err;

      if(results.length > 0){

          var res=results[0]; 

          if (!bcrypt.compareSync(password, res.password)) {
            console.log('fail 1');
            return done(null, false);
          };


          return done(null, res);

      } else {
        console.log('fail 2');
        return done(null, false); 

      }

    });
   
  }


};

module.exports.passportAuth = passportAuth;
