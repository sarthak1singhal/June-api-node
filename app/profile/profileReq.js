var path = require('path');
const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");

module.exports = function(app) {










    app.post('/my-liked-video', fx.isLoggedIn, async function(req, res) {


        var fb_id = req.user.id;

        console.log(req.body);
        console.log(fb_id);
        if (req.body.offset == null) {
            return res.send({
                isError: true,
                msg: "Parameters error"
            });
        }
        offset = req.body.offset;
        if (!req.body.limit) {
            return res.send({
                isError: true,
                msg: "Parameters error"
            });
        }
        limit = req.user.limit;

        if (fb_id) {

            var acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });


            try {






                [query1, f] = await acon.execute("select * from users where fb_id=? ", [fb_id]);


                if (query1.length != 0) {

                    console.log(fb_id);
                    console.log(offset);

                    console.log(limit);
                    [_query, l] = await acon.execute("select * from video_like_dislike where fb_id= ? order by id DESC limit ?, ?", [fb_id, offset, limit]);

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
                                "id": null,
                                "audio_path": {
                                    "mp3": null,
                                    "acc": null
                                },
                                "sound_name": null,
                                "description": null,
                                "thum": null,
                                "section": null,
                                "created": null,

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









                }



                res.send({ "isError": false, msg: array_out_video })





            } catch (e) {
                console.log(e);
            }


        } else {
            res.send(

                {

                    isError: true,

                    msg: "Json Parem are missing"

                })
        }






















    })



    app.post('/get-followers', fx.isLoggedIn, async function(req, res) {

        fb_id = req.body.fb_id;
        offset = req.body.offset;
        if (offset == null) {
            return res.send({
                isError: true,
                msg: "Invalid parameter"
            })
        }
        if (!fb_id) {
            return res.send({
                isError: true,
                msg: "Invalid parameter"
            })
        }

        try {
            let acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });

            let [row, f] = await acon.execute("select * from `follow_users` where `followed_fb_id` = ? order by id DESC limit ?, 40", [fb_id, offset])

            array_out = [];

            for (i in row) {
                let [rd1, f] = await acon.execute("select * from users where fb_id = ?", [row[i].fb_id])


                let [follow_count, s1] = await acon.execute("SELECT count(*) as count from follow_users where followed_fb_id=? and fb_id=? ", [row[i].fb_id, fb_id])


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


            return res.send({ "isError": false, msg: array_out })


        } catch (e) {
            console.log(e)

            return res.send({
                isError: true,
                msg: "Some error occured"
            })
        }



    })








    app.post('/get-followers', fx.isLoggedIn, async function(req, res) {

        fb_id = req.body.fb_id;
        offset = req.body.offset;
        if (offset == null) {
            return res.send({
                isError: true,
                msg: "Invalid parameter"
            })
        }
        if (!fb_id) {
            return res.send({
                isError: true,
                msg: "Invalid parameter"
            })
        }


        try {




            var acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });



            [query1, f] = await acon.execute("select * from follow_users where fb_id=? order by id DESC limit ?, 40", [fb_id, offset]);

            array_out = [];

            for (i in query1) {


                [rd1, l] = await acon.execute("select * from users where fb_id=? ", [query1[i].followed_fb_id]);

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

    })






};
};