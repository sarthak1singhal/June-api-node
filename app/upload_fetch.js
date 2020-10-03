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


const BUCKET_NAME = 'juneappbucket';

module.exports = function(app, passport) {






    app.get('/vid', async(req, res) => {

        AWS.config.update({
            accessKeyId: config.awsAccessKey,
            secretAccessKey: config.awsSecretKey,
            region: "ap-south-1"
        });

        let s3 = new AWS.S3();


        var p = req.query.p

        res.attachment(p);

        var options = {
            Bucket: BUCKET_NAME,
            Key: p,

        };

        console.log(p, "name")
        try {
            await s3.getObject(options).
            createReadStream().pipe(res);
        } catch (e) {
            console.log(e)
        }


    })


















    app.get('/img', async(req, res) => {



        AWS.config.update({
            accessKeyId: config.awsAccessKey,
            secretAccessKey: config.awsSecretKey
        });

        let s3 = new AWS.S3();


        var p = req.query.p

        console.log(p, "GET IMG")
        res.attachment(p);

        var options = {
            Bucket: BUCKET_NAME,
            Key: p
        };
        await s3.getObject(options).createReadStream().pipe(res);




    })




    app.get('/local', async(req, res) => {


        res.sendFile(path.join(__dirname, "../upload/" + req.query.p));





    })




    app.get('/gif', async(req, res) => {
        AWS.config.update({
            accessKeyId: config.awsAccessKey,
            secretAccessKey: config.awsSecretKey
        });


        let s3 = new AWS.S3();


        var p = req.query.p


        if (p.includes("?")) {
            var a = p.split("?")
            p = a[0]
        }
        console.log(p, "GET gif")
        res.attachment(p);

        var options = {
            Bucket: BUCKET_NAME,
            Key: p
        };
        await s3.getObject(options).createReadStream().pipe(res);



    })


};