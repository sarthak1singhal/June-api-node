// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
const { query } = require('../../params');
readJson = require("r-json");
const config = readJson(`config.json`);
const amysql = require('mysql2/promise');

module.exports = {



    showMyAllVideos: async function(req, res) {




        fb_id = req.query.fb_id;
        my_fb_id = req.query.my_fb_id;

        if (fb_id && my_fb_id) {

            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });


            try {






                const [query1, f] = await acon.execute("select * from users where fb_id=? ", [fb_id]);
                if (query1.length != 0) {

                    [query99, f1] = await acon.execute("select * from videos where fb_id= ? order by id DESC", [fb_id]);
                    console.log(query1)
                    array_out_video = []
                    for (i in query99) {

                        [countLikes, f2] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id=? ", [query99[i].id]);

                        [query112, f1] = await acon.execute("select * from sound where id=?", [query99[i].id]);

                        [countcomment, f2] = await acon.execute("SELECT count(*) as count from video_comment where video_id=? ", [query99[i].id]);

                        [liked, f1] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id= ? and fb_id=? ", [query99[i].id, fb_id]);

                        s = {};
                        if (query112.length == 0) {
                            s = {
                                "id": null,
                                "audio_path": {
                                    "mp3": null, //complete sound path here
                                    "acc": null
                                },
                                "sound_name": null,
                                "description": null,
                                "thum": null,
                                "section": null,
                                "created": null,

                            }
                        } else {
                            s = {
                                "id": query112[0].id,
                                "audio_path": {

                                    "mp3": config.apiUrl + query112[0].id + ".mp3",
                                    "acc": config.apiUrl + query112[0].id + ".aac"
                                },
                                "sound_name": query112[0].sound_name,
                                "description": query112[0].description,
                                "thum": config.apiUrl + query112[0].thum,
                                "section": query112[0].section,
                                "created": query112[0].created,
                            }
                        }

                        array_out_video.push({
                            "id": query99[i]['id'],
                            "video": config.apiUrl + query99[i]['video'],
                            "thum": config.apiUrl + query99[i]['thum'],
                            "description": query99[i]['description'],
                            "liked": liked[0]['count'],
                            "count": {
                                "like_count": countLikes[0]['count'],
                                "video_comment_count": countcomment[0]['count'],
                                "view": query99[i]['view'],
                            },
                            "sound": s,
                            "created": query99[i]['created']
                        });

                    }


                    //count total heart
                    [query123, k2] = await acon.execute("select * from videos where fb_id=? ", [fb_id]);

                    array_out_count_heart = 0;
                    for (u in query123) {
                        array_out_count_heart += query123[u]['id'] + ',';
                    }

                    array_out_count_heart = array_out_count_heart + '0';

                    [hear_count, qq] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id IN( ? ) ", [array_out_count_heart]);

                    //count total heart

                    //count total_fans

                    [total_fans, qq] = await acon.execute("SELECT count(*) as count from follow_users where followed_fb_id= ?", [fb_id]);

                    //count total_fans

                    //count total_following

                    [total_following, qq] = await acon.execute("SELECT count(*) as count from follow_users where fb_id= ?", [fb_id]);

                    //count total_following



                    console.log(total_following[0]["count"], "total following bc")
                    console.log(total_fans, "total fans bc")

                    count_video_rows = array_out_video.length;
                    if (count_video_rows == 0) {
                        //   array_out_video.push(0);
                    }


                    [follow_count, l] = await acon.execute("SELECT count(*) as count from follow_users where fb_id= ? and followed_fb_id=?", [my_fb_id, fb_id]);


                    follow = "0"
                    follow_button_status = "Follow";

                    if (follow_count[0]['count'] == 0) {
                        follow = "0";
                        follow_button_status = "Follow";
                    } else
                    if (follow_count[0]['count'] != 0) {
                        follow = "1";
                        follow_button_status = "Unfollow";
                    }

                    array_out = [];
                    array_out.push({
                            "fb_id": fb_id,
                            "user_info": {

                                "fb_id": query1[0].fb_id,
                                "first_name": query1[0].first_name,
                                "last_name": query1[0].last_name,
                                "profile_pic": query1[0].profile_pic,
                                "bio": query1[0].bio,
                                "gender": query1[0].gender,
                                "created": query1[0].created,
                                "username": query1[0].username,
                                "verified": query1[0].verified,
                                "content_language": query1[0].content_language,
                                "app_language": query1[0].app_language,

                            },
                            "follow_Status": {
                                "follow": follow,
                                "follow_status_button": follow_button_status
                            },
                            "total_heart": hear_count[0]['count'],
                            "total_fans": total_fans[0]['count'],
                            "total_following": total_following[0]['count'],
                            "user_videos": array_out_video
                        }

                    );




                    res.send({ code: "200", msg: array_out })


                }




















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