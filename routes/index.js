var express			= require('express'),
		router			= express.Router(),
		model				= require('../model');


router.get('/', function(req, res) {
  
  if (!req.isAuthenticated()) return res.render('index');
  if (!req.user.steptwo) return res.redirect('/steptwo');
  
  return res.render('dashboard');
});

module.exports = router;
