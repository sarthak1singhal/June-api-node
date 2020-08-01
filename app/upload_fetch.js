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
        res.attachment(p);

        var options = {
            Bucket: BUCKET_NAME,
            Key: p
        };
        s3.getObject(options).createReadStream().pipe(res);



    })


















    app.get('/img', (req, res) => {


        let s3 = new AWS.S3();


        var p = req.query.p

        console.log(p, "GET IMG")
        res.attachment(p);

        var options = {
            Bucket: BUCKET_NAME,
            Key: p
        };
        s3.getObject(options).createReadStream().pipe(res);




    })






    app.get('/gif', (req, res) => {


        let s3 = new AWS.S3();


        var p = req.query.p

        console.log(p, "GET gif")
        res.attachment(p);

        var options = {
            Bucket: BUCKET_NAME,
            Key: p
        };
        s3.getObject(options).createReadStream().pipe(res);



    })


};