// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
var con = require('../params.js')

const { v4: uuidv4 } = require('uuid');

var bcrypt = require('bcrypt-nodejs');
var uploadFunctions = require('./functions/uploadFunctions.js');
var reportVideo = require('./functions/reportVideo.js');
const { version } = require('os');

var showAllVideos = require('./home/showAllVideos.js');

var showMyAllVideos = require('./profile/showMyAllVideos.js')
var discover = require('./discover/discover')
var likeDislikeVideo = require('./functions/likeDislikeVideo')

var postComment = require('./functions/postComment')
var showVideoComments = require('./functions/showVideoComments')
var sounds = require('./functions/sounds')
var profile = require('./profile/profile')

var edit_profile = require('./profile/edit_profile');
var getNotifications = require('./notifications/getNotifications');
readJson = require("r-json");
const config = readJson(`config.json`);

module.exports = function(app, passport) {

    app.post('/index', (req, res) => {


        console.log(req.body, "this is body")
        if (req.query.p) {
            var p = req.query.p;


            if (p != "uploadVideo") {
                req.query = req.body;

                req.body = {}
            }






            console.log("header-start", req.headers, 'eaders')



            if (p == "try_con") {
                res.send({ message: "working" })
            } else
            if (p == "uploadVideo") {
                if (config.isAWS)
                    uploadFunctions.uploadAWSVideo(req, res)
                else
                    uploadFunctions.uploadVideo(req, res)


            }
            if (p == "reportVideo") {
                reportVideo.reportVideo(req, res);
            }
            if (p == "signup") {
                signup(req, res);
            } else
            if (p == "showAllVideos") {
                showAllVideos.showAllVideos(req, res);
            } else
            if (p == "showMyAllVideos") {
                showMyAllVideos.showMyAllVideos(req, res);
            } else
            if (p == "discover") {
                discover.discover(req, res);
            } else
            if (p == "likeDislikeVideo") {
                likeDislikeVideo.likeDislikeVideo(req, res);
            } else
            if (p == "postComment") {
                postComment.postComment(req, res);
            } else
            if (p == "showVideoComments") {
                showVideoComments.showVideoComments(req, res);
            } else if (p == "updateVideoView") {
                updateVideoView(req, res);

            } else if (p == "allSounds") {
                sounds.allSounds(req, res);

            } else if (p == "fav_sound") {
                sounds.fav_sound(req, res);

            } else if (p == "my_liked_video") {
                profile.my_liked_video(req, res);
            } else if (p == "my_FavSound") {
                sounds.my_FavSound(req, res);
            } else if (p == "edit_profile") {
                edit_profile.edit_profile(req, res);
            } else if (p == "follow_users") {
                edit_profile.follow_users(req, res);
            } else if (p == "get_user_data") {
                profile.get_user_data(req, res);
            } else if (p == "get_followers") {
                profile.get_followers(req, res);
            } else if (p == "get_followings") {
                profile.get_followings(req, res);
            } else if (p == "SearchByHashTag") {
                discover.SearchByHashTag(req, res);
            } else if (p == "DeleteSound") {
                DeleteSound(req, res);
            } else if (p == "DeleteVideo") {
                DeleteVideo(req, res);
            } else if (p == "DeleteVideo") {
                DeleteVideo(req, res);
            } else if (p == "post_language") {
                post_language(req, res);
            } else if (p == "editSoundSection") {
                editSoundSection(req, res);
            } else if (p == "getNotifications") {
                getNotifications.getNotifications(req, res); //not done 
            } else if (p == "search") {
                discover.search(req, res);
            }


        }




    });


































};



function signup(req, res) {
    console.log(req.headers)


    header_device = req.headers.device;
    header_version = req.headers['version'];
    header_tokon = req.headers['tokon'];
    header_deviceid = req.headers['deviceid'];


    fb_id = req.query.fb_id;
    first_name = req.query.first_name;
    last_name = req.query.last_name;
    gender = req.query.gender;
    profile_pic = req.query.profile_pic;
    version1 = req.query.version;
    device = req.query.device
    signup_type = req.query.signup_type
    username = first_name + Math.floor(Math.random() * 10000000);
    //get a unique username here 

    if (!gender) gender = "";
    if (!last_name) last_name = "";
    if (!profile_pic) profile_pic = "";
    if (!device) device = "";
    if (!version1) version1 = "0";
    if (fb_id && first_name && last_name) {

        con.query("select * from users where fb_id = ?", [fb_id], function(e, r) {

            if (e) {
                res.send({
                    code: "200",
                    msg: { response: "problem in signup" }
                })
                console.log(e)
            }
            con.query("select * from device_tokon where fb_id= ?", [fb_id], function(er, ro) {

                if (er) {
                    res.send({
                        code: "200",
                        msg: { response: "problem in signup" }
                    })
                    console.log(er)
                }
                if (r.length != 0) {


                    console.log(r[0], "THIS IS ROW")

                    console.log(r[0].block, "locn")

                    console.log(r[0].first_name, "FIttjf name")
                    if (r[0].block == "0") {

                        lang = r[0].content_language
                        if (!lang) lang = ""

                        res.send(

                            {
                                code: "200",
                                msg: [{
                                    "fb_id": r[0].fb_id,
                                    "action": "login",
                                    "profile_pic": r[0].profile_pic,
                                    "first_name": r[0].first_name,
                                    "last_name": r[0].last_name,
                                    "username": r[0].username,
                                    "verified": r[0].verified,
                                    "bio": r[0].bio,
                                    "gender": r[0].gender,
                                    "tokon": r[0].tokon,
                                    "language": lang
                                }]
                            })
                    } else {

                        res.send({
                            code: "201",
                            msg: "Error in Login. Your account is blocked"
                        })
                    }
                } else {

                    con.query("insert into users(fb_id,username,first_name,last_name,profile_pic,version,device,signup_type,gender,bio,content_language,app_language, tokon, bearer_token)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [fb_id, username, first_name, last_name, profile_pic, version1, device, signup_type, gender, "", "", "", "", ""], function(error, row) {

                        if (error) {
                            console.log(error)

                            res.send({
                                code: "200",
                                msg: { response: "problem in signup" }
                            })
                        } else {

                            var date = new Date();
                            var timestamp = date.getTime();
                            tokon = timestamp + Math.floor(Math.random() * 100000000)
                            console.log(tokon, "RANDAAP")
                            con.query("insert into device_tokon(fb_id,tokon,phone_id)values(?,?,?)", [fb_id, tokon, header_deviceid], function(er1, ro1) {
                                if (er1) {

                                    console.log(er1)

                                } else {
                                    res.send({
                                        code: "200",
                                        msg: [{
                                            "fb_id": fb_id,
                                            "username": username,
                                            "action": "signup",
                                            "profile_pic": profile_pic,
                                            "first_name": first_name,
                                            "last_name": last_name,
                                            "signup_type": signup_type,
                                            "gender": gender,
                                            "tokon": tokon
                                        }]
                                    })
                                }


                            })

                        }


                    })

                }

            })


        })
    } else {

        res.send({
            code: "201",
            msg: { response: "Json Parem are missing signup" }
        })

    }


}



function updateVideoView(req, res) {

    id = req.query.id;

    if (id) {
        con.query("update videos set `view` = `view` + 1 where id = ?", [id], function(er, row) {


            res.send({
                code: "200",
                msg: { response: "success" }
            })


        })

    } else {

        res.send({
            code: "201",
            msg: { response: "Json Parem are missing updateVideoVIew" }
        })

    }

}



function DeleteSound(req, res) {

    id = req.query.id


    //delete the sound file
    if (!id) {
        id = ""
        res.send({ code: "201", msg: "ERROR" })

        return;
    }

    if (id.trim() != "") {

        con.query("delete from sound where id = ?", [id], function(e, r) {})


        con.query("delete from fav_sound where sound_id = ?", [id], function(e, r) {})

        con.query("update videos set sound_id = ? where sound_id = ?", ['0', id], function(e, r) {
            if (e) console.log(e)

            else {

                res.send({ code: "200", msg: { response: "video unlike" } })


            }
        })


    } else {
        res.send({ code: "201", msg: "ERROR delete sound" })
    }


}



function DeleteVideo(req, res) {


    id = req.query.id

    if (!id) {
        id = ""
        res.send({ code: "201", msg: "ERROR" })

        return;
    }

    if (id.trim() != "") {

        //delete gif and video files

        con.query("select * from videos where id = ?", [id], function(e, r) {









            res.send({ code: "200", msg: { response: "video unlike" } })


            con.query("delete from videos where id = ?", [id], function(ee, rr) {})


            con.query("delete from video_like_dislike where video_id = ?", [id], function(ee, rr) {})

            con.query("delete from video_comment where video_id = ?", [id], function(ee, rr) {})


        })

    } else {
        res.send({ code: "201", msg: "ERROR del" })
    }


}



function post_language(req, res) {

    fb_id = req.query.fb_id;
    _language = req.query.language

    if (fb_id && _language) {

        con.query("update users set content_language = ? where fb_id = ?", [_language.toLowerCase(), fb_id], function(e, r) {

            console.log("LANGUAGE SAVEs")

        })
    } else {
        console.log("NOR SAVED LANGUAFA")
    }

    res.send({ code: 200 });



}



function editSoundSection() {
    id = req.query.id;

    if (!id) id = ""
    section = req.query.section_name;

    if (!section) section = "";

    if (id.trim() != "" && section.trim() != "") {
        con.query("update sound_section set section_name = ? where id = ?", [section, id], function(e, r) {

            res.send({ code: "200", msg: "updated" })

        })
    }
}