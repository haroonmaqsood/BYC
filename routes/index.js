var express			= require('express'),
		router			= express.Router(),
		model				= require('../model');


router.get('/', function(req, res) {
  
  if (!req.isAuthenticated()) return res.redirect('/login');
  if (!req.user.steptwo) return res.redirect('/steptwo');

  

  return res.render('index');
  

  

  

});

module.exports = router;
