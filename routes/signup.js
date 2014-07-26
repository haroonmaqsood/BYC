var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
		cryptoToken = require('crypto').randomBytes,
    bcrypt      = require('bcrypt-nodejs'),
    model	      = require('../models/userInfo'),
    utils       = require('../inc/utils');

router.get('/', function(req, res) {
  if ( req.isAuthenticated() ) {
    if (!req.user.steptwo)
      return res.redirect('/steptwo');
    return res.redirect('/');
  }

  res.render('signup');
});

router.post('/', function (req, res) {

  var username  = req.body.username.trim(),
      email     = req.body.email.trim(),
      password  = req.body.password,
      ip        = req.connection.remoteAddress || null,
      agent     = req.headers,
      token     = cryptoToken(16).toString('hex');
  
  if ( (email.length > 100 || email.length < 5) || (username.length > 20 || username.length < 3) || !utils.validateEmail(email) || !utils.isAlphaNumeric(username) || password.length < 3 || password.length > 500 ) {
    return res.send({ status: 'invalid field(s)' });
  }

  var hashedPassword = bcrypt.hashSync(password);


  // if ( model.signup(email, username, hashedPassword, ip, agent, token) ) {
    
  model.signup(email, username, hashedPassword, ip, agent, token, function(responce) {

    if (!responce)
      return res.send({ status: 'failed'});

    console.log('shit be cray');  
    passport.authenticate('local')(req, res, function () {
      return res.send({ status: 'success'});
    });

  });



});


module.exports = router;