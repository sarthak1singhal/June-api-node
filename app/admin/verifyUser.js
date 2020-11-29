var path = require('path');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");
const uploadUrl = require("../functions/functions");
const Hashids = require('hashids/cjs')
const hashids = new Hashids()
const acon = require('../../initSql')

module.exports = async function(app) {


    app.post('/get-verifyrequests', fx.isLoggedIn, async function(req, res) {





        try {


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



    })




};