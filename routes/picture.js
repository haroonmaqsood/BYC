var express 				= require('express'),
		router 					= express.Router(),
		model_picture		= require('../models/pictures');

router.get('/:slug', function(req, res, next) {
	var slug = '';
	if (req.params.slug)
		slug = req.params.slug;

  if (slug === '' || !slug.length > 2 || slug.length > 80) {
	  var err = new Error('Profile does not exsist mofo!');
	  err.status = 404;
	  return next(err);
  } else {
  	model_picture.getPicturesBySlugToken(slug, function(picture) {

	    if (!picture[0]) {
	      var err = new Error('The Picture you are looking for does not exist.');
	  		err.status = 404;
	  		return next(err);
	  	}

	  	model_picture.getPictureComments(picture[0].id, function(comments) {

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

  var comment   = req.body.comment;

  model_picture.getPicturesBySlugToken(slug, function(picture) {
  	
    if (!picture[0]) {
      var err = new Error('The Picture you are looking for does not exist.');
  		err.status = 404;
  		return next(err);
  	}

  	model_picture.addComment(comment, req.user.id, picture[0].id, function(responce) {
	    if (!responce)
	    	return res.send({ status: 'failed'});
	    return res.send({ status: 'success'});
	  });

	});



  
  

});


module.exports = router;
