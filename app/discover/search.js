 var path = require('path');
 const acon = require('../../async_sql.js');
 readJson = require("r-json");
 const config = readJson(`config.json`);
 const fx = require('../functions/functions')

 module.exports = function(app) {





     app.post('/search', async function(req, res) {



         _type = req.body.type;
         keyword = req.body.keyword;




         if (_type && keyword) {
             try {

                 if (_type == "video") {
                     [row, f] = await acon.execute("select * from videos where description like '%" + keyword + "%' order by rand() limit 15");
                     array_out = [];
                     for (i in row) {

                         [rd, f] = await acon.execute("select * from users where fb_id=? ", [row[i].fb_id]);

                         [rd12, f] = await acon.execute("select * from sound where id= ?", [row[i].sound_id]);

                         countLikes_count = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id= ? ", [row[i].id]);

                         countcomment_count = await acon.execute("SELECT count(*) as count from video_comment where video_id= ?", [row[i].id]);

                         liked_count = "0"
                         fb_id = req.query.fb_id
                         if (fb_id)
                             liked_count = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id=? and fb_id= ? ", [row[i].id, fb_id]);


                         s = {};
                         if (rd12.length == 0) {
                             s = {
                                 "id": "",
                                 "audio_path": {
                                     "mp3": "", //complete sound path here
                                     "acc": ""
                                 },
                                 "sound_name": "",
                                 "description": "",
                                 "thum": "",
                                 "section": "",
                                 "created": "",

                             }
                         } else {
                             s = {
                                 "id": rd12[0].id,
                                 "audio_path": {

                                     "mp3": config.apiUrl + rd12[0].videoPath + ".mp3",
                                     "acc": config.apiUrl + rd12[0].videoPath + ".aac"
                                 },
                                 "sound_name": rd12[0].sound_name,
                                 "description": rd12[0].description,
                                 "thum": config.apiUrl + rd12[0].thum,
                                 "section": rd12[0].section,
                                 "created": rd12[0].created,
                             }
                         }


                         array_out.push({
                             "id": row[i]['id'],
                             "fb_id": row[i]['fb_id'],
                             "user_info": {
                                 "first_name": rd[0].first_name,
                                 "last_name": rd[0].last_name,
                                 "profile_pic": fx.getImageUrl(rd[0].profile_pic),
                                 "username": rd[0].username,
                                 "verified": rd[0].verified,
                             },
                             "count": {
                                 "like_count": countLikes_count[0]['count'],
                                 "video_comment_count": countcomment_count[0]['count'],
                                 "view": row[i]['view'],
                             },
                             "liked": liked_count[0]['count'],
                             "video": config.apiUrl + row[i]['video'],
                             "thum": config.apiUrl + row[i]['thum'],
                             "description": row[i]['description'],
                             "sound": s,
                             "created": row[i]['created'],
                         });

                     }

                     return res.send({
                         code: "200",
                         msg: array_out,
                         "type": _type
                     })
                 } else if (_type == "users") {
                     [row, f] = await acon.execute("select * from users where first_name like '%" + keyword + "%' or last_name like '%" + keyword + "%' or username like '%" + keyword + "%'  limit 15 ");
                     array_out = [];
                     for (i in row) {
                         [query1, f] = await acon.execute("select * from videos where fb_id= ?", [row[i].fb_id]);
                         videoCount = query1.length;

                         array_out.push({
                             "fb_id": row[i]['fb_id'],
                             "username": row[i]['username'],
                             "verified": row[i]['verified'],
                             "first_name": row[i]['first_name'],
                             "last_name": row[i]['last_name'],
                             "gender": row[i]['gender'],
                             "profile_pic": fx.getImageUrl(row[i]['profile_pic']),
                             "block": row[i]['block'],
                             "version": row[i]['version'],
                             "device": row[i]['device'],
                             "signup_type": row[i]['signup_type'],
                             "created": row[i]['created'],
                             "videos": videoCount,
                         });

                     }

                     return res.send({ code: 200, msg: array_out, "type": _type })
                 } else if (_type == "sound") {
                     [row1, f] = await acon.execute("select * from sound where sound_name like '%" + keyword + "%' or description like '%" + keyword + "%'  limit 15");
                     array_out1 = []
                     for (i in row1) {
                         [qrry, f] = await acon.execute("select * from fav_sound WHERE fb_id=? and sound_id =?", [fb_id, row1[i].id]);

                         CountFav = qrry.length;
                         if (CountFav == "") {
                             CountFav = "0";
                         }

                         array_out1.push({
                             "id": row1[i]['id'],

                             "audio_path": {
                                 "mp3": row1[i]['videoPath'] + ".mp3",
                                 "acc": row1[i]['videoPath'] + ".aac"
                             },
                             "sound_name": row1[i]['sound_name'],
                             "description": row1[i]['description'],
                             "section": row1[i]['section'],
                             "thum": config.apiUrl + row1[i]['thum'],
                             "created": row1[i]['created'],
                             "fav": CountFav

                         });
                     }

                     return res.send({ code: "200", msg: array_out1, "type": _type })
                 }



                 return res.send({
                     isError: true,
                     message: "Some Error"
                 })
















             } catch (e) {
                 console.log(e)
                 return res.send({

                     isError: true,
                     message: "Invalid Params"
                 });
             }

         } else {
             return res.send({

                 isError: true,
                 message: "Invalid Params"
             });
         }

     })

 };