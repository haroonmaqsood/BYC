var express			= require('express'),
		router			= express.Router(),
		model				= require('../model');



router.get('/:slug', function(req, res, next) {
	var slug = '';
	if (req.params.slug)
		slug = req.params.slug;

  if (slug === '' || !slug.length > 2 || slug.length > 80) {
	  var err = new Error('Profile does not exsist mofo!');
	  err.status = 404;
	  return next(err);
  } else {
  	model.getPicturesBySlugToken(slug, function(picture) {

	    if (!picture[0]) {
	      var err = new Error('The Picture you are looking for does not exist.');
	  		err.status = 404;
	  		return next(err);
	  	}

	  	model.getPictureComments(picture[0].id, function(comments) {

	  		// for (var i = comments.length - 1; i >= 0; i--) {
					// model.getUsernameFromId(comments[i].user_id, function(err, result){
					//     // console.log(err || result);
					//     // comments[i].push({username: result});
					//     console.log(comments)
					//     // console.log(comments[i].username)
					// });
	  		// };

		  	res.locals.comments = comments;
		  	res.locals.picture = picture[0];
		  	return res.render('picture');

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


module.exports = router;
