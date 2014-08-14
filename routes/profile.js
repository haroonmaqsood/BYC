var express 				= require('express'),
		router 					= express.Router(),
		model						= require('../model');


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
  	model.getProfile(username, function(responce) {
  		
	    if (!responce[0]) {
	      var err = new Error('Profile does not exsist mofo!');
	  		err.status = 404;
	  		return next(err);
	  	}
	  	res.locals.profile = responce[0];
	  	
	  	model.getPictures(responce[0].id, function(responce) {
	  		res.locals.userPictures = responce;
	  		
	  		// model.followStatus(req.user.id, res.locals.profile.id, function(responce) {
	  		// 	res.locals.followStatus = responce;
	  			res.render('profile');
	  		// });
	  	});

	  });
  }

});





router.post('/:username/follow', function(req, res, next) {

	if (!req.params.username || !req.body.profile_id || req.params.username.length > 20)
		return res.send({ status: 'failed wo'});

  var username = req.params.username,
  		profile_id = req.body.profile_id;

	model.followUser(req.user.id, profile_id, function(responce) {
		
    if (!responce) {
      return res.send({ status: 'failed'});
  	}
  	
  	return res.send({ status: 'followed'});

  });

});


router.post('/:username/unfollow', function(req, res, next) {

	if (!req.params.username || !req.body.profile_id || req.params.username.length > 20)
		return res.send({ status: 'failed wo'});

  var username = req.params.username,
  		profile_id = req.body.profile_id;

	model.followUser(req.user.id, profile_id, function(responce) {
		
    if (!responce) {
      return res.send({ status: 'failed'});
  	}
  	
  	return res.send({ status: 'followed'});

  });

});








module.exports = router;
