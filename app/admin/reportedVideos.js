var path = require('path');
const acon = require('../../initSql')
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");
const uploadUrl = require("../functions/functions");
const Hashids = require('hashids/cjs')
const hashids = new Hashids()
module.exports = function(app) {


    app.post('/get-reported-videos', fx.isLoggedIn, async function(req, res) {





        try {

            var [ins, fields] = await acon.query("select * from videos where report > 4 order by report desc", [req.body.priority, req.body.tag, ]);


            return res.send({
                isError: false,
                data: ins
            })

        } catch (e) {

            return res.send({
                isError: true

            })
        }



    })






};