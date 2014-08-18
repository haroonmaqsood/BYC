var express			= require('express'),
		router			= express.Router(),
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
  	model.getPicturesBySlugToken(slug, function(responce_picture) {

	    if (!responce_picture[0]) {
	      var err = new Error('The Picture you are looking for does not exist.');
	  		err.status = 404;
	  		return next(err);
	  	}	  	

	  	model.getPictureComments(responce_picture[0].id, function(responce_comments) {
	  		//!THIS IS FOR ADDING USERNAME TO COMMENTS YET TO FINISH!
	  		// for (var i = responce_comments.length - 1; i >= 0; i--) {
					// model.getUsernameFromId(responce_comments[i].user_id, function(err, result){
					//     // console.log(err || result);
					//     // responce_comments[i].push({username: result});
					//     console.log(responce_comments)
					//     // console.log(responce_comments[i].username)
					// });
	  		// };

		  	res.locals.comments = responce_comments;
		  	res.locals.picture = responce_picture[0];

	  		model.likeStatus(req.user.id, responce_picture[0].id, function(responce_likeStatus) {
	  			res.locals.likeStatus = responce_likeStatus;
	  			return res.render('picture');
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



router.post('/:slug/like', function (req, res) {
  
  if (!req.params.slug) return res.send({ status: 'failed'});

	model.getPicturesBySlugToken(req.params.slug, function(responce_getPicturesBySlugToken) {
		if (!responce_getPicturesBySlugToken || req.user.id === responce_getPicturesBySlugToken[0].id)
			return res.send({ status: 'failed'});
	  
		model.likeStatus(req.user.id, responce_getPicturesBySlugToken[0].id, function(responce_likeStatus) {
			console.log(responce_likeStatus)
			if (responce_likeStatus) {
				// UNFOLLOW
				model.unlikePicture(req.user.id, responce_getPicturesBySlugToken[0].id, function(responce) {
			    if (!responce) return res.send({ status: 'failed'});
			    return res.send({ status: 'unliked'});
		  	});
			} else {
				// FOLLOW USER
				model.likePicture(req.user.id, responce_getPicturesBySlugToken[0].id, function(responce) {
			    if (!responce) return res.send({ status: 'failed'});
			  	return res.send({ status: 'liked'});
			  });
			}
		});
  });
});




module.exports = router;
