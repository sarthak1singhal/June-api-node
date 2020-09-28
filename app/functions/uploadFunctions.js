// app/routes.js
var shortid = require('shortid');
const https = require('request')
var shortid = require('shortid');
var con = require('../../params.js')

var path = require('path');

const AWS = require('aws-sdk');
const fs = require('fs');
readJson = require("r-json");
const config = readJson(`config.json`);
const ffmpeg = require('fluent-ffmpeg');
//const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg')

//ffm.setFfmpegPath(ffmpegInstaller.path);

const BUCKET_NAME = 'juneappbucket';


module.exports = {



    uploadVideo: function(req, res) {



        if (req.query.fb_id) {

        }

    },



    uploadAWSVideo: function(req, res) {
        const s3bucket = new AWS.S3({
            accessKeyId: config.awsAccessKey,
            secretAccessKey: config.awsSecretKey
        });

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
        if (!sound_id) sound_id = "0"
        if (!description) description = " "


        content_language = content_language.toLowerCase();
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

            });



            s3bucket.upload(img_params, function(error, data) {
                if (error) throw error

            });



            con.query("select * from discover_section where `section_name` = ?", [category.toLowerCase()], function(e, r) {

                if (r.length == 0) {
                    con.query("insert into discover_section (section_name, value) values (?,?)", [category.toLowerCase(), 0], function(e1, r1) {

                        if (e1) console.log(e1)
                        con.query("select * from discover_section where `section_name` = ?", [category.toLowerCase()], function(e2, r2) {

                            cat_id = 0;
                            if (r2.length != 0) {
                                cat_id = r2[0].id

                            }

                            con.query("insert into videos(description,video,sound_id,section,fb_id,gif,thum,category,language)values(?,?,?,?,?,?,?,?,?)", [description, "vid?p=" + video_params.Key, sound_id,

                                cat_id, fb_id, "gif?p=" + gif_params.Key, "img?p=" + img_params.Key, category, content_language
                            ], function(ee, rr) {


                                arr = [];
                                arr.push({ response: "file uploaded " })
                                res.send({
                                    code: "200",
                                    msg: arr

                                })
                            })



                        })


                    })
                } else {

                    cat_id = r[0].id;



                    con.query("insert into videos(description,video,sound_id,section,fb_id,gif,thum,category,language)values(?,?,?,?,?,?,?,?,?)", [description, "vid?p=" + video_params.Key, sound_id,

                        cat_id, fb_id, "gif?p=" + gif_params.Key, "img?p=" + img_params.Key, category, content_language
                    ], function(ee, rr) {

                        arr = [];
                        arr.push({ response: "file uploaded " })
                        res.send({
                            code: "200",
                            msg: arr

                        })

                    })


                }
            })


        } else {

            arr = [];
            arr.push({ response: "file not uploaded " })
            res.send({
                code: "201",
                msg: arr

            })
        }

    }



};