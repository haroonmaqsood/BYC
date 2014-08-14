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
  	model.getProfile(username, function(responce_getProfile) {
  		
	    if (!responce_getProfile[0]) {
	      var err = new Error('Profile does not exsist mofo!');
	  		err.status = 404;
	  		return next(err);
	  	}
	  	res.locals.profile = responce_getProfile[0];
	  	
	  	model.getPictures(responce_getProfile[0].id, function(responce_getPictures) {
	  		res.locals.userPictures = responce_getPictures;
	  		
	  		if (req.user.id !== responce_getProfile[0].id) {
		  		model.followStatus(req.user.id, res.locals.profile.id, function(responce_followStatus) {
		  			res.locals.followStatus = responce_followStatus;
		  			res.render('profile');
		  		});
		  	} else {
		  		res.render('profile');
		  	}

	  	});

	  });
  }

});





router.post('/:username', function(req, res, next) {
	
	if (!req.params.username || req.params.username.length > 20)
			return res.send({ status: 'failed'});

	model.getProfile(req.params.username, function(responce_getProfile) {
		if (!responce_getProfile || req.user.id === responce_getProfile[0].id)
			return res.send({ status: 'failed'});

	  var username = req.params.username;

	  
		model.followStatus(req.user.id, responce_getProfile[0].id, function(responce_followStatus) {
			console.log(responce_followStatus)
			if (responce_followStatus) {
				// UNFOLLOW
				model.unfollowUser(req.user.id, responce_getProfile[0].id, function(responce) {
			    if (!responce) return res.send({ status: 'failed'});
			    return res.send({ status: 'unfollowed'});
		  	});
			} else {
				// FOLLOW USER
				model.followUser(req.user.id, responce_getProfile[0].id, function(responce) {
			    if (!responce) return res.send({ status: 'failed'});
			  	return res.send({ status: 'followed'});
			  });
			}
		});
  });
});






module.exports = router;
