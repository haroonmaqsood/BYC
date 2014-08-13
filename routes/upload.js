var express 			= require('express'),
		router 				= express.Router(),
		cryptoToken 	= require('crypto').randomBytes,
		formidable    = require('formidable'),
    util          = require('util'),
    utils       	= require('../inc/utils'),
    gm 						= require('gm').subClass({ imageMagick: true }),
    fs            = require('fs-extra'),
    model	        = require('../model'),
    getSlug       = require('speakingurl');


/* GET users listing. */
router.get('/', function(req, res) {
  if (!req.isAuthenticated() )
  	return res.redirect('/login');

  res.render('upload');
});


router.post('/', function (req, res) {
  if (!req.isAuthenticated() )
  	return res.redirect('/login');

	var form 			= new formidable.IncomingForm(),
			token			= cryptoToken(16).toString('hex'),
			file_name = req.user.id+'_'+token;

  form.parse(req, function(err, fields, files) {

    res.locals.pic = file_name;
    res.redirect('/picture/'+token+'/edit');

  });

  form.on('end', function(fields, files) {
    
    var temp_path = this.openedFiles[0].path,
    		file_ext	= utils.getExtension(this.openedFiles[0].name),
    		new_location = 'public/uploads/';

    fs.copy(temp_path, new_location+file_name+file_ext, function(err) {  
      if (err) {
        console.error(err);
      } else {
      	console.log('uploaded!')

      	var ip     = req.connection.remoteAddress || null,
      			agent  = req.headers;

      	model.uploadPicture(req.user.id, req.user.id+'_'+token+'.jpg', token, ip, agent, function(responce) {
      		console.log(responce)
      	});

      	// CROPABILITY
				// gm(appDir+'/'+new_location+file_name+file_ext).options({imageMagick: true}).write(appDir+'/'+new_location+file_name+'_crop.jpg', function (err) {
				//   if (err) {
				//   	console.log(err);
				//   	return false
				//   }

				//   console.log('done');
				// });


      }
    });
  });

});


module.exports = router;
