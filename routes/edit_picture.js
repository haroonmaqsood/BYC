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



router.get('/:id/edit', function(req, res, next) {
  
  if (!req.isAuthenticated() )
    return res.redirect('/login');

  var id = req.params.id;
  if (!id) {
    var err = new Error('Picture does not exsist!');
    err.status = 404;
    return next(err);
  }

  model.getMyPicturesById(id, function(responce) {

    if (!responce) {
      var err = new Error('Picture does not exsist!');
      err.status = 404;
      return next(err);
    }
    if (responce[0]) {
      res.locals.picture = responce[0];
      return res.render('edit_picture');
    }
    
  });

});


router.post('/:id/edit', function (req, res) {
  if (!req.isAuthenticated() )
  	return res.send({redirect:'/login'});
  
  var id = req.params.id;
	if (!id)
    return res.send({redirect:'/home'});
  
  model.getMyPicturesById(id, function(picture) {
    if (!picture[0])
      return res.send(400, { status:'fail', reason: 'Picture does not exsist'  });

    model.getMySetBySetId(req.user.id, picture[0].set_id, function(set) {
      if (!set[0])
        return res.send(400, { status:'fail', reason: 'Picture does not exsist'  });

      var cropX   = req.body.cropX,
          cropY   = req.body.cropY,
          cropW   = req.body.cropW,
          cropH   = req.body.cropH;

      // If all cropping fields are not provided
      if (cropX == '' || cropY == ''  || cropW == ''  || cropH == '' ) return res.send(400, { status: 'failed', reason: 'Please make sure the image is inside the crop margins from all sides.' });

      var new_location  = 'public/uploads/cropped/',
          file_name     = picture[0].picture;
      
      // Gets original image, crops and resizes it.
      gm('public/uploads/'+picture[0].picture).options({imageMagick: true})
      .crop(cropW, cropH, cropX, cropY)
      .resize(600)
      .write(new_location+file_name, function (err) {
        if (err) {
          console.log(err);
          return res.send(400, { status: 'failed'});
        }

        var crop = JSON.stringify({'cropX':cropX, 'cropY':cropY, 'cropW':cropW, 'cropH':cropH});


        model.updatePicture(picture[0].id, crop, function(responce) {
          console.log(responce)
          if (!responce)
            return res.send(400, { status: 'failed'});
          
          return res.send({status: 'success', redirect:'/set/'+set[0].slug+'/edit'});

        });


      });
    });


  });

});


module.exports = router;
