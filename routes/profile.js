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
	    
	    getPictures: function(callback) {
	    	model.getPictures(responce_getProfile[0].id, true, function(responce_getPictures) {
	  			res.locals.userPictures = responce_getPictures;
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

	    getUserPictureLikes: function(callbackOne){ 
	    	model.getUserPictureLikes(responce_getProfile[0].id, 3, function(responce_getUserPictureLikes) {

	    		async.eachSeries(responce_getUserPictureLikes, function(picture, callbackTwo) {
				    index = responce_getUserPictureLikes.indexOf(picture);
				    model.getPicturesByID(picture.picture_id, function(result){
						    responce_getUserPictureLikes[index].picture = result[0].picture;
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

	    getPicturesNoneCropped: function(callback) {
	    	model.getPictures(responce_getProfile[0].id, false, function(responce_getPicturesNoneCropped) {
	  			res.locals.userPicturesNoneCropped = responce_getPicturesNoneCropped;
	    		return callback();
	    	});
	    },

		},
		function(err, results){
		  return res.render('profile');

		});



	});

});






module.exports = router;
