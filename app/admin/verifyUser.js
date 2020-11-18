var path = require('path');
const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");
const uploadUrl = require("../functions/functions");
const Hashids = require('hashids/cjs')
const hashids = new Hashids()
module.exports = function(app) {


    app.post('/get-verifyrequests', fx.isLoggedIn, async function(req, res) {





        try {

            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });
            var [ins, fields] = await acon.execute("select * from verification_request where status = ?", ["Pending"]);

            return res.send({
                isError: false,
                msg: ins
            })

        } catch (e) {

            return res.send({
                isError: true

            })
        }



    })

    app.post('/approve-verification', fx.isLoggedIn, async function(req, res) {





        try {

            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });
            var [ins, fields] = await acon.execute("update users set verified = ? where fb_id = ?", [1, req.body.fb_id]);
            var [i, s] = await acon.execute("update verification_request set status = ? where fb_id = ?", ["Approved", req.body.fb_id]);

            return res.send({
                isError: false
            })

        } catch (e) {

            return res.send({
                isError: true
            })
        }

        return res.send({
            isError: true
        })


    })




};