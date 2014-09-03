var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
		cryptoToken = require('crypto').randomBytes,
    bcrypt      = require('bcrypt-nodejs'),
    model	      = require('../model'),
    utils       = require('../inc/utils');

router.get('/', function(req, res) {
  if ( !req.isAuthenticated() )
    return res.redirect('/login');

  if (!req.user.steptwo)
      return res.redirect('/steptwo');

  res.render('settings');
});

router.post('/', function (req, res) {

  if ( !req.isAuthenticated() )
    return res.redirect({redirect:'login'});

  if (!req.user.steptwo)
      return res.redirect({redirect:'steptwo'});

  req.checkBody('email', 'Email is invalid').isEmail().isLength(5, 100);
  if (req.body.password !== '')
    req.checkBody('password', 'Password must be bwteen 3 - 100 characters').isLength(3, 100);

  var errors = req.validationErrors();
  if (errors)
    return res.send(errors, 400);
  
  // return res.send({
  //   email: req.param('email'),
  //   password: req.param('password')
  // });
  
  model.updateEmail(req.param('email'), req.user.id, function(responce) {
    if (!responce)
      return res.send({ status: 'failed'});
    return res.send({status:'success'})
  });





  // var email     = req.body.email.trim(),
  //     password  = req.body.password,
  //     ip        = req.connection.remoteAddress || null,
  //     agent     = req.headers,
  //     token     = cryptoToken(16).toString('hex');
  
  // if ( (email.length > 100 || email.length < 5) || !utils.validateEmail(email) || password.length < 3 || password.length > 100 ) {
  //   return res.send({ status: 'invalid field(s)' });
  // }

  // var hashedPassword = bcrypt.hashSync(password);


  // // if ( model.signup(email, username, hashedPassword, ip, agent, token) ) {
    
  // model.signup(email, username, hashedPassword, ip, agent, token, function(responce) {

  //   if (!responce)
  //     return res.send({ status: 'failed'});

  //   console.log('shit be cray');  
  //   passport.authenticate('local')(req, res, function () {
  //     return res.send({ status: 'success'});
  //   });

  // });



});


module.exports = router;