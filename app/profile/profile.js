// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
const { query } = require('../../params');
readJson = require("r-json");
const config = readJson(`config.json`);
const amysql = require('mysql2/promise');

module.exports = {






    get_user_data: async function(req, res) {


        fb_id = req.query.fb_id

        if (fb_id) {
            try {
                const acon = await amysql.createConnection({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });



                const [row, f] = await acon.execute("select * from users where fb_id = ?", [fb_id])

                array_out = [];
                for (i in row) {
                    array_out.push({
                        "fb_id": row[i]['fb_id'],
                        "username": row[i]['username'],
                        "verified": row[i]['verified'],
                        "first_name": row[i]['first_name'],
                        "last_name": row[i]['last_name'],
                        "gender": row[i]['gender'],
                        "bio": row[i]['bio'],
                        "content_language": row[i]['content_language'],
                        "profile_pic": row[i]['profile_pic'],
                        "created": row[i]['created']
                    });
                }


                res.send({ code: "200", msg: array_out })


            } catch (e) {
                console.log(e)
            }
        }




    },





    get_followers: async function(req, res) {

        fb_id = req.query.fb_id;

        if (fb_id) {

            if (fb_id.trim() == "") {

                res.send({
                    code: 201,
                    msg: { response: "Json Parem are missing" }
                })

                return
            }




            try {
                const acon = await amysql.createConnection({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });

                console.log(fb_id, "this is fbdi")
                const [row, f] = await acon.execute("select * from `follow_users` where `followed_fb_id` = ? order by DESC", [fb_id])

                array_out = [];

                for (i in row) {
                    const [rd1, f] = await acon.execute("select * from users where fb_id = ?", [row[i].fb_id])


                    const [follow_count, s1] = await acon.execute("SELECT count(*) as count from follow_users where followed_fb_id=? and fb_id=? ", [row[i].fb_id, fb_id])


                    follow = ""
                    follow_button_status = ""
                    if (follow_count[0]['count'] == "0" || follow_count[0]['count'] == 0) {
                        follow = "0";
                        follow_button_status = "Follow";
                    } else
                    if (follow_count[0]['count'] != "0" || follow_count[0]['count'] != 0) {
                        follow = "1";
                        follow_button_status = "Unfollow";
                    }


                    array_out.push({
                        "fb_id": rd1[0].fb_id,
                        "username": rd1[0].username,
                        "verified": rd1[0].verified,
                        "first_name": rd1[0].first_name,
                        "last_name": rd1[0].last_name,
                        "gender": rd1[0].gender,
                        "bio": rd1[0].bio,
                        "profile_pic": rd1[0].profile_pic,
                        "created": rd1[0].created,
                        "follow_Status": {

                            "follow": follow,
                            "follow_status_button": follow_button_status
                        }
                    });

                }


                res.send({ "code": 200, msg: array_out })


            } catch (e) {
                console.log(e)
            }

















        } else {
            res.send(

                {

                    code: 201,

                    msg: { response: "Json Parem are missing" }

                })
        }

    },







    get_followings: async function(req, res) {
        fb_id = req.query.fb_id;

        if (fb_id) {

            if (fb_id.trim() == "") return
            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });


            try {






                const [query1, f] = await acon.execute("select * from follow_users where fb_id=? order by id DESC", [fb_id]);

                array_out = [];

                for (i in query1) {


                    const [rd1, l] = await acon.execute("select * from users where fb_id=? ", [query1[i].followed_fb_id]);

                    //   [rd,l1]=await acon.execute("select * from users where fb_id= ? ",[query1[i].fb_id]);


                    [follow_count, k] = await acon.execute("SELECT count(*) as count from follow_users where fb_id = ? and followed_fb_id= ? ", [fb_id, query1[i].followed_fb_id]);

                    follow_button_status = ""
                    follow = ""

                    if (follow_count[0]['count'] == "0" || follow_count[0]['count'] == 0) {
                        follow = "0";
                        follow_button_status = "Follow";
                    } else
                    if (follow_count[0]['count'] != "0" || follow_count[0]['count'] != 0) {
                        follow = "1";
                        follow_button_status = "Unfollow";
                    }


                    array_out.push({
                        "fb_id": rd1[0].fb_id,
                        "username": rd1[0].username,
                        "verified": rd1[0].verified,
                        "first_name": rd1[0].first_name,
                        "last_name": rd1[0].last_name,
                        "gender": rd1[0].gender,
                        "bio": rd1[0].bio,
                        "profile_pic": rd1[0].profile_pic,
                        "created": rd1[0].created,
                        "follow_Status": {
                            "follow": follow,
                            "follow_status_button": follow_button_status
                        }
                    });


                }


                res.send({ "code": "200", msg: array_out })





            } catch (e) {
                console.log(e);
            }


        } else {
            res.send(

                {

                    code: 201,

                    msg: { response: "Json Parem are missing" }

                })
        }

    },




    my_liked_video: async function(req, res) {




        fb_id = req.query.fb_id;

        if (fb_id) {

            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });


            try {






                [query1, f] = await acon.execute("select * from users where fb_id=? ", [fb_id]);


                if (query1.length != 0) {
                    [_query, l] = await acon.execute("select * from video_like_dislike where fb_id= ? order by id DESC", [fb_id]);

                    array_out_video = []
                    for (i in _query) {

                        [rdd, l] = await acon.execute("select * from videos where id= ?", [_query[i].video_id]);

                        [rd12, ll] = await acon.execute("select * from sound where id= ?", [rdd[0].sound_id]);

                        [countLikes_count, l] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id=? ", [_query[i].video_id]);

                        [countcomment_count, l] = await acon.execute("SELECT count(*) as count from video_comment where video_id= ?", [_query[i].video_id]);

                        [liked_count, qq] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id= ? and fb_id= ?", [_query[i].video_id, fb_id]);

                        [rd11, ll] = await acon.execute("select * from users where fb_id=? ", [rdd[0].fb_id]);

                        smap = {}

                        if (rd12.length == 0) {
                            smap = {
                                "id": "null",
                                "audio_path": {
                                    "mp3": "null",
                                    "acc": "null"
                                },
                                "sound_name": "null",
                                "description": "null",
                                "thum": "null",
                                "section": "null",
                                "created": "null",

                            }
                        } else {
                            smap = {
                                "id": rd12[0].id,
                                "audio_path": {
                                    "mp3": rd12[0].id + ".mp3",
                                    "acc": rd12[0].id + ".aac"
                                },
                                "sound_name": rd12[0].sound_name,
                                "description": rd12[0].description,
                                "thum": rd12[0].thum,
                                "section": rd12[0].section,
                                "created": rd12[0].created,
                            }
                        }


                        array_out_video.push({
                            "id": rdd[0].id,
                            "video": rdd[0].video,
                            "thum": rdd[0].thum,
                            "gif": rdd[0].gif,
                            "description": rdd[0].description,
                            "liked": liked_count[0]['count'],
                            "user_info": {
                                "first_name": rd11[0].first_name,
                                "username": rd11[0].username,
                                "verified": rd11[0].verified,
                                "last_name": rd11[0].last_name,
                                "profile_pic": rd11[0].profile_pic,
                            },
                            "count": {
                                "like_count": countLikes_count[0]['count'],
                                "video_comment_count": countcomment_count[0]['count'],
                                "view": rdd[0].view,
                            },
                            "sound": smap,
                            "created": _query[i]['created']
                        });

                    }

                    count_video_rows = array_out_video.length

                    if (count_video_rows == 0)
                        array_out_video.push(0);






                    array_out = []
                    array_out.push({
                            "fb_id": fb_id,
                            "user_info": {
                                "first_name": _query.length != 0 ? _query[0].first_name : "",
                                "last_name": _query.length != 0 ? _query[0].last_name : "",
                                "profile_pic": _query.length != 0 ? _query[0].profile_pic : "",
                                "gender": _query.length != 0 ? _query[0].gender : "",
                                "created": _query.length != 0 ? _query[0].created : "",
                                "username": _query.length != 0 ? _query[0].username : "",
                                "verified": _query.length != 0 ? _query[0].verified : "",
                            },

                            "total_heart": "100",
                            "total_fans": "88",
                            "total_following": "55",
                            "user_videos": array_out_video
                        }


                    );


                }



                res.send({ "code": "200", msg: array_out })





            } catch (e) {
                console.log(e);
            }


        } else {
            res.send(

                {

                    code: 201,

                    msg: { response: "Json Parem are missing" }

                })
        }

    }



};