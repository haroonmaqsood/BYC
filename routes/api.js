var express			= require('express'),
		router			= express.Router(),
		model				= require('../model');


router.get('/popular', function(req, res) {
  
  if (!req.isAuthenticated()) return res.send('login');
  if (!req.user.steptwo) return res.send('steptwo');


  // POPULAR
  model.getRecentPictures(0, 10, function(responce) {
  	return res.send(responce);
  });  

});



router.get('/following', function(req, res) {
  
  if (!req.isAuthenticated()) return res.send('login');
  if (!req.user.steptwo) return res.send('steptwo');


  // FOLLOWING
  model.getFollowing(req.user.id, function(following) {

    model.getPicturesFromUsers(following, 0, 10, function(pictures) {
      return res.send(pictures);
    });  

  });


});

module.exports = router;
