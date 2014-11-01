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


router.get('/front', function(req, res) {
  if (!req.isAuthenticated() )
    return res.redirect('/login');

  res.render('edit_picture');
});



router.post('/front', function(req, res) {
  if (!req.isAuthenticated() )
    return res.redirect('/login');

  var id = req.query.id;

  if (!id) {
    var token     = cryptoToken(16).toString('hex'),
        tokenTwo  = cryptoToken(16).toString('hex'),
        ip        = req.connection.remoteAddress || null,
        agent     = req.headers;
    model.createSet(req.user.id, token, ip, agent, function(setId) {
      model.uploadPicture(setId, req.user.id+'_'+tokenTwo+'.jpg', function(uploadPicture) {
        // req.user.id, req.user.id+'_'+token+'.jpg', token, ip, agent, 
        console.log(uploadPicture)
      });
    });
  };

  res.render('edit_picture');
});

router.get('/back', function(req, res) {
  if (!req.isAuthenticated() )
    return res.redirect('/login');

  res.render('edit_picture');
});

router.get('/left', function(req, res) {
  if (!req.isAuthenticated() )
    return res.redirect('/login');

  res.render('edit_picture');
});

router.get('/right', function(req, res) {
  if (!req.isAuthenticated() )
    return res.redirect('/login');

  res.render('edit_picture');
});



router.post('/', function (req, res) {
  if (!req.isAuthenticated() )
  	return res.redirect('/login');

	var form 			= new formidable.IncomingForm(),
			file_name = req.user.id+'_'+cryptoToken(16).toString('hex');

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

    if (!setId)
      return res.send({redirect: 'Invalid Request'});
    // if (haystack.indexOf(needle)) {

      gm(temp_path).size(function(err, value) {
        if (err || value.width <= 599 || value.height <= 729) {
          
          // LOG TO SENTRY
          if (err) throw err;
          return res.send({status: 'ERROR-OR-WIDTH-HEIGHT-TOO-SHORT'});
        
        } else {

          // IMAGE RESIZING
          gm(temp_path).options({imageMagick: true})
          // .resize(600)
          .autoOrient()
          .noProfile()
          .write(new_location+file_name+'.jpg', function (err) {
            if (err) {
              console.log(err);
              return false
            }

            console.log(new_location)
            console.log(file_name+'.jpg')

            async.waterfall({

              verifyCreateSet: function(callback) {
                var setId = res.locals.setId;
                if (setId) {
                  model.verifySet(req.user.id, setId, function(verifySet) {
                    if (setId)
                      return callback(null, setId);
                  });
                }
                var token = cryptoToken(16).toString('hex'),
                    ip    = req.connection.remoteAddress || null,
                    agent = req.headers;
                model.createSet(req.user.id, token, ip, agent, function(setId) {
                  return callback(null, setId);
                });

              },

              uploadPicture: function(callback, setId) {
                model.uploadPicture(setId, file_name+'.jpg', function(uploadPicture) {
                  console.log(uploadPicture)
                  if (uploadPicture)
                    return callback(null, setId, uploadPicture);
                });
              }

            }, function(err, results) {
              console.log(results)
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
