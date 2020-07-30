// app/routes.js
var uuid = require('uuid');
const https = require('request')
 
 var path = require('path');
 
const AWS = require('aws-sdk');
const fs = require('fs');
readJson = require("r-json");
const config = readJson(`config.json`);

AWS.config.update({
    accessKeyId: config.awsAccessID,
    secretAccessKey: config.awsSecretKey
  });

var s3 = new AWS.S3();
 
module.exports = {
    
    

    uploadVideo : function(req){

 
 
        if(req.query.fb_id){
            
        }

    },



    uploadAWSVideo : function(req,res){

 
        console.log(req.query);

        if(req.query.fb_id){
            
        }

    }
 
 

};



 