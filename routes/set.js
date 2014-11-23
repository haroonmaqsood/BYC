var express			= require('express'),
		router			= express.Router(),
		async				= require('async'),
		model				= require('../model');



router.get('/:slug', function(req, res, next) {
	if (!req.isAuthenticated() )
  	return res.redirect('/login');
	var slug = '';
	if (req.params.slug)
		slug = req.params.slug;

  if (slug === '' || !slug.length > 2 || slug.length > 80) {
	  var err = new Error('Profile does not exsist mofo!');
	  err.status = 404;
	  return next(err);
  } else {
  	model.getSetBySlugToken(slug, function(responce_set) {

	    if (!responce_set[0]) {
	      var err = new Error('The Picture you are looking for does not exist.');
	  		err.status = 404;
	  		return next(err);
	  	}

	  	model.getSetComments(responce_set[0].id, function(responce_comments) {

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
			  	res.locals.set = responce_set[0];

			  	async.parallel({
					    likeStatus: function(callbackOne){
					    	model.likeStatus(req.user.id, responce_set[0].id, function(responce_likeStatus) {
					  			res.locals.likeStatus = responce_likeStatus;
					  			return callbackOne();
					  		});
					    },
					    getSetFromUsers: function(callbackOne){ 
					    	model.getSetFromUsers(responce_set[0].user_id, 0, 10, function(responce_userPics) {
					    		res.locals.profileUserPics = responce_userPics;
					    		return callbackOne();
		  					});
					    },
					    getProfileById: function(callbackOne){ 
					    	model.getProfileById(responce_set[0].user_id, function(responce_getProfileId) {
					    		res.locals.profile = responce_getProfileId[0];
					    		return callbackOne();
		  					});
					    },

					    getPictures: function(callbackOne){ 
					    	model.getPictures(responce_set[0].id, 1, function(responce_pictures) {
					    		console.log(responce_pictures)
					    		res.locals.picture = responce_pictures;
					    		return callbackOne();
		  					});
					    },

					    // THIS NEEDS TO BE LOOKED AT TO BRING BACK TOP 3
					    // getUserSetLikes: function(callbackOne){ 
					    // 	model.getUserSetLikes(responce_set[0].user_id, 3, function(responce_getUserSetLikes) {
					    // 		async.eachSeries(responce_getUserSetLikes, function(set, callbackTwo) {
								 //    index = responce_getUserSetLikes.indexOf(set);
									// 	  console.log('----------DEV----------')
							  // 			console.log(responce_getUserSetLikes)
							  // 			console.log('----------FIN----------')
								 //    model.getSetByID(set.id, function(result){
									// 				console.log('----------DEV2----------')
									//   			console.log(result)
									//   			console.log('----------FIN2----------')
									// 	    responce_getUserSetLikes[index].id 			= result[0].id;
									// 	    responce_getUserSetLikes[index].title 	= result[0].title;
									// 	    responce_getUserSetLikes[index].slug 		= result[0].slug;
										    
									// 	    return callbackTwo();
									// 	});
								    
								 //  }, function(err) {
								 //  	res.locals.userPicsTop = responce_getUserSetLikes;
								 //  	return callbackOne();
								 //  });
					    		
					    		
		  					// });
					    // },
					    countLikes: function(callbackOne) {
					    	model.countLikes(responce_set[0].id, function(responce_countLikes) {
					  			res.locals.countLikes = responce_countLikes[0].count;
					    		return callbackOne();
					    	});
					    },


					}, function(err){
						return res.render('set');
					});

		  		

			  });


		  	
	  	
		  });

	  });
  }
  
  
});




router.post('/:slug', function (req, res) {
  var slug = '';
	if (req.params.slug)
		slug = req.params.slug;

  if (slug === '')
    return res.redirect('/');

  if (!req.isAuthenticated() )
  	return res.redirect('/set/'+slug);

  var comment	= req.body.comment;
  console.log(comment)
  model.getSetBySlugToken(slug, function(set) {
  	
    if (!set[0]) {
      var err = new Error('The Picture you are looking for does not exist.');
  		err.status = 404;
  		return next(err);
  	}

  	model.addComment(comment, req.user.id, set[0].id, function(responce) {
	    if (!responce)
	    	return res.send({ status: 'failed'});
	    console.log(responce)

			if (req.user.id === set[0].user_id)
				return res.send({ status: 'success'});

	    model.addNotification(req.user.id, set[0].user_id, 'comment', responce, function(notification) {

	    	console.log(notification)

	    	return res.send({ status: 'success'});
	    });
    
    

	  });

	});
});





module.exports = router;
