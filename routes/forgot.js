var express 		= require('express'),
		router 			= express.Router(),
		model	      = require('../model'),
		passport 		= require('passport'),
		cryptoToken = require('crypto').randomBytes,
		bcrypt      = require('bcrypt-nodejs'),
		mandrill 		= require('mandrill-api/mandrill'),
		utils       = require('../inc/utils');
		


router.get('/', function(req, res) {
  
  if ( req.isAuthenticated() ) {
  	if (!req.user.steptwo)
			return res.redirect('/steptwo');
  	return res.redirect('/');
  }

  res.render('forgot');

});



router.post('/', function(req, res, next) {

	var email     = req.body.email.trim();
  
  if ( (email.length > 100 || email.length < 5) || !utils.validateEmail(email) )
    return res.send(400, { status: 'failed', reason: 'Please check the email field and try again.'});
  
  model.getProfileFromEmail(email, function(response) {
  	if (!response)
  		return res.send(400, { status: 'failed', reason: 'Looks like that email does not exist in our database. Please check and try again.'});

  	var mandrill_client = new mandrill.Mandrill('zkQ2OBWuNFUbxW_hE19LIQ');

		var message = {
	    "html": "<p>Forgot Password: <a href='"+options.root_url+"forgot/"+response[0].username+"/"+response[0].token+"/'>"+options.root_url+"forgot/"+response[0].username+"/"+response[0].token+"/</a></p>",
	    "text": "Forgot Password: "+options.root_url+"forgot/"+response[0].username+"/"+response[0].token+"/",
	    "subject": "Forgot Password",
	    "from_email": "support@hairshare.co",
	    "from_name": "Hairshare Support",
	    "to": [{
	            "email": "sufian.hassan.786@gmail.com",
	            "name": "Sufian Hassan",
	            "type": "to"
	        }],
	    "headers": {
	        "Reply-To": "support@hairshare.co"
	    },
	    "tags": [
	        "password-resets"
	    ],
		};
		var async = true;
		var ip_pool = "Main Pool";
		mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
		    console.log(result);

		   if (result[0].status == 'spam')
		   	return res.send(400, { status: 'failed', reason: 'Looks like the email was sent but was flagged as spam make sure you check your spam box.' });

		   if (result[0].status !== 'sent')
		   	return res.send(400, { status: 'failed', reason: 'Looks like the email was rejected by the mail server for the following reason: '+result[0].reject_reason });
		   
		   return res.send({ status: 'success' });
		   

		}, function(e) {
		    // Mandrill returns the error as an object with name and message keys
		    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		    throw e;
		    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
		});

		
  });

	
});





router.get('/:username/:token/', function(req, res) {
  
  if ( req.isAuthenticated() ) {
  	if (!req.user.steptwo)
			return res.redirect('/steptwo');
  	return res.redirect('/');
  }

  if (req.params.username == 'undefined' || req.params.token == 'undefined')
  	return res.redirect('/forgot');


  var username 	= req.params.username,
			token 		= req.params.token;

	console.log(username)
	console.log(token)


	model.getProfileFromUsername(username, function(response) {
		console.log(response[0].token)
		if (!response || response[0].token !== token)
			return res.send(400, { status: 'failed', reason: 'Invalid Link'});

		return res.render('forgot-reset');
	});

  

});


router.post('/:username/:token/', function(req, res) {
  
  if ( req.isAuthenticated() ) {
  	if (!req.user.steptwo)
			return res.redirect('/steptwo');
  	return res.redirect('/');
  }

  if (req.params.username == 'undefined' || req.params.token == 'undefined')
  	return res.redirect('/forgot');

  var username 				= req.params.username,
			token 					= req.params.token,
			newPassword			= req.body.newPassword,
			currentPassword	= req.body.currentPassword;

  if (newPassword.length < 3 || newPassword.length > 150 || newPassword !== currentPassword)
  	return res.send(400, { status: 'failed', reason: 'Something went wrong, check the passwords and try again.'});

  

	model.getProfileFromUsername(username, function(user_response) {
		console.log(user_response[0].token)
		if (!user_response || user_response[0].token !== token)
			return res.send(400, { status: 'failed', reason: 'Invalid Link'});

		var hashedPassword	= bcrypt.hashSync(newPassword),
				newToken				= cryptoToken(16).toString('hex');

		model.updatePassword(user_response[0].id, hashedPassword, newToken, function(password_response){
			console.log(password_response)
		});

		return res.send({ status: 'success'});
		// return res.render('forgot-reset');
	});

  

});

module.exports = router;


