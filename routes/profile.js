var express 				= require('express'),
		router 					= express.Router(),
		model						= require('../model'),
		async						= require('async');


/* GET users listing. */
router.get('/:username', function(req, res, next) {

	if (!req.isAuthenticated() )
  	return res.redirect('/login');

	var username = "GUEST";

	if (req.params.username !== 'undefined') {
    username = req.params.username;
  }


  if (username.length > 20) {
	  var err = new Error('Profile does not exsist mofo!');
	  err.status = 404;
	  return next(err);
	}

	model.getProfile(username, function(responce_getProfile) {
    if (!responce_getProfile[0]) {
      var err = new Error('Profile does not exsist!');
  		err.status = 404;
  		return next(err);
  	}
  	res.locals.profile = responce_getProfile[0];
	
		async.parallel([
	    
	    function(callback) {
	    	model.getPictures(responce_getProfile[0].id, true, function(responce_getPictures) {
	  			res.locals.userPictures = responce_getPictures;
	    		callback();
	    	});
	    },

	    function(callback) {
	    	model.countUserLikes(responce_getProfile[0].id, function(responce_countUserLikes) {
	  			res.locals.countUserLikes = responce_countUserLikes[0].count;
	    		callback();
	    	});
	    },

	    function(callback) {
	    	model.countUserPictures(responce_getProfile[0].id, function(responce_countUserPictures) {
	  			res.locals.countUserPictures = responce_countUserPictures[0].count;
	    		callback();
	    	});
	    },

	    function(callback) {
	    	model.getPictures(responce_getProfile[0].id, false, function(responce_getPicturesNoneCropped) {
	  			res.locals.userPicturesNoneCropped = responce_getPicturesNoneCropped;
	    		callback();
	    	});
	    },

	    function(callback) {
	    	if (req.user.id !== responce_getProfile[0].id) {
		    	model.followStatus(req.user.id, res.locals.profile.id, function(responce_followStatus) {
			 			res.locals.followStatus = responce_followStatus;
			  		callback();
			  	});
		    } else {
		    	callback();
		    }
	    }

		],
		function(err, results){
		  
		  return res.render('profile');

		});



	});

});





router.post('/:username', function(req, res, next) {
	
	if (!req.params.username || req.params.username.length > 20)
			return res.send({ status: 'failed'});

	model.getProfile(req.params.username, function(responce_getProfile) {
		if (!responce_getProfile || req.user.id === responce_getProfile[0].id)
			return res.send({ status: 'failed'});
	  
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
