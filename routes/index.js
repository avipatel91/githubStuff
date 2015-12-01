var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next){
   url = 'https://api.github.com/users/' + req.body.user_name 
   var opts = {
     url: url,
     headers: {'User-Agent': 'request'}
   };

   request.get(opts, function(error, response, body){
     if(!error && response.statusCode == 200){
        var info = JSON.parse(body);
        var user_info = {}
        user_info.user =  info.name
        user_info.email = info.email
        user_info.login = info.login
        user_info.grav_img = info.avatar_url
        user_info.followers = info.followers
        user_info.following = info.following
        user_info.public_repos = info.public_repos
        
        opts.url = info.repos_url
        request.get(opts, function(error, response, body){
            if(!error && response.statusCode == 200){
                var info = JSON.parse(body);
                var repos = []
                for(var i = 0; i < info.length; i++){
                   temp = []
                   temp.push(info[i].name)
                   temp.push(info[i].html_url)
                   repos.push(temp)
                }
                user_info.repos = repos
                res.render('index', user_info);
            }
        });
     }
   });
});


module.exports = router;
