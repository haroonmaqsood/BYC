var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
		cryptoToken = require('crypto').randomBytes,
    bcrypt      = require('bcrypt-nodejs'),
    model	      = require('../model'),
    utils       = require('../inc/utils'),
    async       = require('async');
    emailer     =   require('emailjs/email');

router.get('/', function(req, res) {
  if ( req.isAuthenticated() ) {
    if (!req.user.steptwo)
      return res.redirect('/steptwo');
    return res.redirect('/');
  }

  res.render('signup');
});

router.post('/', function (req, res) {


  req.checkBody('username', 'This field is required!').notEmpty();
  req.checkBody('email', 'This field is required!').notEmpty();
  req.checkBody('password', 'This field is required!').notEmpty();

  var errors = req.validationErrors();
  console.log(errors)
  if (errors) {
    return res.send(errors, 400);
  }

  req.checkBody('email', 'Not a valid email address!').isEmail();
  req.checkBody('username', 'This field is numeric only!').isAlphanumeric();

  req.checkBody('username', 'Username must be between 3-20 characters').isLength(3, 20);
  req.checkBody('email', 'Email must be between 5-100 characters').isLength(5, 100);
  req.checkBody('password', 'Password must be between 3-100 characters').isLength(3, 150);


  var errors = req.validationErrors();
  if (errors) 
    return res.send(errors, 400);

  async.series({
    checkEmail: function(callback) {
      model.checkEmail(req.body.email.trim(), function(responce) {
        if (responce)
          return res.send([ { param: 'email', msg: 'Email Already Exists'} ], 400);
        return callback();
      });
    },
    checkUsername: function(callback) {
      model.checkUsername(req.body.username.trim(), function(responce) {
        if (responce)
          return res.send([ { param: 'username', msg: 'Username Already Exists'} ], 400);
        return callback();
      });
    }
  },
  function(err, results) {

    var username        = req.param('username'),
        email           = req.param('email'),
        password        = req.param('password'),
        ip              = req.connection.remoteAddress || null,
        agent           = req.headers,
        token           = cryptoToken(16).toString('hex'),
        hashedPassword  = bcrypt.hashSync(password);

          
    model.signup(email, username, hashedPassword, ip, agent, token, function(responce) {
      // No frontend to support this yet TODO
      // if (!responce)
      //   return res.send(400, { status: 'failed'});

      passport.authenticate('local')(req, res, function () {
        return res.send({ redirect: '/steptwo'});
      });

    });

   //send email start
     // var server  = emailer.server.connect({
     //   user:    "haroon@bycreative.co.uk", 
      //  password:"Temp/123", 
      //  host:    "smtp.gmail.com", 
      //  ssl:     true
     //});

    //  server.send({
     //     text:    "Welcome "+req.body.username.trim()+" to your HairShare Account .", 
     //     from:    "haroon@bycreative.co.uk", 
     //     to:      email,
     //     cc:      "",
     //     subject: "Welcome to HairShare"
     // }, function(err, message) { console.log(err); }); //send email end

  });
});
module.exports = router;