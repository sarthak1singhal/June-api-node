// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
var con = require('../params.js')
const AWS = require('aws-sdk');

const { v4: uuidv4 } = require('uuid');

var bcrypt = require('bcrypt-nodejs');

const { version } = require('os');


readJson = require("r-json");
const config = readJson(`config.json`);
AWS.config.update({
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretKey
});

const BUCKET_NAME = 'juneappbucket';
var request = require('request')

module.exports = function(app, passport) {






    app.get('/vid', (req, res) => {


        let s3 = new AWS.S3();


        var p = req.query.p

        console.log(p, "GET VIDEO")
        s3.getSignedUrl('getObject', { Bucket: BUCKET_NAME, Key: p, Expires: 3600 }, function(error, url) {
            if (error || !url) {
                //error while creating the URL\

                console.log("SASAS")
                res.status(500).end();
            } else {

                console.log(url)
                    //make a request to the signed URL to get the file and pipe the res to the client
                request({
                    url: url
                }).pipe(res);
            }
        });


    })


















    app.get('/img', (req, res) => {


        let s3 = new AWS.S3();


        var p = req.query.p

        console.log(p, "GET IMG")
        s3.getSignedUrl('getObject', { Bucket: BUCKET_NAME, Key: p, Expires: 3600 }, function(error, url) {
            if (error || !url) {
                //error while creating the URL\

                console.log("SASAS")
                res.status(500).end();
            } else {

                console.log(url)
                    //make a request to the signed URL to get the file and pipe the res to the client
                request({
                    url: url
                }).pipe(res);
            }
        });


    })






    app.get('/gif', (req, res) => {


        let s3 = new AWS.S3();


        var p = req.query.p

        console.log(p, "GET gif")
        s3.getSignedUrl('getObject', { Bucket: BUCKET_NAME, Key: p, Expires: 3600 }, function(error, url) {
            if (error || !url) {
                //error while creating the URL\

                console.log("SASAS")
                res.status(500).end();
            } else {

                console.log(url)
                    //make a request to the signed URL to get the file and pipe the res to the client
                request({
                    url: url
                }).pipe(res);
            }
        });


    })


};