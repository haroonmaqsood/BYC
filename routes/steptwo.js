var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
    model	      = require('../model');

router.get('/', function(req, res) {
	if (!req.user || req.user.steptwo)
		return res.redirect('/');
  return res.render('steptwo');
});

router.post('/', function (req, res) {

	if (!req.user || req.user.steptwo)
		return res.redirect('/');
  
  req.checkBody('firstName', 'This field is required!').notEmpty();
  req.checkBody('lastName', 'This field is required!').notEmpty();
  req.checkBody('hairType', 'This field is required!').notEmpty();
  req.checkBody('course', 'This field is required!').notEmpty();
  req.checkBody('lastHairSalon', 'This field is required!').notEmpty();
  req.checkBody('lastCutCost', 'This field is required!').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors, 400);
  }

  req.checkBody('lastCutCost', 'Place type in a correct ammount').isFloat();


  req.checkBody('firstName', 'First Name must be between 2-50 characters').isLength(2, 50);
  req.checkBody('lastName', 'Last Name must be between 2-50 characters').isLength(2, 50);


  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors, 400);
  }

  var firstName   = req.param('firstName'),
  		lastName	  = req.param('lastName'),
  		hairType	  = req.param('hairType'),
  		course	    = req.param('course'),
  		lastHairSalon	  = req.param('lastHairSalon'),
  		lastCutCost	= req.param('lastCutCost');
 
 	if (firstName && lastName && hairType && course && lastHairSalon && lastCutCost) {
 		model.stepTwo(req.user.id, firstName, lastName, hairType, course, lastHairSalon, lastCutCost, function(responce) {

    	model.stepTwoComplete(req.user.id, function(response) {    		
    		req.user.steptwo = response;
    		return res.send({ status: 'success'});
    	});

 		});

 	} else {
 		return res.send({ status: 'failed'});
 	}

});

module.exports = router;