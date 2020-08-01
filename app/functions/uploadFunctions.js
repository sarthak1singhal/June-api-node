// app/routes.js
var shortid = require('shortid');
const https = require('request')
var shortid = require('shortid');

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


        fb_id = req.body.fb_id

        description = req.body.description;
        sound_id = req.body.sound_id;
        thumb = req.body.picbase64['file_data']
        video = req.body.videobase64['file_data']
        gif = req.body.gifbase64['file_data']
        category = req.body.category;
        content_language = req.body.content_language;

        if (!content_language) content_language = " "

        if (!category) category = " "

        console.log("line54")

        console.log(fb_id)
        if (fb_id && video && gif) {

            var buf_video = Buffer.from(video, 'base64');
            var buf_gif = Buffer.from(gif, 'base64');
            var buf_img = Buffer.from(thumb, 'base64');

            filename = (new Date()).getTime().toString(36) + shortid.generate();

            console.log(filename, "FILENAME")
            const video_params = {
                Bucket: BUCKET_NAME,
                Key: "vid_" + filename + ".mp4 ",
                Body: buf_video
            };


            const gif_params = {
                Bucket: BUCKET_NAME,
                Key: "gif_" + filename + ".gif",
                Body: buf_gif
            };

            const img_params = {
                Bucket: BUCKET_NAME,
                Key: "img_" + filename + ".jpg",
                Body: buf_img
            };




            s3bucket.upload(video_params, function(error, data) {
                if (error) throw error
                console.log(`File uploaded successfully at ${data.Location}`)
                console.log(data, "IS DATA")
                console.log(req.body.category, "is categiry")
            });

            s3bucket.upload(gif_params, function(error, data) {
                if (error) throw error
                console.log(`File uploaded successfully at ${data.Location}`)
                console.log(data, "IS DATA")
                console.log(req.body.category, "is categiry")
            });

            s3bucket.upload(img_params, function(error, data) {
                if (error) throw error
                console.log(`File uploaded successfully at ${data.Location}`)
                console.log(data, "IS DATA")
                console.log(req.body.category, "is categiry")
            });





        }

    }



};