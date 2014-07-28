var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:username', function(req, res, next) {
	var username = "GUEST";

	if (req.params.username !== 'undefined') {
    username = req.params.username;
  }


  if (username !== 'sufian' || username.length > 20) {
	  var err = new Error('Profile does not exsist mofo!');
	  err.status = 404;
	  return next(err);
  }
  
  res.send('You is on profile of '+username);
});

module.exports = router;
