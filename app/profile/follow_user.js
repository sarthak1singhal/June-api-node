var path = require('path');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");
const con = require('../../params.js')

module.exports = function(app) {










    app.post('/follow-private-user', fx.isLoggedIn, async function(req, res) {


        fb_id = req.user.id;
        followed_fb_id = req.body.other_userid;
        status = req.body.status;

        console.log(fb_id);
        console.log(req.body)

        if (followed_fb_id) {

            if (followed_fb_id == fb_d)
                return res.send({
                    isError: true,
                    msg: "e"
                })

            console.log(req.body);


            if (status == 0) {

                con.query("delete from follow_users where fb_id = ? and followed_fb_id = ?", [fb_id, followed_fb_id], function(e, r) {

                    console.log("DELETED");

                    if (e) console.log(e)
                    res.send({ isError: false, msg: "unfollow" })


                })
            } else if (status == 1) {


                con.query("select * from follow_users where fb_id = ? and followed_fb_id  = ?", [fb_id, followed_fb_id], function(err, roww) {

                    console.log(roww)
                    if (err) console.log(err)

                    else if (roww.length == 0) {

                        console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")


                        con.query('select * from users where fb_id = ?', [followed_fb_id], function(errr, rrr) {
                            if (rrr[0].isPrivate == 0) {


                                con.query("insert into follow_users (fb_id, followed_fb_id) values (?,?)", [fb_id, followed_fb_id], function(e, r) {


                                    if (e) console.log(e)

                                    else {
                                        res.send({ isError: false, msg: "follow successful" })
                                        console.log("ssssssssssssssssss")


                                        con.query("insert into notification(my_fb_id,effected_fb_id,type,value)values(?,?,?,?)", [fb_id, followed_fb_id, "following_you", ""], function(err, row) {


                                            con.query("select * from follow_users", [], function(err, roo) {
                                                console.log(roo)


                                            })



                                        })


                                    }


                                })



                            } else {



                                con.query("insert into notification(my_fb_id,effected_fb_id,type,value)values(?,?,?,?)", [fb_id, followed_fb_id, "req", ""], function(err, row) {


                                    con.query("select * from follow_users", [], function(err, roo) {
                                        console.log(roo)


                                    })



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




    app.post('/accept-req', fx.isLoggedIn, async function(req, res) {

        fb_id = req.user.id;



        con.query("select * from notification where my_fb_id = ? and effected_fb_id = ? and type = ?", [fb_id, followed_fb_id, "req"], function(ee, rr) {
            if (rr.length == 0) {


                return res.send({
                    isError: false,
                    msg: "no notification"
                })



            } else {
                con.query("delete from notification where my_fb_id = ? and effected_fb_id = ? and type = ?", [fb_id, followed_fb_id, "req"], function(e, r) {

                    console.log("DELETED");

                    if (e) console.log(e)


                    con.query("select * from follow_users where fb_id = ? and followed_fb_id = ?", [fb_d, followed_fb_id], function(err, rrr) {


                        if (rrr.length != 0) {
                            con.query("insert into follow_users (fb_id, followed_fb_id) values (?,?)", [fb_id, followed_fb_id], function(e, r) {

                                return res.send({
                                    isError: false,
                                    msg: "followed"
                                })

                            })

                        }

                    })


                })
            }
        })





    })

    app.post('/follow-user', fx.isLoggedIn, async function(req, res) {


        fb_id = req.user.id;
        followed_fb_id = req.body.other_userid;
        status = req.body.status;

        console.log(fb_id);
        console.log(req.body)

        if (followed_fb_id) {

            if (followed_fb_id == fb_id)
                return res.send({
                    isError: true,
                    msg: "e"
                })
            console.log(req.body);


            if (status == 0) {

                con.query("delete from follow_users where fb_id = ? and followed_fb_id = ?", [fb_id, followed_fb_id], function(e, r) {

                    console.log("DELETED");

                    if (e) console.log(e)
                    res.send({ isError: false, msg: "unfollow" })


                })
            } else if (status == 1) {


                con.query("select * from follow_users where fb_id = ? and followed_fb_id  = ?", [fb_id, followed_fb_id], function(err, roww) {

                    console.log(roww)
                    if (err) console.log(err)

                    else if (roww.length == 0) {

                        console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")

                        con.query("insert into follow_users (fb_id, followed_fb_id) values (?,?)", [fb_id, followed_fb_id], function(e, r) {


                            if (e) console.log(e)

                            else {
                                res.send({ isError: false, msg: "follow successful" })
                                console.log("ssssssssssssssssss")


                                con.query("insert into notification(my_fb_id,effected_fb_id,type,value)values(?,?,?,?)", [fb_id, followed_fb_id, "following_you", ""], function(err, row) {


                                    con.query("select * from follow_users", [], function(err, roo) {
                                        console.log(roo)


                                    })



                                })


                            }


                        })

                    } else {
                        con.query("select * from follow_users", [], function(err, roo) {
                            console.log(roo)


                        })
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