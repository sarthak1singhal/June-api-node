// app/routes.js

var con = require('../../params.js')
const jwt = require('jsonwebtoken');
const readJson = require("r-json")
const config = readJson(`config.json`);
var bcrypt = require('bcrypt-nodejs');


var fx = require("../functions/functions")

module.exports = function(app, passport) {





    app.post('/change-password', fx.isLoggedIn, function(req, res, next) {



        console.log(req.body, "BODY")




        if (!(req.body.password && req.body.confirm_password && req.body.new_password)) {
            return res.send({
                isError: true,
                msg: "Some  error occured "
            })
        }

        if (!req.body.password.trim()) {
            return res.send({
                isError: true,
                msg: "Some error occured "
            })
        }


        if (!req.body.new_password.trim()) {
            return res.send({
                isError: true,
                msg: "Some error occured "
            })
        }





        if (!req.body.confirm_password.trim()) {
            return res.send({
                isError: true,
                msg: "Some error occured "
            })
        }

        if (req.body.new_password.includes(" ")) {
            return res.send({
                isError: true,
                msg: "Password should not contains spaces"
            })
        }

        if (req.body.new_password.trim().length < 8) {
            return res.send({
                isError: true,
                msg: "Password length too short. Use minimum 8 characters"
            })
        }



        if (req.body.confirm_password.trim() != req.body.new_password.trim()) {
            return res.send({
                isError: true,
                msg: "Passwords do not match"
            })
        }



        con.query("SELECT * FROM users WHERE fb_id = ?", [req.user.id], function(err, rows) {
            if (err) {

                console.log(err)
                return done(err);
            }
            if (rows.length == 0) {
                return res.send({
                    isError: true,
                    msg: "Some error occoured"
                });
            }

            if (!bcrypt.compareSync(req.body.password.trim(), rows[0].password)) {

                return res.send({
                    isError: true,
                    msg: "Oops! Cannot change your password"
                });
            }


            password = bcrypt.hashSync(req.body.new_password, null, null) // use the generateHash function in our user model



            con.query("update users set password = ? where fb_id = ?", [password, req.user.id], function(e, r) {

                if (e) console.log(e)

                else {
                    res.send({
                        isError: false,
                        msg: "Password updated successfully"
                    })


                    fx.logOutFromAllDevices(req.user.id)




                }


            })



        });









    });


























};