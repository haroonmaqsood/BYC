var express 				= require('express'),
		router 					= express.Router(),
		model_picture		= require('../models/pictures');

router.get('/:slug', function(req, res, next) {
	var slug = '';

	if (req.params.slug) {
    slug = req.params.slug;
  }


  if (slug === '' || !slug.length > 2 || slug.length > 80) {
	  var err = new Error('Profile does not exsist mofo!');
	  err.status = 404;
	  return next(err);
  } else {
  	model_picture.getPicturesBySlugToken(slug, function(responce) {
  		
	    if (!responce[0]) {
	      var err = new Error('The Picture you are looking for does not exist.');
	  		err.status = 404;
	  		return next(err);
	  	}
	  	res.locals.picture = responce[0];
	  	return res.render('picture');

	  });
  }
  
  
});

module.exports = router;
