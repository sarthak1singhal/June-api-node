const https = require('request')

acon = require('../../initSql')
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require('../functions/functions');
module.exports = function(app) {



    app.post("/get-notification", fx.isLoggedIn, async function(req, res) {
        var fb_id = req.user.id;


        if (req.body.offset == null) {
            return res.send({
                isError: true,
                msg: "Invalid Parameters "
            })
        }

        offset = req.body.offset
        try {




            array_out = [];

            [_query, f] = await acon.query("select * from notification where effected_fb_id=? order by id desc limit ?, 30", [fb_id, offset])

            for (i in _query) {
                [rd, f1] = await acon.query("select * from users where fb_id= ?", [_query[i].my_fb_id]);
                [rd1, f1] = await acon.query("select * from videos where id=? ", [_query[i].value]);

                var valueData = {

                };

                if (rd1.length != 0) {

                    valueData = {
                        "id": rd1[0].id,
                        "video": config.cdnUrl + rd1[0].video,
                        "thum": config.cdnUrl + rd1[0].thum,
                    };
                }


                array_out.push({
                    "fb_id": _query[i]['my_fb_id'],
                    "fb_id_details": {
                        "first_name": rd[0].first_name,
                        "last_name": rd[0].last_name,
                        "profile_pic": fx.getImageUrl(rd[0].profile_pic),
                        "username": rd[0].username,
                        "verified": rd[0].verified,
                    },

                    "effected_fb_id": _query[i]['effected_fb_id'],
                    "type": _query[i]['type'],
                    "value": _query[i]['value'],
                    "value_data": valueData,
                    "created": _query[i]['created']
                })
            }


            res.send({ isError: false, msg: array_out })









            return;

        } catch (e) {

            console.log(e)

            return res.send({ isError: true, msg: "Some error occured" })
        }

    })



};