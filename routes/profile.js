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
	  var err = new Error('Profile does not exsist!');
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
		async.parallel({
	    
	    getSets: function(callback) {
	    	model.getSetsByOwner(responce_getProfile[0].id, function(responce_userSets) {
	  			res.locals.userSets = responce_userSets;
	    		return callback();
	    	});
	    },

	    countUserLikes: function(callback) {
	    	model.countUserLikes(responce_getProfile[0].id, function(responce_countUserLikes) {
	  			res.locals.countUserLikes = responce_countUserLikes[0].count;
	    		return callback();
	    	});
	    },

	    countUserFollowers: function(callback) {
	    	model.countUserFollowers(responce_getProfile[0].id, function(responce_countUserFollowers) {
	  			res.locals.countUserFollowers = responce_countUserFollowers[0].count;
	    		return callback();
	    	});
	    },

	    countUserPictures: function(callback) {
	    	model.countUserPictures(responce_getProfile[0].id, function(responce_countUserPictures) {
	  			res.locals.countUserPictures = responce_countUserPictures[0].count;
	    		return callback();
	    	});
	    },

	    getUserSetLikes: function(callbackOne){ 
	    	model.getUserSetLikes(responce_getProfile[0].id, 3, function(responce_getUserPictureLikes) {

	    		async.eachSeries(responce_getUserPictureLikes, function(picture, callbackTwo) {
				    index = responce_getUserPictureLikes.indexOf(picture);
				    model.getSetByID(picture.set_id, function(result){
						    responce_getUserPictureLikes[index].set_id = result[0].set_id;
						    responce_getUserPictureLikes[index].title 	= result[0].title;
						    responce_getUserPictureLikes[index].slug 		= result[0].slug;
						    
						    return callbackTwo();
						});
				    
				  }, function(err) {
				  	res.locals.userPicsTop = responce_getUserPictureLikes;
				  	return callbackOne();
				  });
	    		
				});
	    },

	    // getPicturesNoneCropped: function(callback) {
	    // 	model.getPictures(responce_getProfile[0].id, false, function(responce_getPicturesNoneCropped) {
	  		// 	res.locals.userPicturesNoneCropped = responce_getPicturesNoneCropped;
	    // 		return callback();
	    // 	});
	    // },

		},
		function(err, results){
		  return res.render('profile');

		});



	});

});






module.exports = router;
