var express			= require('express'),
		router			= express.Router(),
		model				= require('../model');


router.get('/', function(req, res) {
  
  if (!req.isAuthenticated()) return res.redirect('/login');
  if (!req.user.steptwo) return res.redirect('/steptwo');


  // FOLLOWING
  model.getFollowing(req.user.id, function(following) {

  	model.getPicturesFromUsers(following, 0, 10, function(pictures) {
	  	res.locals.popular_pics = pictures
	  	return res.render('index');
	  });  

  });

  // POPULAR
  // model.getRecentPictures(0, 10, function(responce) {
  // 	res.locals.popular_pics = responce

  // 	return res.render('index');
  // });  

});

module.exports = router;
