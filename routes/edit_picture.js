var express 			= require('express'),
		router 				= express.Router(),
    cryptoToken   = require('crypto').randomBytes,
		formidable    = require('formidable'),
    util          = require('util'),
    utils       	= require('../inc/utils'),
    gm 						= require('gm').subClass({ imageMagick: true }),
    fs            = require('fs-extra'),
    model         = require('../model'),
    getSlug       = require('speakingurl');



router.get('/:slug/edit', function(req, res, next) {
  
  if (!req.isAuthenticated() )
    return res.redirect('/login');

  if (req.params.slug !== 'undefined') {
    
    model.getMyPicturesBySlugToken(req.user.id, req.params.slug, function(responce) {

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
  	return res.send({redirect:'login'});
  
	if (!req.params.slug)
    return res.send({redirect:'home'});
  
  model.getMyPicturesBySlugToken(req.user.id, req.params.slug, function(picture) {

    if (picture[0]) {

      var title   = req.body.title,
          cropX   = req.body.cropX,
          cropY   = req.body.cropY,
          cropW   = req.body.cropW,
          cropH   = req.body.cropH;

      if ( (!title.length > 2 || title.length > 81) ) {
        return res.send({ status: 'Title Size must be between 3-80 Characters', field:'title' });
      }

      // If all cropping fields are not provided then it will just reload the page.
      if (!cropX || !cropY || !cropW || !cropH) return res.send({redirect:'/picture/'+req.params.slug+'/edit'});

      var new_location  = 'public/uploads/cropped/',
          file_name     = picture[0].picture;
      
      // Gets original image, crops and resizes it.
      gm('public/uploads/'+picture[0].picture).options({imageMagick: true})
      .crop(cropW, cropH, cropX, cropY)
      .resize(600)
      .write(new_location+file_name, function (err) {
        if (err) {
          console.log(err);
          return false
        }

        var slug = getSlug(title)+'-'+cryptoToken(2).toString('hex'),
            crop = JSON.stringify({'cropX':cropX, 'cropY':cropY, 'cropW':cropW, 'cropH':cropH});

        model.updateImageTitle(title, slug, crop, picture[0].id, function(responce) {
          console.log(responce)
          if (!responce)
            return res.send({ status: 'Something went wrong please try again.'});
          
          return res.send({redirect:'/picture/'+slug});

        });


        return res.send({redirect:'/picture/'+slug});
      });

  
      
    
    }
  });

});


module.exports = router;
