var express = require('express');
var store = require('../store');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var tweets = store.list();
	res.render('index', { title: 'Twitter.js', tweets: tweets });
});



module.exports = router;

