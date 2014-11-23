var express 			= require('express'),
		router 				= express.Router(),
    cryptoToken   = require('crypto').randomBytes,
		formidable    = require('formidable'),
    util          = require('util'),
    utils       	= require('../inc/utils'),
    gm 						= require('gm').subClass({ imageMagick: true }),
    fs            = require('fs-extra'),
    model         = require('../model'),
    getSlug       = require('speakingurl'),
    async         = require('async');



router.get('/:slug/edit', function(req, res, next) {
  
  if (!req.isAuthenticated() )
    return res.redirect('/login');

  if (req.params.slug !== 'undefined') {
    
    model.getMySetBySlugToken(req.user.id, req.params.slug, function(set) {

      if (!set[0]) {
        var err = new Error('This picture set does not exsist.');
        err.status = 404;
        return next(err);
      }

      model.getPictures(set[0].id, 1, function(pictures) {
        
        if (!pictures[0]) {
          var err = new Error('This picture set does not exsist.');
          err.status = 404;
          return next(err);
        }

        res.locals.setId = set[0].id;
        res.locals.pictures = pictures;
        return res.render('edit_set');

      });
      
    });
  }

  // return res.redirect('/')

});


router.post('/:slug/edit', function (req, res) {
  if (!req.isAuthenticated() )
  	return res.send({redirect:'/login'});
  
	if (!req.params.slug)
    return res.send({redirect:'/home'});

  var title   = req.body.title;
  if ( title && (!title.length > 2 || title.length > 81) ) {
    return res.send(400, { status: 'failed', reason: 'Title Size must be between 3-80 Characters' });
  }
  





    async.waterfall([
      doesPictureExist  = function(callback){

        model.getMySetBySlugToken(req.user.id, req.params.slug, function(set) {
          if (!set[0]) {
            var err = new Error('This picture set does not exsist.');
            err.status = 404;
            return next(err);
          }
          callback(null, set);

        });

      },
      publishSet        = function(set, callback){


        callback(null, set);

      },
      sendNotification  = function(set, callback){
        // Check to see if you are following your self.
        if (req.user.id === set[0].user_id)
          callback(null, set);

        // Send new picture notifications to all followers.
        model.getFollowers(set[0].user_id, function(followers) {
          console.log(followers) // DEV
          async.each(followers, function(item, callback) {
            setTimeout(function() {
              model.addNotification(set[0].user_id, item.follower, 'newPicture', set[0].id, function(notification) {
                console.log('Notified: '+ item.follower)
                callback();
              });

            }, 2 * Math.random() * 1000);
          }, function(err) {
            console.log('> Followed all users.');
          });
          
        });

        callback(null, set);

      }
    ], function (set, err) {
      console.log('set')
      console.log(set)
      console.log('err')
      console.log(err)

      // if (current title == new title) {};
      
      // Update Image Title
      var slug = getSlug(title)+'-'+cryptoToken(2).toString('hex');
      model.updateImageTitle(title, slug, set[0].id, function(response) {
        console.log(response)
        if (!response)
          return res.send(400, { status: 'failed'});
        
        return res.send({status: 'success', redirect:'/set/'+slug});

      });


    });







});


module.exports = router;
