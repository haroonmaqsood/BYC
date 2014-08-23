var express 	= require('express'),
		router 		= express.Router(),
		passport 	= require('passport');

router.get('/', function(req, res) {

  res.render('ad');

});


module.exports = router;
