var express = require('express');
var store = require('../store');
var User = require('../models').User;
var Tweet = require('../models').Tweet;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // var tweets = store.list();
  Tweet.findAll({include: [User]}).complete(function(err, tweet_arr) {
    var tweets = tweet_arr.map(function(item) {
      return {"name":item.User.name, "text":item.tweet, "id":item.id};
    });
    res.render('index', { title: 'Twitter.js', tweets: tweets, "show_form":true, "fill_name":true });
  });
});

router.get('/users/:name/', function(req, res) {
  var name = req.params.name;
  User.find({where : {"name":name}}).complete(function(err, user) {
    var user_id=user.id;
    Tweet.findAll({where : {UserId:user_id}}).complete(function(err, tweet_arr) {
      var tweets = tweet_arr.map(function(item) {
        return {"name":name, "text":item.tweet, "id":item.id};
      })
      res.render('index', { title: 'Twitter.js', tweets: tweets, "show_form":true, "fill_name":true });
    });
  });
});

router.get('/users/:name/tweets/:id', function(req, res) {
  var id = parseInt(req.params.id);
  var name = req.params.name;
  // var list = store.find({"name":name, "id":id});
  Tweet.find({where : {"id":id}, include : [User]})
    .success( function(item) {
      if(name===item.User.name) {
        var tweets=[{"name":name, "text":item.tweet, "id":item.id}];
        res.render('index', { title: 'Twitter.js - Posts with ID # '+ id, tweets:tweets, "show_form":true});
      } else {
        res.redirect('/users/' + item.User.name + '/tweets/' + item.id);
      }
    })
    .failure(function(err) {
      res.redirect('/');
    });
});

router.post('/submit', function(req, res) {
  var name = req.body.name;
  var text = req.body.text;
  //store.push(name, text);
  //var get_tweet = store.find({"name":name, "text":text});
  //io.sockets.emit("new_tweet", get_tweet[0]);
  User.findOrCreate({where: {"name":name}}).success(function(user, created) {
      Tweet.create({"UserId":user.id, "tweet":text}).complete(function() {
        res.redirect('/'); 
      });
  });
});

module.exports = router;

