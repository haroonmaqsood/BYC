var express 				= require('express'),
		router 					= express.Router(),
		model_userInfo	= require('../models/userInfo'),
		model_picture		= require('../models/pictures');

/* GET users listing. */
router.get('/:username', function(req, res, next) {
	var username = "GUEST";

	if (req.params.username !== 'undefined') {
    username = req.params.username;
  }


  if (username.length > 20) {
	  var err = new Error('Profile does not exsist mofo!');
	  err.status = 404;
	  return next(err);
  } else {
  	model_userInfo.getProfile(username, function(responce) {
  		
	    if (!responce[0]) {
	      var err = new Error('Profile does not exsist mofo!');
	  		err.status = 404;
	  		return next(err);
	  	}
	  	res.locals.profile = responce[0];
	  	

	  	model_picture.getPictures(req.user.id, function(responce) {
	  		console.log(responce)
	  		res.locals.userPictures = responce;
	  		res.render('profile');
	  			
	  	});
	  	

	  });
  }
  
  
});

module.exports = router;
