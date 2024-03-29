var path = require('path');
const acon = require('../../initSql')
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require(`../functions/functions.js`);

module.exports = function(app) {




    app.post('/showAllVideosUnsigned', async function(req, res) {


        //v = ["hindi", "enlish", language]



        try {


            hmap = {};
            arr = [];





            row_posts = [];
            if (req.body.haveIds == null) req.body.haveIds = "";

            if (req.body.haveIds.trim()) {
                [row_posts, fields] = await acon.query("Select * from videos where id not in ( " + req.body.haveIds + ") and isAvailable = 1 order by rand() limit 20");

            } else {
                [row_posts, fields] = await acon.query("Select * from videos where isAvailable = 1 order by rand() limit 20");

            }

            for (j in row_posts) {
                let [query1, f] = await acon.query("select * from users where fb_id=? ", [row_posts[j].fb_id]);

                let [query112, f1] = await acon.query("select * from sound where id= ?", [row_posts[j].sound_id]);


                let [countcomment, y] = await acon.query("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);



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
                            "id": row_posts[j].sound_id,
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
                                "mp3": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                                "acc": config.cdnUrl + query112[0].audioPath + ".acc"
                            },
                            "sound_name": query112[0].sound_name,
                            "description": query112[0].description,
                            "thum": config.cdnUrl + query112[0].thum,
                            "section": query112[0].section,
                            "created": query112[0].created,

                        }
                    }





                    arr.push({
                        "id": row_posts[j]['id'],
                        "fb_id": row_posts[j]['fb_id'],
                        "liked": 0,
                        "user_info": {
                            "first_name": query1[0].first_name,
                            "last_name": query1[0].last_name,
                            "profile_pic": fx.getImageUrl(query1[0].profile_pic),
                            "username": query1[0].username,
                            "verified": query1[0].verified,
                        },
                        "count": {
                            "view": row_posts[j]['view'],

                            "like_count": row_posts[j]['like'],
                            "video_comment_count": countcomment[0]['count']
                        },
                        "video": config.cdnUrl + row_posts[j]['video'],
                        "thum": config.cdnUrl + row_posts[j]['thum'],
                        "description": row_posts[j]['description'],
                        "sound": smap,

                        "filter": row_posts[j].filter,
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

    app.post('/showAllVideos', fx.isLoggedIn, async function(req, res) {


        //v = ["hindi", "enlish", language]


        var fb_id = req.user.id;

        try {

            hmap = {};
            arr = [];





            row_posts = [];

            if (req.body.haveIds == null) req.body.haveIds = "";
            if (req.body.haveIds.trim()) {
                [row_posts, fields] = await acon.query("Select * from videos where id not in ( " + req.body.haveIds + ") and isAvailable = 1 order by rand() limit 20");

            } else {
                [row_posts, fields] = await acon.query("Select * from videos where isAvailable = 1 order by rand() limit 20");

            }

            for (j in row_posts) {
                let [query1, f] = await acon.query("select * from users where fb_id=? ", [row_posts[j].fb_id]);

                let [query112, f1] = await acon.query("select * from sound where id= ?", [row_posts[j].sound_id]);


                let [countcomment, y] = await acon.query("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);


                let [liked, fk] = await acon.query("SELECT count(*) as count from video_like_dislike where video_id=? and fb_id= ?", [row_posts[j].id, fb_id]);


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
                            "id": row_posts[j].sound_id,
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
                                "mp3": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                                "acc": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                            },
                            "sound_name": query112[0].sound_name,
                            "description": query112[0].description,
                            "thum": config.cdnUrl + query112[0].thum,
                            "section": query112[0].section,
                            "created": query112[0].created,

                        }
                    }





                    arr.push({
                        "id": row_posts[j]['id'],
                        "fb_id": row_posts[j]['fb_id'],
                        "liked": liked[0]['count'],
                        "user_info": {
                            "first_name": query1[0].first_name,
                            "last_name": query1[0].last_name,
                            "profile_pic": fx.getImageUrl(query1[0].profile_pic),
                            "username": query1[0].username,
                            "verified": query1[0].verified,
                        },
                        "count": {
                            "view": row_posts[j]['view'],

                            "like_count": row_posts[j]['like'],
                            "video_comment_count": countcomment[0]['count']
                        },
                        "video": config.cdnUrl + row_posts[j]['video'],
                        "thum": config.cdnUrl + row_posts[j]['thum'],
                        "description": row_posts[j]['description'],
                        "sound": smap,
                        "filter": row_posts[j].filter,

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






    app.post('/show-videos-following', fx.isLoggedIn, async function(req, res) {


        if (req.body.offset == null) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters"
            })

        }


        if (req.body.offset2 == null) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters"
            })

        }

        offset2 = req.body.offset2
        offset = req.body.offset


        fb_id = req.user.id

        try {


            hmap = {};
            arr = [];



            let [users, fields] = await acon.query("Select * from follow_users where fb_id = ? limit ?,50", [fb_id, offset2]);

            console.log(users);

            var str_id = '';

            for (let i = 0; i < users.length; i++) {
                str_id += "'" + users[i].followed_fb_id + "',";

            }

            if (str_id.trim())
                str_id = str_id.substring(0, str_id.length - 1);;





            console.log(str_id)

            row_posts = [];
            if (str_id.trim())
                [row_posts, ffff] = await acon.query("Select * from `videos` where `fb_id` IN (" + str_id + ") and isAvailable = 1 order by created desc limit " + offset + " , 20 ", []);



            for (j in row_posts) {
                let [query1, f] = await acon.query("select * from users where fb_id=? ", [row_posts[j].fb_id]);

                let [query112, f1] = await acon.query("select * from sound where id= ?", [row_posts[j].sound_id]);


                let [countcomment, y] = await acon.query("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);


                let [liked, fk] = await acon.query("SELECT count(*) as count from video_like_dislike where video_id=? and fb_id= ?", [row_posts[j].id, fb_id]);

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
                            "id": row_posts[j].sound_id,
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
                                "mp3": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                                "acc": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                            },
                            "sound_name": query112[0].sound_name,
                            "description": query112[0].description,
                            "thum": config.cdnUrl + query112[0].thum,
                            "section": query112[0].section,
                            "created": query112[0].created,

                        }
                    }





                    arr.push({
                        "id": row_posts[j]['id'],
                        "fb_id": row_posts[j]['fb_id'],
                        "liked": liked[0]['count'],
                        "user_info": {
                            "first_name": query1[0].first_name,
                            "last_name": query1[0].last_name,
                            "profile_pic": fx.getImageUrl(query1[0].profile_pic),
                            "username": query1[0].username,
                            "verified": query1[0].verified,
                        },
                        "count": {
                            "view": row_posts[j]['view'],

                            "like_count": row_posts[j]['like'],
                            "video_comment_count": countcomment[0]['count']
                        },
                        "video": config.cdnUrl + row_posts[j]['video'],
                        "thum": config.cdnUrl + row_posts[j]['thum'],
                        "description": row_posts[j]['description'],
                        "sound": smap,
                        "filter": row_posts[j].filter,

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
        fb_id = req.body.fb_id


        try {


            hmap = {};
            arr = [];



            if (!req.body.sound_id) {
                return res.send({
                    isError: true,
                    msg: "Invalid Parameters"
                })

            }


            console.log(req.body);
            let [row_posts, fields] = await acon.query("Select * from videos where sound_id = ? and isAvailable = 1 limit  ?,21", [req.body.sound_id, req.body.offset]);

            console.log(row_posts);
            for (j in row_posts) {
                let [query1, f] = await acon.query("select * from users where fb_id=? ", [row_posts[j].fb_id]);

                let [query112, f1] = await acon.query("select * from sound where id= ?", [row_posts[j].sound_id]);


                let [countcomment, fn] = await acon.query("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);

                liked_count = [{
                    count: 0
                }]
                if (fb_id)
                    [liked_count, qq] = await acon.query("SELECT count(*) as count from video_like_dislike where video_id= ? and fb_id= ?", [row_posts[j].id, fb_id]);




                if (row_posts[j]['report'] < 30) {
                    smap = {};
                    if (query112.length == 0) {

                        smap = {
                            "id": row_posts[j].sound_id,
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
                                "mp3": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                                "acc": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                            },
                            "sound_name": query112[0].sound_name,
                            "description": query112[0].description,
                            "thum": config.cdnUrl + query112[0].thum,
                            "section": query112[0].section,
                            "created": query112[0].created,

                        }
                    }





                    arr.push({
                        "id": row_posts[j]['id'],
                        "fb_id": row_posts[j]['fb_id'],
                        "liked": liked_count[0]['count'],

                        "user_info": {
                            "first_name": query1[0].first_name,
                            "last_name": query1[0].last_name,
                            "profile_pic": fx.getImageUrl(query1[0].profile_pic),
                            "username": query1[0].username,
                            "verified": query1[0].verified,
                        },
                        "count": {
                            "view": row_posts[j]["view"],
                            "like_count": row_posts[j]['like'],
                            "video_comment_count": countcomment[0]['count']
                        },
                        "video": config.cdnUrl + row_posts[j]['video'],
                        "thum": config.cdnUrl + row_posts[j]['thum'],
                        "filter": row_posts[j].filter,

                        "description": row_posts[j]['description'],
                        "sound": smap,
                        "created": row_posts[j]['created']
                    });



                }


            }



            let [videoCount, fields66] = await acon.query("SELECT count(*) as count from videos where sound_id = ? and isAvailable = 1", [req.body.sound_id]);




            return res.send({ isError: false, msg: arr, count: videoCount[0]["count"] })

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


        fb_id = req.body.fb_id

        if (!req.body.hashtag) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters"
            })

        }
        if (req.body.offset == null) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters"
            })

        }
        if (!req.body.limit) {
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


            hmap = {};
            arr = [];





            let [row_posts, fields] = await acon.query("Select * from videos where description like '%" + keyword + "%' and isAvailable = 1 limit " + req.body.offset + ", 21 ");

            for (j in row_posts) {
                let [query1, f] = await acon.query("select * from users where fb_id=? ", [row_posts[j].fb_id]);

                let [query112, f1] = await acon.query("select * from sound where id= ?", [row_posts[j].sound_id]);


                let [countcomment, m] = await acon.query("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);


                liked = [{
                    "count": 0
                }];
                if (fb_id)
                    [liked, nm] = await acon.query("SELECT count(*) as count from video_like_dislike where video_id=? and fb_id= ?", [row_posts[j].id, fb_id]);

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
                            "id": row_posts[j].sound_id,
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
                                "mp3": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                                "acc": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                            },
                            "sound_name": query112[0].sound_name,
                            "description": query112[0].description,
                            "thum": config.cdnUrl + query112[0].thum,
                            "section": query112[0].section,
                            "created": query112[0].created,

                        }
                    }





                    arr.push({
                        "id": row_posts[j]['id'],
                        "fb_id": row_posts[j]['fb_id'],
                        "liked": liked[0]['count'],
                        "user_info": {
                            "first_name": query1[0].first_name,
                            "last_name": query1[0].last_name,
                            "profile_pic": fx.getImageUrl(query1[0].profile_pic),
                            "username": query1[0].username,
                            "verified": query1[0].verified,
                        },
                        "count": {
                            "views": row_posts[j]['view'],
                            "like_count": row_posts[j]['like'],
                            "video_comment_count": countcomment[0]['count']
                        },
                        "video": config.cdnUrl + row_posts[j]['video'],
                        "thum": config.cdnUrl + row_posts[j]['thum'],
                        "description": row_posts[j]['description'],
                        "sound": smap,
                        "filter": row_posts[j].filter,

                        "created": row_posts[j]['created']
                    });



                }


            }




            let [hashtagDetails, fields66] = await acon.query("select * from discover_section where section_name = ?", [req.body.hashtag]);
            let [videoCount, cda] = await acon.query("SELECT count(*) as count from videos where description like '%" + keyword + "%' and isAvailable = 1 ");



            return res.send({ isError: false, msg: arr, hashtagDetails: hashtagDetails[0], videoCount: videoCount[0]["count"] })

        } catch (e) {

            console.log(e)

            return res.send({
                isError: true,
                msg: "Some error"
            })
        }






















    })










    app.post('/videos-by-user', fx.isLoggedIn, async function(req, res) {


        my_fb_id = req.user.id

        //v = ["hindi", "enlish", language]

        console.log(req.user);


        if (!req.body.fb_id) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters fb_id"
            })

        }
        if (req.body.offset == null) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters offset"
            })

        }
        if (req.body.limit == null) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters limit"
            })

        }

        offset = req.body.offset
        limit = req.body.limit

        if (offset == 0) {


            console.log("LINE 920");
            showMyAllVideos(req, res, limit);


            return;
        }



        try {

            arr = [];





            let [row_posts, fields] = await acon.query("Select * from videos where fb_id = ? and isAvailable = 1 order by created desc limit ?, ? ", [req.body.fb_id, offset, limit]);

            for (j in row_posts) {
                let [query1, f] = await acon.query("select * from users where fb_id=? ", [row_posts[j].fb_id]);

                let [query112, f1] = await acon.query("select * from sound where id= ?", [row_posts[j].sound_id]);


                let [countcomment, f3] = await acon.query("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);


                let [liked, nm] = await acon.query("SELECT count(*) as count from video_like_dislike where video_id=? and fb_id= ?", [row_posts[j].id, my_fb_id]);

                console.log(liked, "LIKEDDD")
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
                            "id": row_posts[j].sound_id,
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
                                "mp3": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                                "acc": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                            },
                            "sound_name": query112[0].sound_name,
                            "description": query112[0].description,
                            "thum": config.cdnUrl + query112[0].thum,
                            "section": query112[0].section,
                            "created": query112[0].created,

                        }
                    }





                    arr.push({
                        "id": row_posts[j]['id'],
                        "liked": liked[0]['count'],

                        "fb_id": row_posts[j]['fb_id'],
                        "user_info": {
                            "first_name": query1[0].first_name,
                            "last_name": query1[0].last_name,
                            "profile_pic": fx.getImageUrl(query1[0].profile_pic),
                            "username": query1[0].username,
                            "verified": query1[0].verified,
                        },
                        "count": {
                            "like_count": row_posts[j]['like'],
                            "video_comment_count": countcomment[0]['count'],
                            "view": row_posts[j]['view']
                        },
                        "video": config.cdnUrl + row_posts[j]['video'],
                        "thum": config.cdnUrl + row_posts[j]['thum'],
                        "description": row_posts[j]['description'],
                        "filter": row_posts[j].filter,

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





    app.get('/', async function(req, res) {


        username = "theshrutimalhotra";
        let [query11, f] = await acon.query("select * from users where username = ?", [username]);
        my_fb_id = ""

        if (query11.length == 0) {

            return res.send({
                isError: true,
                code: 0,
                msg: "No user exist"
            })
        }

        if (query11[0].isPrivate == 1) {

            //check if user is logged in

            var isLoggedIn = fx.getTokenData(req);

            if (isLoggedIn) {

                my_fb_id = req.body.id;
            } else {
                return res.send({
                    isError: true,
                    code: 1,
                    msg: "Login"
                })
            }

        }


        req.body.fb_id = query11[0].fb_id;



        if (req.body.offset == null) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters offset",

                uw: req,
            })

        }
        if (req.body.limit == null) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters limit"
            })

        }

        offset = req.body.offset
        limit = req.body.limit

        if (offset == 0) {
            console.log("LINE 920");
            showMyAllVideos(req, res, limit);
            return;
        }

        try {

            arr = [];





            let [row_posts, fields] = await acon.query("Select * from videos where fb_id = ? and isAvailable = 1 order by created desc limit ?, ? ", [req.body.fb_id, offset, limit]);

            for (j in row_posts) {
                let [query1, f] = await acon.query("select * from users where fb_id=? ", [row_posts[j].fb_id]);

                let [query112, f1] = await acon.query("select * from sound where id= ?", [row_posts[j].sound_id]);


                let [countcomment, f3] = await acon.query("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);
                liked = [{
                    "count": 0
                }];
                if (my_fb_id)
                    [liked, nm] = await acon.query("SELECT count(*) as count from video_like_dislike where video_id=? and fb_id= ?", [row_posts[j].id, my_fb_id]);


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
                            "id": row_posts[j].sound_id,
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
                                "mp3": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                                "acc": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                            },
                            "sound_name": query112[0].sound_name,
                            "description": query112[0].description,
                            "thum": config.cdnUrl + query112[0].thum,
                            "section": query112[0].section,
                            "created": query112[0].created,

                        }
                    }





                    arr.push({
                        "id": row_posts[j]['id'],
                        "liked": liked[0]['count'],

                        "fb_id": row_posts[j]['fb_id'],
                        "user_info": {
                            "first_name": query1[0].first_name,
                            "last_name": query1[0].last_name,
                            "profile_pic": fx.getImageUrl(query1[0].profile_pic),
                            "username": query1[0].username,
                            "verified": query1[0].verified,
                        },
                        "count": {
                            "like_count": row_posts[j]['like'],
                            "video_comment_count": countcomment[0]['count'],
                            "view": row_posts[j]['view']
                        },
                        "video": config.cdnUrl + row_posts[j]['video'],
                        "thum": config.cdnUrl + row_posts[j]['thum'],
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


async function showMyAllVideos(req, res, limit) {




    fb_id = req.body.fb_id;
    my_fb_id = req.user.id;

    console.log("LINE 1094");
    console.log(req.user);
    console.log(fb_id)
    if (fb_id) {


        try {


            let [query1, f] = await acon.query("select * from users where fb_id=? ", [fb_id]);
            if (query1.length != 0) {
                console.log("LINE 1115");

                let [query99, f1] = await acon.query("select * from videos where fb_id= ? and isAvailable = 1 order by created DESC limit 0, ?", [fb_id, limit]);
                array_out_video = []
                for (i in query99) {

                    //                    let [countLikes, f2] = await acon.query("SELECT count(*) as count from video_like_dislike where video_id=? ", [query99[i].id]);

                    let [query112, nk] = await acon.query("select * from sound where id=?", [query99[i].sound_id]);
                    let [countcomment, f3] = await acon.query("SELECT count(*) as count from video_comment where video_id=? ", [query99[i].id]);
                    liked = [{
                        "count": 0
                    }];

                    if (my_fb_id)
                        [liked, f4] = await acon.query("SELECT count(*) as count from video_like_dislike where video_id= ? and fb_id=? ", [query99[i].id, my_fb_id]);

                    s = {};
                    if (query112.length == 0) {
                        s = {
                            "id": query99[i].sound_id,
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

                                "mp3": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                                "acc": config.cdnUrl + query112[0].audioPath + ".mp3", //complete sound path here
                            },
                            "sound_name": query112[0].sound_name,
                            "description": query112[0].description,
                            "thum": config.cdnUrl + query112[0].thum,
                            "section": query112[0].section,
                            "created": query112[0].created,
                        }
                    }

                    array_out_video.push({
                        "fb_id": fb_id,

                        "id": query99[i]['id'],
                        "video": config.cdnUrl + query99[i]['video'],
                        "thum": config.cdnUrl + query99[i]['thum'],
                        "description": query99[i]['description'],
                        "liked": liked[0]['count'],
                        "count": {
                            "like_count": query99[i]['like'],
                            "video_comment_count": countcomment[0]['count'],
                            "view": query99[i]['view'],
                        },
                        "user_info": {

                            "first_name": query1[0].first_name,
                            "last_name": query1[0].last_name,
                            "profile_pic": fx.getImageUrl(query1[0].profile_pic),

                            "username": query1[0].username,
                            "verified": query1[0].verified,
                        },
                        "sound": s,
                        "created": query99[i]['created'],
                        "filter": query99[i].filter,

                    });

                }


                //count total heart
                console.log(fb_id)

                let [query123, k2] = await acon.query("select * from videos where fb_id = ? and isAvailable = ?", [fb_id, 1]);

                let array_out_count_heart = '';
                for (u in query123) {
                    array_out_count_heart += query123[u]['id'] + ',';
                }

                console.log(array_out_count_heart)

                if (array_out_count_heart.trim())
                    array_out_count_heart = array_out_count_heart.substring(0, array_out_count_heart.length - 1);;


                hear_count = [{ "count": 0 }];
                if (array_out_count_heart.trim()) {
                    [hear_count, qq] = await acon.query("SELECT sum(`like`) as count from videos where fb_id = ? and isAvailable = ?", [fb_id, 1]);

                    hear_count = [{
                        "count": parseInt(hear_count[0]['count'])
                    }]
                }


                // [hear_count, qq] = await acon.query("SELECT count(*) as count from video_like_dislike where video_id IN (" + array_out_count_heart + ")", []);

                //count total heart

                //count total_fans

                let [total_fans, qqj] = await acon.query("SELECT count(*) as count from follow_users where followed_fb_id= ?", [fb_id]);

                //count total_fans

                //count total_following

                let [total_following, nnn] = await acon.query("SELECT count(*) as count from follow_users where fb_id= ?", [fb_id]);

                //count total_following



                count_video_rows = array_out_video.length;
                if (count_video_rows == 0) {
                    //   array_out_video.push(0);
                }


                follow = "3"
                follow_button_status = "Login";


                if (my_fb_id) {
                    [follow_count, l] = await acon.query("SELECT count(*) as count from follow_users where fb_id= ? and followed_fb_id=?", [my_fb_id, fb_id]);


                    if (follow_count[0]['count'] == 0) {
                        follow = "0";
                        follow_button_status = "Follow";
                    } else if (follow_count[0]['count'] != 0) {
                        follow = "1";
                        follow_button_status = "Unfollow";
                    }

                }
                array_out = {
                    "fb_id": fb_id,
                    "user_info": {

                        "fb_id": query1[0].fb_id,
                        "first_name": query1[0].first_name,
                        "last_name": query1[0].last_name,
                        "profile_pic": fx.getImageUrl(query1[0].profile_pic),
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
                    "isPrivate": query1[0].isPrivate

                }

                myInfo = {};

                if (fb_id == my_fb_id) {

                    myInfo = {
                        "dob": query1[0].dob,
                        "phoneNumber": query1[0].dob,
                        "isPhoneVerified": query1[0].doisPhoneVerifiedb,
                        "email": query1[0].email,
                        "signup_type": query1[0].signup_type,

                    }


                    array_out.personal = myInfo;
                }




                return res.send({ isError: false, msg: array_out_video, userData: array_out })


            } else {
                return res.send({
                    isError: true,
                    msg: "No user found"
                })
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