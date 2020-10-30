// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');

var con = require('../../params.js')

var func = require('./functions')

module.exports = function(app) {

    app.post("/likeDislikeVideo", func.isLoggedIn, (req, res) => {
        fb_id = req.user.id;
        action = req.body.action;

        video_id = req.body.video_id;

        if (fb_id && video_id) {


            if (action == 0) {
                con.query("Delete from video_like_dislike where video_id = ? and fb_id = ?", [video_id, fb_id], function(e, r) {

                    if (e) console.log(e)

                    else {
                        res.send({ code: "200", msg: { response: "Video unlike" } })

                        con.query("update videos SET `like` =`like`-1 WHERE id = ?", [video_id], function(e, r) {})

                    }


                })
            } else if (action == 1) {


                con.query("insert into video_like_dislike(video_id,fb_id,action, creator_id) values (?,?,?,?)", [video_id, fb_id, action, "", ], function(e, r) {

                    if (e) console.log(e)

                    else {
                        con.query("update videos set `like` = `like` + 1 where id = ?", [video_id], function(er, ro) {

                            if (er) console.log(er)

                        })

                        con.query("select * from videos where id = ?", [video_id], function(error, row) {

                            if (error) console.log(error)
                            if (row.length != 0) {
                                effected_fb_id = row[0].fb_id;

                                con.query("insert into notification(my_fb_id,effected_fb_id,type,value)values(?,?,?,?)", [fb_id, effected_fb_id, 'video_like', video_id], function(er1, r1) {
                                    if (er1) console.log(er1)

                                })

                                con.query("select * from users where fb_id = ?", [effected_fb_id], function(e3, r3) {

                                    if (e3) console.log(e3)
                                    else {


                                        con.query("select * from users where fb_id = ?", [fb_id], function(e4, r4) {
                                            if (e4) console.log(e4)
                                            else {
                                                noti = {}
                                                noti = {
                                                    notification: {}
                                                }

                                                name = r3[0].first_name;

                                                title = name + " liked your video"

                                                message = "You have received 1 more like on your video"
                                                noti['to'] = r4[0].tokon;
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
                                                res.send({ code: false, msg: "Liked" })

                                            }
                                        })

                                    }

                                })

                            }

                        })


                    }

                })

            }


        } else {
            res.send(

                {

                    isError: true,

                    msg: "Json Parem are missing"


                })
        }

    })



}