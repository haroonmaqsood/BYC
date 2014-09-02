var express			= require('express'),
		router			= express.Router(),
		model				= require('../model');


router.get('/popular', function(req, res) {
  
  if (!req.isAuthenticated()) return res.send('login');
  if (!req.user.steptwo) return res.send('steptwo');

  // POPULAR
  var from   = parseInt(req.query.from),
      too    = parseInt(req.query.too);
  if (!from) from = 0;
  if (!too) too = 10;

  model.getRecentPictures(from, too, function(responce) {
  	return res.send(responce);
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
    if (!too) too = 10;

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
          return res.send({ status: 'unfollowed'});
        });
      } else {
        // FOLLOW USER
        model.followUser(req.user.id, followingData[0].id, function(responce) {
          if (!responce) return res.send(400, { status: 'failed'});
          return res.send({ status: 'followed'});
        });
      }


    });

  });

});




      




module.exports = router;
