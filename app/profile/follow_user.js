var path = require('path');
const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");

module.exports = function(app) {










    app.post('/follow-user', fx.isLoggedIn, async function(req, res) {


        fb_id = req.user.id;
        followed_fb_id = req.body.other_userid;
        status = req.body.status;

        if (followed_fb_id) {

            if (followed_fb_id.trim() == "") return;


            if (status == 0) {

                con.query("delete from follow_users where fb_id = ? and followed_fb_id = ?", [fb_id, followed_fb_id], function(e, r) {


                    if (e) console.log(e)
                    res.send({ isError: false, msg: "unfollow" })


                })
            } else if (status == 1) {


                con.query("select * from follow_users where fb_id = ? and followed_by_id  = ?", [], function(err, roww) {
                    if (err) console.log(err)

                    else if (roww.length == 0) {


                        con.query("insert into follow_users(fb_id,followed_fb_id)values(?,?)", [fb_id, followed_fb_id], function(e, r) {


                            if (e) console.log(e)

                            else {
                                res.send({ isError: false, msg: "follow successful" })


                                con.query("insert into notification(my_fb_id,effected_fb_id,type,value)values(?,?,?,?)", [fb_id, followed_fb_id, "following_you", ""], function(err, row) {



                                })


                            }


                        })

                    } else {
                        res.send({
                            isError: true,
                            msg: "You already follows the user "
                        })
                    }
                })




            }





        } else {
            res.send({ isError: true, msg: "Params not exist" })

        }






















    })















};