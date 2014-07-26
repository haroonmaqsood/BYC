var express 	= require('express'),
		router 		= express.Router(),
		passport 	= require('passport');


/* GET users listing. */
router.get('/', function(req, res) {
  
  if ( req.isAuthenticated() ) {
  	if (!req.user.steptwo)
			return res.redirect('/steptwo');
  	return res.redirect('/');
  }

  res.render('login');

});

router.post('/', function(req, res) {
	
	passport.authenticate('local')(req, res, function (err, user) {
		console.log(user)
    if (!req.user.steptwo)
			return res.send({ status: 'steptwo'});
    return res.send({ status: 'success'});
  });

	

});

module.exports = router;
