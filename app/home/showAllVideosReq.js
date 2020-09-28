var path = require('path');
const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);

module.exports = function(app) {





    app.post('/showAllVideos', async function(req, res) {


        //v = ["hindi", "enlish", language]



        try {
            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });

            hmap = {};
            arr = [];





            let [row_posts, fields] = await acon.execute("Select * from videos order by rand() limit 20");

            for (j in row_posts) {
                let [query1, f] = await acon.execute("select * from users where fb_id=? ", [row_posts[j].fb_id]);

                let [query112, f1] = await acon.execute("select * from sound where id= ?", [row_posts[j].sound_id]);


                let [countcomment, y] = await acon.execute("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);


                let [liked, fk] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id=? and fb_id= ?", [row_posts[j].id, row_posts[j].fb_id]);

                score = 1000 + row_posts[j]['like'] - 1.5 * row_posts[j]['unlike'] - 2 * row_posts[j]['report'];

                if (row_posts[j]['view'] > 1000) {
                    score = row_posts[j]['like'] - 10 * row_posts[j]['report'] - 7 * row_posts[j]['unlike'];
                } else
                if (row_posts[j]['view'] > 10000) {
                    score = row_posts[j]['like'] - 120 * row_posts[j]['report'] - 70 * row_posts[j]['unlike'];
                }


                if (score > 0) {
                    smap = {};
                    if (query112.length == 0) {

                        smap = {
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
                        smap = {
                            "id": query112[0].id,
                            "audio_path": {
                                "mp3": config.apiUrl + query112[0].id + ".mp3", //complete sound path here
                                "acc": config.apiUrl + query112[0].id + ".aac"
                            },
                            "sound_name": query112[0].sound_name,
                            "description": query112[0].description,
                            "thum": config.apiUrl + config.apiUrl + query112[0].thum,
                            "section": query112[0].section,
                            "created": query112[0].created,

                        }
                    }





                    arr.push({
                        "id": row_posts[j]['id'],
                        "fb_id": row_posts[j]['fb_id'],
                        "user_info": [{
                            "first_name": query1[0].first_name,
                            "last_name": query1[0].last_name,
                            "profile_pic": query1[0].profile_pic,
                            "username": query1[0].username,
                            "verified": query1[0].verified,
                        }],
                        "count": {
                            "like_count": row_posts[j]['like'],
                            "video_comment_count": countcomment[0]['count']
                        },
                        "video": config.apiUrl + row_posts[j]['video'],
                        "thum": config.apiUrl + row_posts[j]['thum'],
                        "description": row_posts[j]['description'],
                        "sound": smap,

                        "created": row_posts[j]['created']
                    });



                }


            }







            return res.send({ isError: false, msg: arr })

        } catch (e) {
            res.send({
                isError: true,
                msg: "Some error"
            })
            console.log(e)
            return
        }






















    })






    app.post('/videos-by-sound', async function(req, res) {


        //v = ["hindi", "enlish", language]



        try {
            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });

            hmap = {};
            arr = [];



            if (!req.body.sound_id) {
                return res.send({
                    isError: true,
                    msg: "Invalid Parameters"
                })

            }
            if (!req.body.offset) {
                return res.send({
                    isError: true,
                    msg: "Invalid Parameters"
                })

            }

            let [row_posts, fields] = await acon.execute("Select * from videos where sound_id = ? offset = ? limit = 15", [req.body.sound_id, req.body.offset]);

            for (j in row_posts) {
                let [query1, f] = await acon.execute("select * from users where fb_id=? ", [row_posts[j].fb_id]);

                let [query112, f1] = await acon.execute("select * from sound where id= ?", [row_posts[j].sound_id]);


                let [countcomment, fn] = await acon.execute("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);





                if (row_posts[j]['report'] < 30) {
                    smap = {};
                    if (query112.length == 0) {

                        smap = {
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
                        smap = {
                            "id": query112[0].id,
                            "audio_path": {
                                "mp3": config.apiUrl + query112[0].id + ".mp3", //complete sound path here
                                "acc": config.apiUrl + query112[0].id + ".aac"
                            },
                            "sound_name": query112[0].sound_name,
                            "description": query112[0].description,
                            "thum": config.apiUrl + config.apiUrl + query112[0].thum,
                            "section": query112[0].section,
                            "created": query112[0].created,

                        }
                    }





                    arr.push({
                        "id": row_posts[j]['id'],
                        "fb_id": row_posts[j]['fb_id'],
                        "user_info": [{
                            "first_name": query1[0].first_name,
                            "last_name": query1[0].last_name,
                            "profile_pic": query1[0].profile_pic,
                            "username": query1[0].username,
                            "verified": query1[0].verified,
                        }],
                        "count": {
                            "like_count": row_posts[j]['like'],
                            "video_comment_count": countcomment[0]['count']
                        },
                        "video": config.apiUrl + row_posts[j]['video'],
                        "thum": config.apiUrl + row_posts[j]['thum'],

                        "description": row_posts[j]['description'],
                        "sound": smap,
                        "created": row_posts[j]['created']
                    });



                }


            }







            return res.send({ isError: false, msg: arr })

        } catch (e) {
            console.log(e)

            return res.send({
                isError: true,
                msg: "Some error"
            })
        }






















    })







    app.post('/videos-by-hashtag', async function(req, res) {


        //v = ["hindi", "enlish", language]



        if (!req.body.hashtag) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters"
            })

        }
        if (!req.body.offset) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters"
            })

        }

        if (!req.body.hashtag.trim()) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters"
            })

        }


        let keyword = "#" + req.body.hashtag;


        try {
            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });

            hmap = {};
            arr = [];





            let [row_posts, fields] = await acon.execute("Select * from videos where description like '%" + keyword + "%' offset = " + req.body.offset + " limit 15");

            for (j in row_posts) {
                let [query1, f] = await acon.execute("select * from users where fb_id=? ", [row_posts[j].fb_id]);

                let [query112, f1] = await acon.execute("select * from sound where id= ?", [row_posts[j].sound_id]);


                let [countcomment, m] = await acon.execute("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);


                let [liked, nm] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id=? and fb_id= ?", [row_posts[j].id, row_posts[j].fb_id]);

                score = 1000 + row_posts[j]['like'] - 1.5 * row_posts[j]['unlike'] - 2 * row_posts[j]['report'];

                if (row_posts[j]['view'] > 1000) {
                    score = row_posts[j]['like'] - 10 * row_posts[j]['report'] - 7 * row_posts[j]['unlike'];
                } else
                if (row_posts[j]['view'] > 10000) {
                    score = row_posts[j]['like'] - 120 * row_posts[j]['report'] - 70 * row_posts[j]['unlike'];
                }


                if (score > 0) {
                    smap = {};
                    if (query112.length == 0) {

                        smap = {
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
                        smap = {
                            "id": query112[0].id,
                            "audio_path": {
                                "mp3": config.apiUrl + query112[0].id + ".mp3", //complete sound path here
                                "acc": config.apiUrl + query112[0].id + ".aac"
                            },
                            "sound_name": query112[0].sound_name,
                            "description": query112[0].description,
                            "thum": config.apiUrl + config.apiUrl + query112[0].thum,
                            "section": query112[0].section,
                            "created": query112[0].created,

                        }
                    }





                    arr.push({
                        "id": row_posts[j]['id'],
                        "fb_id": row_posts[j]['fb_id'],
                        "user_info": [{
                            "first_name": query1[0].first_name,
                            "last_name": query1[0].last_name,
                            "profile_pic": query1[0].profile_pic,
                            "username": query1[0].username,
                            "verified": query1[0].verified,
                        }],
                        "count": {
                            "like_count": row_posts[j]['like'],
                            "video_comment_count": countcomment[0]['count']
                        },
                        "video": config.apiUrl + row_posts[j]['video'],
                        "thum": config.apiUrl + row_posts[j]['thum'],
                        "description": row_posts[j]['description'],
                        "sound": smap,
                        "created": row_posts[j]['created']
                    });



                }


            }







            return res.send({ isError: false, msg: arr })

        } catch (e) {

            console.log(e)

            return res.send({
                isError: true,
                msg: "Some error"
            })
        }






















    })










    app.post('/videos-by-user', async function(req, res) {


        //v = ["hindi", "enlish", language]



        if (!req.body.fb_id) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters"
            })

        }
        if (!req.body.offset) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters"
            })

        }

        if (offset == 0) {
            showMyAllVideos(req, res);


            return;
        }



        try {
            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });


            arr = [];





            let [row_posts, fields] = await acon.execute("Select * from videos where fb_id = ? offset = ? limit 12 order by created desc", [req.body.fb_id, req.body.offset]);

            for (j in row_posts) {
                let [query1, f] = await acon.execute("select * from users where fb_id=? ", [row_posts[j].fb_id]);

                let [query112, f1] = await acon.execute("select * from sound where id= ?", [row_posts[j].sound_id]);


                let [countcomment, f3] = await acon.execute("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);


                let [liked, nm] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id=? and fb_id= ?", [row_posts[j].id, row_posts[j].fb_id]);

                score = 1000 + row_posts[j]['like'] - 1.5 * row_posts[j]['unlike'] - 2 * row_posts[j]['report'];

                if (row_posts[j]['view'] > 1000) {
                    score = row_posts[j]['like'] - 10 * row_posts[j]['report'] - 7 * row_posts[j]['unlike'];
                } else
                if (row_posts[j]['view'] > 10000) {
                    score = row_posts[j]['like'] - 120 * row_posts[j]['report'] - 70 * row_posts[j]['unlike'];
                }


                if (score > 0) {
                    smap = {};
                    if (query112.length == 0) {

                        smap = {
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
                        smap = {
                            "id": query112[0].id,
                            "audio_path": {
                                "mp3": config.apiUrl + query112[0].id + ".mp3", //complete sound path here
                                "acc": config.apiUrl + query112[0].id + ".aac"
                            },
                            "sound_name": query112[0].sound_name,
                            "description": query112[0].description,
                            "thum": config.apiUrl + config.apiUrl + query112[0].thum,
                            "section": query112[0].section,
                            "created": query112[0].created,

                        }
                    }





                    arr.push({
                        "id": row_posts[j]['id'],
                        "fb_id": row_posts[j]['fb_id'],
                        "user_info": [{
                            "first_name": query1[0].first_name,
                            "last_name": query1[0].last_name,
                            "profile_pic": query1[0].profile_pic,
                            "username": query1[0].username,
                            "verified": query1[0].verified,
                        }],
                        "count": {
                            "like_count": row_posts[j]['like'],
                            "video_comment_count": countcomment[0]['count']
                        },
                        "video": config.apiUrl + row_posts[j]['video'],
                        "thum": config.apiUrl + row_posts[j]['thum'],
                        "description": row_posts[j]['description'],
                        "sound": smap,
                        "created": row_posts[j]['created']
                    });



                }


            }







            return res.send({
                isError: false,
                msg: arr
            })

        } catch (e) {
            console.log(e)
            return res.send({
                isError: true,
                msg: "Server error"
            })
        }






















    })





};


async function showMyAllVideos(req, res) {




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




            let [query1, f] = await acon.execute("select * from users where fb_id=? ", [fb_id]);
            if (query1.length != 0) {

                let [query99, f1] = await acon.execute("select * from videos where fb_id= ? offset = 0 limit = 12 order by created DESC", [fb_id]);
                console.log(query1)
                array_out_video = []
                for (i in query99) {

                    let [countLikes, f2] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id=? ", [query99[i].id]);

                    let [query112, nk] = await acon.execute("select * from sound where id=?", [query99[i].id]);
                    let [countcomment, f3] = await acon.execute("SELECT count(*) as count from video_comment where video_id=? ", [query99[i].id]);

                    let [liked, f4] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id= ? and fb_id=? ", [query99[i].id, fb_id]);

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
                let [query123, k2] = await acon.execute("select * from videos where fb_id=? ", [fb_id]);

                let array_out_count_heart = 0;
                for (u in query123) {
                    array_out_count_heart += query123[u]['id'] + ',';
                }

                array_out_count_heart = array_out_count_heart + '0';

                let [hear_count, qq] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id IN( ? ) ", [array_out_count_heart]);

                //count total heart

                //count total_fans

                let [total_fans, qqj] = await acon.execute("SELECT count(*) as count from follow_users where followed_fb_id= ?", [fb_id]);

                //count total_fans

                //count total_following

                let [total_following, nnn] = await acon.execute("SELECT count(*) as count from follow_users where fb_id= ?", [fb_id]);

                //count total_following



                console.log(total_following[0]["count"], "total following bc")
                console.log(total_fans, "total fans bc")

                count_video_rows = array_out_video.length;
                if (count_video_rows == 0) {
                    //   array_out_video.push(0);
                }


                let [follow_count, l] = await acon.execute("SELECT count(*) as count from follow_users where fb_id= ? and followed_fb_id=?", [my_fb_id, fb_id]);


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

                array_out = {
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
                }




                return res.send({ isError: false, msg: array_out_video, userData = array_out })


            }




















        } catch (e) {
            console.log(e);

            return res.send({
                isError: true,
                msg: "Some error occured"
            })
        }


    } else {
        return res.send(

            {

                isError: true,

                msg: "Json Parem are missing"


            })
    }

}