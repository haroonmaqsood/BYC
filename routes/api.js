var express			= require('express'),
		router			= express.Router(),
		model				= require('../model');


router.get('/popular', function(req, res) {
  
  if (!req.isAuthenticated()) return res.send('login');
  if (!req.user.steptwo) return res.send('steptwo');


  // POPULAR
  var from   = req.body.from,
      too    = req.body.to;

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
    var from   = req.body.from,
        too    = req.body.to;
  
    if (!from) from = 0;
    if (!too) too = 10;

    model.getPicturesFromUsers(following, from, too, function(pictures) {
      return res.send(pictures);
    });  

  });


});

module.exports = router;
