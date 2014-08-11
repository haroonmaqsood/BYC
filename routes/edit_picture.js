var express 			= require('express'),
		router 				= express.Router(),
		cryptoToken 	= require('crypto').randomBytes,
		formidable    = require('formidable'),
    util          = require('util'),
    utils       	= require('../inc/utils'),
    gm 						= require('gm').subClass({ imageMagick: true }),
    fs            = require('fs-extra'),
    model_picture	= require('../models/pictures'),
    getSlug       = require('speakingurl');



router.get('/:slug/edit', function(req, res, next) {
  
  if (!req.isAuthenticated() )
    return res.redirect('/login');

  if (req.params.slug !== 'undefined') {
    
    model_picture.getMyPicturesBySlugToken(req.user.id, req.params.slug, function(responce) {
      console.log(responce[0])

      if (responce[0]) {
        res.locals.slug = req.params.slug;
        res.locals.picture = responce[0];
        return res.render('edit_picture');
      }
      
    });
  }


  // return res.redirect('/')


});


router.post('/:slug/edit', function (req, res) {
  if (!req.isAuthenticated() )
  	return res.redirect('/login');

	if (req.params.slug !== 'undefined')
    return res.redirect('/');

  model_picture.getMyPicturesBySlugToken(req.user.id, req.params.slug, function(responce) {
    if (responce[0]) {

      var title  = req.body.title;

      if ( (!title.length > 2 || !title.length < 81) ) {
        return res.send({ status: 'invalid field(s)' });
      }
      
      var slug = getSlug(title)+'-'+cryptoToken(6).toString('hex');
      model.updateImageTitle(title, slug, function(responce) {

        if (!responce)
          return res.send({ status: 'failed'});
          return res.redirect('/'+req.params.slug);

      });


    }
  });
  


  return res.redirect('/');

});


module.exports = router;
