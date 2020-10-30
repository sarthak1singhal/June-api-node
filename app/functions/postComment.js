// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
readJson = require("r-json");
const config = readJson(`config.json`);
const con = require("../../params");
var func = require('./functions')

module.exports = function(app) {



    app.post("/post-comment", func.isLoggedIn, (req, res) => {
        fb_id = req.user.id;

        video_id = req.body.video_id;

        comment = req.body.comment

        console.log(req.body);

        if (fb_id && video_id && comment) {

            con.query("select * from users where fb_id = ?", [fb_id], function(e, r) {

                con.query("insert into video_comment(video_id,fb_id,comments)values(?,?,?)", [video_id, fb_id, comment], function(er, ro) {

                    if (er) console.log(er)

                    else {

                        arr = {
                            "fb_id": fb_id,
                            "video_id": video_id,
                            "comments": comment,
                            "user_info": {
                                "first_name": r[0].first_name,
                                "last_name": r[0].last_name,
                                "profile_pic": r[0].profile_pic,
                                "username": r[0].username,
                                "verified": r[0].verified,
                            },
                        }

                        res.send({ isError: false, msg: arr })

                        con.query("select * from videos where id = ?", [video_id], function(error, row) {


                            if (error) {
                                console.log(error)
                            } else {

                                console.log(row);
                                console.log(row[0]);
                                effected_fb_id = row[0].fb_id;

                                _token = row[0].tokon;
                                con.query("insert into notification(my_fb_id,effected_fb_id,type,value)values(?,?,?,?)", [fb_id, effected_fb_id, "comment_video", video_id], function(e1, r1) {

                                    if (e1) console.log(e1)

                                    else {

                                        con.query("select * from users where fb_id = ?", [effected_fb_id], function(e2, r2) {

                                            if (e2) console.log(e2)

                                            else {

                                                noti = {}
                                                noti = {
                                                    notification: {}
                                                }

                                                name = r[0].first_name;

                                                title = name + " posted a comment on your video"

                                                message = comment;
                                                noti['to'] = _token;
                                                noti['notification']['title'] = title;
                                                noti['notification']['body'] = message;
                                                // $notification['notification']['text'] = $sender_details['User']['username'].' has sent you a friend request';
                                                noti['notification']['badge'] = "1";
                                                noti['notification']['sound'] = "default";
                                                noti['notification']['icon'] = "";
                                                noti['notification']['image'] = "";
                                                noti['notification']['type'] = "";
                                                noti['notification']['data'] = "";
                                                func.sendNotification(noti)















                                            }


                                        })


                                    }



                                })
                            }


                        })

                    }


                })

            })



        } else {
            res.send(

                {

                    isError: true,

                    msg: "Json Parem are missing"

                })
        }
    })



};