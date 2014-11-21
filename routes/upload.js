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

  res.locals.setId = req.query.setId;

  res.render('upload');
});



router.post('/', function(req, res) {
  console.log('----- post /upload')
  if (!req.isAuthenticated() )
    return res.redirect('/login');

  var setId = req.query.setId;

  var form      = new formidable.IncomingForm(),
      file_name = req.user.id+'_'+cryptoToken(16).toString('hex');

  form.parse(req, function(err, fields, files) {


    var position = fields.position;
    if (!position && !['front', 'back', 'left', 'right'].indexOf(position) > -1)
      return res.send({ status:'fail', msg: 'Incorrect position'  });

    var temp_path     = files.upload.path,
        new_location  = 'public/uploads/';
        // needle        = files.upload.type,
        // haystack      = ['image/jpeg', 'image/png'];

    // if (!setId)
    //   return res.send({redirect: 'Invalid Request'});
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
            console.log('Write Error:')
            console.log(err);
            console.log('/error')
            return false
          }

          console.log(new_location)
          console.log(file_name+'.jpg')

          async.waterfall([

            // verifyCreateSet
            function(callback) { 
              console.log('---- verifyCreateSet')
              // var setId = res.locals.setId;
              if (setId) {
                model.verifySet(req.user.id, setId, function(verifySet) {
                  console.log('Verify set:')
                  console.log(verifySet)
                  console.log(verifySet)
                  console.log('/verify')
                  if (setId)
                    return callback(null, setId);
                });
              } else {
                var token = cryptoToken(16).toString('hex'),
                    ip    = req.connection.remoteAddress || null,
                    agent = req.headers;
                model.createSet(req.user.id, token, ip, agent, function(createSet) {
                  console.log('Added new set:')
                  console.log(createSet)
                  console.log('/set')
                  return callback(null, createSet);
                });
              }

            },

            // getSetPicturePosition
            function(setId, callback) {
              console.log('---- getSetPicturePosition')
              model.getSetPicturePosition(setId, position, function(checkPicture) {
                console.log('Check picture position:')
                console.log(checkPicture)
                console.log('/picPosition')
                
                return callback(null, setId, checkPicture);
              });
            },


            // uploadPicture OR updatePicture
            function(setId, checkPicture, callback) {
              // console.log('S----------------------------------------------------------');
              // console.log( checkPicture[0] )
              // console.log( checkPicture[0].position == position )
              // console.log( checkPicture[0].position )
              // console.log( position )
              // console.log( checkPicture[0] && checkPicture[0].position == position )
              // console.log('F----------------------------------------------------------');

              if (checkPicture[0] && checkPicture[0].position == position) {
                model.updatePicture(setId, position, file_name+'.jpg', function(updatePicture) {
                  console.log('Update picture:')
                  console.log(updatePicture)
                  console.log('/updatePicture')
                  if (updatePicture)
                    return callback(null, setId, checkPicture[0].id, file_name+'.jpg');
                });
              } else {
                model.uploadPicture(setId, file_name+'.jpg', position, function(uploadPicture) {
                  console.log('Upload picture:')
                  console.log(uploadPicture)
                  console.log('/uploadPicture')
                  if (uploadPicture)
                    return callback(null, setId, uploadPicture, file_name+'.jpg');
                });
              }

            },

          ], function(err, setId, pictureId, file_name) {
            if (err) {
              console.log('Write Error:')
              console.log(err);
              console.log('/error')
              return false
            }
            console.log('Form Results')
            console.log(setId)
            console.log(pictureId)
            console.log('/result')
            console.log(file_name)
            // res.locals.picture = { picture: file_name, setId : setId }

            return res.redirect('/picture/'+pictureId+'/edit');

            
          });

          

        });

      }
    });

  });





  
});


module.exports = router;
