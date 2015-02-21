var express			= require('express'),
		router			= express.Router(),
		model				= require('../model'),
    async       = require('async');


router.get('/popular', function(req, res) {
  
  if (!req.isAuthenticated()) return res.send('login');
  if (!req.user.steptwo) return res.send('steptwo');

  // POPULAR
  var from   = parseInt(req.query.from),
      too    = parseInt(req.query.too),
      output = [];
  if (!from) from = 0;
  if (!too) too = 36;
  
  model.getRecentSets(from, too, function(response_getRecentSets) {
    async.each(response_getRecentSets, function(set, cb) {
      var featured = "'"+set['featured']+"'";
      model.getMyPicturesById(featured, function(response_getMyPicturesById) {
        var newPush = set;
        newPush['picture'] = response_getMyPicturesById[0]['picture'];
        output.push(newPush);
        cb();
      });
    }, function(err){
      if(err) throw err;
      console.log(output)
      return res.send(output);
    });
  });

});


router.get('/following', function(req, res) {
  
  if (!req.isAuthenticated()) return res.send('login');
  if (!req.user.steptwo) return res.send('steptwo');

console.log("line 43 api.js getting following");
  // FOLLOWING
  model.getFollowing(req.user.id, function(following) {
    
    var from   = parseInt(req.query.from),
        too    = parseInt(req.query.too),
        output = [];
    if (!from) from = 0;
    if (!too) too = 36;

    // model.getSetFromUsers(following, from, too, function(pictures) {
    //   return res.send(pictures);
    // });
    model.getSetFromUsers(following, from, too, function(response_getSetFromUsers) {
      async.each(response_getSetFromUsers, function(set, cb) {
        var featured = "'"+set['featured']+"'";
        model.getMyPicturesById(featured, function(response_getMyPicturesById) {
          var newPush = set;
          newPush['picture'] = response_getMyPicturesById[0]['picture'];
          newPush['slug'] = response_getMyPicturesById[0]['slug']; 
          output.push(newPush);
          cb();
        });
      }, function(err){
        if(err) throw err;
        console.log(output)
        return res.send(output);
      });
    });

  });


});


router.get('/myNotifications', function(req, res) {
  
  if (!req.isAuthenticated()) return res.send('login');
  if (!req.user.steptwo) return res.send('steptwo');

  // Notifications
  console.log("line 84 api.js getting notification for user "+req.user.id);
  model.getNotifications(req.user.id, function(notifications) {
    return res.send(notifications);
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
        model.unfollowUser(req.user.id, followingData[0].id, function(response) {
          if (!response) return res.send(400, { status: 'failed'});
          
          if (req.user.id === followingData[0].id)
            return res.send({ status: 'unfollowed'});
        
          model.removeNotification(req.user.id, followingData[0].id, 'follow', followingData[0].id, function(notification) {
            console.log(notification)
            return res.send({ status: 'unfollowed'});
          });


        });
      } else {
        // FOLLOW USER
        model.followUser(req.user.id, followingData[0].id, function(response) {
          if (!response) return res.send(400, { status: 'failed'});

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

  model.likeStatus(req.user.id, req.params.setId, function(response_likeStatus) {
    model.countLikes(req.params.setId, function(response_countLikes) {
      return res.send({status: response_likeStatus, count: response_countLikes[0].count})
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
        model.likeStatus(req.user.id, req.params.setId, function(response_likeStatus) {
          if (response_likeStatus) {
            // UNLIKE
            model.unlikeSet(req.user.id, req.params.setId, function(response) {
              if (!response) return res.send({ status: 'failed'});

              if (req.user.id === setOwner[0].user_id)
                return callback(null, 'unliked');
            
              model.removeNotification(req.user.id, setOwner[0].user_id, 'like', req.params.setId, function(notification) {
                console.log(notification)
                return callback(null, 'unliked');
              });
              
            });
          } else {
            // LIKE
            model.likeSet(req.user.id, req.params.setId, setOwner[0].user_id, function(response) {
              if (!response) return res.send({ status: 'failed'});

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
        model.countLikes(req.params.setId, function(response_countLikes) {
          return callback(null, response_countLikes[0].count);
        });
      },
    }, function(err, result) {
      return res.send({ status: result.likeStatus, count: result.countLikes});
    });

  });

});

      




module.exports = router;
