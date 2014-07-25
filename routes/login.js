var express = require('express'),
		router = express.Router(),
		passport = require('passport');


/* GET users listing. */
router.get('/', function(req, res) {
  
  if ( req.isAuthenticated() )
  	return res.send('I be logged in!');
  res.render('login');
});

router.post('/',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

module.exports = router;
