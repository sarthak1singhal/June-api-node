var express = require('express');
var router = express.Router();
 var path = require('path');
 var con = require('../../params.js')

module.exports = function(app, passport){

 

  app.get('influencer/view_ad/:id', isLoggedIn, function(req, res){
   //show all the details of the company/personal brand/ and the advertisement
    var id = req.params.id;
    

  })


 

}

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()){
   console.log("LOgged in");

   return next();

 }
   
 console.log("NOT LOgged in");	
   res.redirect('/login');
}
