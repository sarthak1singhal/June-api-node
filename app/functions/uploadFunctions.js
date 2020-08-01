// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');

const AWS = require('aws-sdk');
const fs = require('fs');
readJson = require("r-json");
const config = readJson(`config.json`);


const BUCKET_NAME = 'juneappbucket';

const s3bucket = new AWS.S3({
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretKey
});

module.exports = {



    uploadVideo: function(req) {



        if (req.query.fb_id) {

        }

    },



    uploadAWSVideo: function(req, res) {
        var file = req.files.file;

        console.log(req.files, "FOELS\n")
        console.log(req.query);

        if (req.query.fb_id) {

            const params = {
                Bucket: BUCKET_NAME,
                Key: "myapp" + "/" + "fileName",
                Body: readStream
            };









        }

    }



};