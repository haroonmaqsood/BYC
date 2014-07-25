var express = require('express'),
		router = express.Router();


/* GET users listing. */
router.get('/', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;
