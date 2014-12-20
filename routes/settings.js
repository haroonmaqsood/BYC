var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
		cryptoToken = require('crypto').randomBytes,
    bcrypt      = require('bcrypt-nodejs'),
    model	      = require('../model'),
    formidable  = require('formidable'),
    gm          = require('gm').subClass({ imageMagick: true }),
    utils       = require('../inc/utils');

router.get('/', function(req, res) {
  if ( !req.isAuthenticated() )
    return res.redirect('/login');

  if (!req.user.steptwo)
      return res.redirect('/steptwo');

  res.render('settings');
});

router.post('/', function (req, res) {

  if ( !req.isAuthenticated() )
    return res.redirect({redirect:'login'});

  if (!req.user.steptwo)
      return res.redirect({redirect:'steptwo'});

  req.checkBody('email', 'Email is invalid').isEmail().isLength(5, 100);
  if (req.body.password !== '')
    req.checkBody('password', 'Password must be bwteen 3 - 100 characters').isLength(3, 100);

  var errors = req.validationErrors();
  if (errors)
    return res.send(errors, 400);
  
  model.updateEmail(req.param('email'), req.user.id, function(responce) {
    if (!responce)
      return res.send({ status: 'failed'});
    return res.send({status:'success'})
  });


});



router.post('/upload', function(req, res) {
  console.log('----- post /upload')
  if (!req.isAuthenticated() )
    return res.redirect('/login');

  var setId = req.query.setId;

  var form      = new formidable.IncomingForm(),
      file_name = req.user.id+'_'+cryptoToken(16).toString('hex');

  form.parse(req, function(err, fields, files) {


    var temp_path     = files.upload.path,
        new_location  = 'public/uploads/profile/',
        size          = {width: 125, height: 125};

    gm(temp_path).size(function(err, value) {
      if (err || value.width <= size.width || value.height <= size.height) {
        
        // LOG TO SENTRY
        if (err) throw err;
        return res.send({status: 'ERROR-OR-WIDTH-HEIGHT-TOO-SHORT'});
      
      } else {

        // IMAGE RESIZING
        gm(temp_path).options({imageMagick: true})
        // .resize(600)
        .autoOrient()
        .noProfile()
        .thumb(size.width, size.height, new_location+file_name+'.jpg', 100, function (err) {
          if (err) {
            console.log('Write Error:')
            console.log(err);
            console.log('/error')
            return false
          }

          console.log(new_location)
          console.log(file_name+'.jpg')

          return res.redirect('/settings');
        
        });

        // .write(new_location+file_name+'.jpg', function (err) {
        //   if (err) {
        //     console.log('Write Error:')
        //     console.log(err);
        //     console.log('/error')
        //     return false
        //   }

        //   console.log(new_location)
        //   console.log(file_name+'.jpg')

        //   return res.redirect('/settings');
        
        // });

      }
    });

  });





  
});


module.exports = router;