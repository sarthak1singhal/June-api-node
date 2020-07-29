// app/routes.js
var uuid = require('uuid');
const https = require('request')
 
 var path = require('path');
 const axios = require('axios');
 readJson = require("r-json");
 const config = readJson(`config.json`);
 
 
module.exports = {
    
    

    sendNotification : function(data){

        headers = {
            "authorization": "key=" + config.fcmKey,
            'cache-control': "no-cache",
            'content-type': "application/json",
            'postman-token': "85f96364-bf24-d01e-3805-bccf838ef837"
        }
        axios.post('https://fcm.googleapis.com/fcm/send', data, headers)
        .then(function (response) {
        // handle success
        console.log(response,"is response");
        })
        .catch(function (error) {
        // handle error
        console.log(error, "error");
        })

    }
 
 

};



 