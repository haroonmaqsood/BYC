var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
    model	      = require('../models/userInfo');

router.get('/', function(req, res) {
	if (!req.user || req.user.steptwo)
		return res.redirect('/');
  return res.render('steptwo');
});

router.post('/', function (req, res) {

	if (!req.user || req.user.steptwo)
		return res.redirect('/');

  var q1	= req.body.q1,
  		q2	= req.body.q2,
  		q3	= req.body.q3,
  		q4	= req.body.q4,
  		q5	= req.body.q5,
  		q6	= req.body.q6,
  		q7	= req.body.q7;
 
 	if (q1 && q2 && q3 && q4 && q5 && q6 && q7) {
 		model.stepTwo(req.user.id, q1, q2, q3, q4, q5, q6, q7, function(responce) {

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