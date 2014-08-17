var express 			= require('express'),
		router 				= express.Router(),
		cryptoToken 	= require('crypto').randomBytes,
		formidable    = require('formidable'),
    util          = require('util'),
    utils       	= require('../inc/utils'),
    gm 						= require('gm').subClass({ imageMagick: true }),
    fs            = require('fs-extra'),
    model	        = require('../model'),
    getSlug       = require('speakingurl'),
    async         = require('async');


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
    console.log('form.parse START');

    // files.upload.type <--- USE IT TO CHECK IF ITS AN IMG
    console.log(files.upload.type);
    
    // res.locals.pic = file_name;
    // res.redirect('/picture/'+token+'/edit');

    console.log('form.parse START');
  });

  form.on('end', function(fields, files) {
    console.log('form.on end START');

    var temp_path     = this.openedFiles[0].path,
    		new_location  = 'public/uploads/',
        // needle        = files.upload.type,
        haystack      = ['image/jpeg', 'image/png'];


    // if (haystack.indexOf(needle)) {

      gm(temp_path).size(function(err, value) {
        if (err || value.width <= 599 || value.height <= 729) {
          
          // LOG TO SENTRY
          if (err) throw err;
          res.redirect('/upload?ERROR-OR-WIDTH-HEIGHT-TOO-SHORT');
        
        } else {

          // IMAGE RESIZING
          gm(temp_path).options({imageMagick: true})
          // .resize(600)
          .write(new_location+file_name+'.jpg', function (err) {
            if (err) {
              console.log(err);
              return false
            }
            
            var ip     = req.connection.remoteAddress || null,
                agent  = req.headers;

            model.uploadPicture(req.user.id, req.user.id+'_'+token+'.jpg', token, ip, agent, function(responce) {
              res.locals.pic = file_name;
              res.redirect('/picture/'+token+'/edit');
            });

          });

        }
      });

    // } else {
    //   res.redirect('/upload?WRONG-FILE-FORMAT');
    // }

    console.log('form.on end FINISH');
  });

});


module.exports = router;
