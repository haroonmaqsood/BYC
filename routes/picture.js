var express			= require('express'),
		router			= express.Router(),
		async				= require('async'),
		model				= require('../model');



router.get('/:id', function(req, res, next) {
	if (!req.isAuthenticated() )
  	return res.redirect('/login');
	var id = req.params.slug;

  if (!id) {
	  var err = new Error('Profile does not exsist mofo!');
	  err.status = 404;
	  return next(err);
	}


	model.getPicturesByID(id, function(responce_picture) {

    if (!responce_picture[0]) {
      var err = new Error('The Picture you are looking for does not exist.');
  		err.status = 404;
  		return next(err);
  	}	

  	model.getPictureComments(responce_picture[0].id, function(responce_comments) {

  		// Gets comment username
  		var index;
  		async.eachSeries(responce_comments, function(comment, callback) {
		    index = responce_comments.indexOf(comment);
		    model.getUsernameFromId(comment.user_id, function(result){
				    responce_comments[index].username = result[0].username;
				    return callback();
				});
		    
		  }, function(err) {

		  	res.locals.comments = responce_comments;
		  	res.locals.picture = responce_picture[0];


		  	async.parallel({
				    likeStatus: function(callbackOne){
				    	model.likeStatus(req.user.id, responce_picture[0].id, function(responce_likeStatus) {
				  			res.locals.likeStatus = responce_likeStatus;
				  			return callbackOne();
				  		});
				    },
				    getPicturesFromUsers: function(callbackOne){ 
				    	model.getPicturesFromUsers(responce_picture[0].user_id, 0, 10, function(responce_userPics) {
				    		res.locals.profileUserPics = responce_userPics;
				    		return callbackOne();
	  					});
				    },
				    getProfileById: function(callbackOne){ 
				    	model.getProfileById(responce_picture[0].user_id, function(responce_getProfileId) {
				    		res.locals.profile = responce_getProfileId[0];
				    		return callbackOne();
	  					});
				    },
				    getUserPictureLikes: function(callbackOne){ 
				    	model.getUserPictureLikes(responce_picture[0].user_id, 3, function(responce_getUserPictureLikes) {
				    		
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
				    countLikes: function(callbackOne) {
				    	model.countLikes(responce_picture[0].id, function(responce_countLikes) {
				  			res.locals.countLikes = responce_countLikes[0].count;
				    		return callbackOne();
				    	});
				    },


				}, function(err){
					return res.render('picture');
				});


	  		

		  });


	  	
  	
	  });

  });

  
  
});




router.post('/:id', function (req, res) {
  var slug = '';
	if (req.params.slug)
		slug = req.params.slug;

  if (slug === '')
    return res.redirect('/');

  if (!req.isAuthenticated() )
  	return res.redirect('/picture/'+slug);

  var comment	= req.body.comment;
  console.log(comment)
  model.getPicturesBySlugToken(slug, function(picture) {
  	
    if (!picture[0]) {
      var err = new Error('The Picture you are looking for does not exist.');
  		err.status = 404;
  		return next(err);
  	}

  	model.addComment(comment, req.user.id, picture[0].id, function(responce) {
	    if (!responce)
	    	return res.send({ status: 'failed'});
	    return res.send({ status: 'success'});
	  });

	});
});





module.exports = router;
