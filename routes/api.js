var express			= require('express'),
		router			= express.Router(),
		model				= require('../model'),
    async       = require('async');


router.get('/popular', function(req, res) {
  
  if (!req.isAuthenticated()) return res.send('login');
  if (!req.user.steptwo) return res.send('steptwo');

  // POPULAR
  var from   = parseInt(req.query.from),
      too    = parseInt(req.query.too);
  if (!from) from = 0;
  if (!too) too = 36;

  model.getRecentPictures(from, too, function(responce) {
  	return res.send(responce);
  });  

});


router.get('/myNotifications', function(req, res) {
  
  if (!req.isAuthenticated()) return res.send('login');
  if (!req.user.steptwo) return res.send('steptwo');

  // Notifications
  model.getNotifications(req.user.id, function(notifications) {
    return res.send(notifications);
  });


});



router.get('/following', function(req, res) {
  
  if (!req.isAuthenticated()) return res.send('login');
  if (!req.user.steptwo) return res.send('steptwo');


  // FOLLOWING
  model.getFollowing(req.user.id, function(following) {
    
    var from   = parseInt(req.query.from),
        too    = parseInt(req.query.too);
    if (!from) from = 0;
    if (!too) too = 36;

    model.getPicturesFromUsers(following, from, too, function(pictures) {
      return res.send(pictures);
    });  

  });


});


router.get('/checkFollow/:username', function(req, res) {
  if (!req.params.username || req.params.username.length > 20)
      return res.send({ status: 'failed'});
  if (!req.isAuthenticated()) return res.send({ status: 'login'});

  model.getProfileFromUsername(req.params.username, function(followingData) {
    if (!followingData) return res.send({ status: 'failed'});
  
    // FOLLOWING
    model.followStatus(req.user.id, followingData[0].id, function(followStatus) {
      return res.send({result:followStatus});
    });

  });

});



router.post('/doFollow/:username', function(req, res) {
  if (!req.params.username || req.params.username.length > 20)
      return res.send(400, { status: 'failed'});
  if (!req.isAuthenticated()) return res.send({ status: 'login'});

  model.getProfileFromUsername(req.params.username, function(followingData) {
    if (!followingData) return res.send(400, { status: 'failed'});
    
    // FOLLOWING
    model.followStatus(req.user.id, followingData[0].id, function(followStatus) {
      
      if (followStatus) {
        // UNFOLLOW
        model.unfollowUser(req.user.id, followingData[0].id, function(responce) {
          if (!responce) return res.send(400, { status: 'failed'});
          
          if (req.user.id === followingData[0].id)
            return res.send({ status: 'unfollowed'});
        
          model.removeNotification(req.user.id, followingData[0].id, 'follow', followingData[0].id, function(notification) {
            console.log(notification)
            return res.send({ status: 'unfollowed'});
          });


        });
      } else {
        // FOLLOW USER
        model.followUser(req.user.id, followingData[0].id, function(responce) {
          if (!responce) return res.send(400, { status: 'failed'});

          if (req.user.id === followingData[0].id)
            return res.send({ status: 'followed'});
        
          model.addNotification(req.user.id, followingData[0].id, 'follow', followingData[0].id, function(notification) {
            console.log(notification)
            return res.send({ status: 'followed'});
          });

        });
      }


    });

  });

});



router.get('/checkLike/:setId', function(req, res) {
  if (!req.isAuthenticated()) return res.send({ redirect: '/login'}, 400);

  model.likeStatus(req.user.id, req.params.setId, function(responce_likeStatus) {
    model.countLikes(req.params.setId, function(responce_countLikes) {
      return res.send({status: responce_likeStatus, count: responce_countLikes[0].count})
    });
  });
  
});



router.post('/doLike/:setId', function(req, res) {
  if (!req.isAuthenticated()) return res.send({ redirect: '/login'});

  model.getSetOwner(req.params.setId, function(setOwner) {
    if (!setOwner || req.user.id === req.params.setId)
      return res.send({ status: 'failed'});
    
    async.series({
      likeStatus: function(callback) {
        model.likeStatus(req.user.id, req.params.setId, function(responce_likeStatus) {
          if (responce_likeStatus) {
            // UNLIKE
            model.unlikeSet(req.user.id, req.params.setId, function(responce) {
              if (!responce) return res.send({ status: 'failed'});

              if (req.user.id === setOwner[0].user_id)
                return callback(null, 'unliked');
            
              model.removeNotification(req.user.id, setOwner[0].user_id, 'like', req.params.setId, function(notification) {
                console.log(notification)
                return callback(null, 'unliked');
              });
              
            });
          } else {
            // LIKE
            model.likeSet(req.user.id, req.params.setId, setOwner[0].user_id, function(responce) {
              if (!responce) return res.send({ status: 'failed'});

              if (req.user.id === setOwner[0].user_id)
                return callback(null, 'liked');
            
              model.addNotification(req.user.id, setOwner[0].user_id, 'like', req.params.setId, function(notification) {
                console.log(notification)
                return callback(null, 'liked');
              });

            });
          }
        });

      },
      countLikes: function(callback) {
        model.countLikes(req.params.setId, function(responce_countLikes) {
          return callback(null, responce_countLikes[0].count);
        });
      },
    }, function(err, result) {
      return res.send({ status: result.likeStatus, count: result.countLikes});
    });

  });

});

      




module.exports = router;
