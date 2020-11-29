// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
const { query } = require('../../params');
readJson = require("r-json");
const config = readJson(`config.json`);
const acon = require('../../initSql')

module.exports = {






    get_user_data: async function(req, res) {


        fb_id = req.query.fb_id

        if (fb_id) {
            try {


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
                    isError: true,
                    msg: "Json Parem are missing"
                })

                return
            }




            try {


                console.log(fb_id, "this is fbdi")
                let [row, f] = await acon.execute("select * from `follow_users` where `followed_fb_id` = ? order by id DESC", [fb_id])

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

















        } else {
            res.send(

                {

                    isError: true,

                    msg: "Json Parem are missing"

                })
        }

    },







    get_followings: async function(req, res) {
        fb_id = req.query.fb_id;

        if (fb_id) {

            if (fb_id.trim() == "") return



            try {



                console.log("kmjhgtfrdesdfcgbhjnjm,")



                [query1, f] = await acon.execute("select * from follow_users where fb_id=? order by id DESC", [fb_id]);

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


        } else {
            res.send(

                {

                    code: 201,

                    msg: { response: "Json Parem are missing" }

                })
        }

    },




};