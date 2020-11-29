const https = require('request')

const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");
const acon = require('../../initSql')

module.exports = function(app) {


    app.post('/showVideoComments', async function(req, res) {

            video_id = req.body.video_id;

            if (req.body.offset == null) {
                return res.send({
                    isError: true,
                    msg: "Offset required"
                })
            }


            if (video_id) {
                array_out = [];

                try {




                    let [_query, f] = await acon.query("select * from video_comment where video_id= ? order by id DESC limit ?, 25", [video_id, req.body.offset])

                    for (i in _query) {
                        let [rd, f1] = await acon.query("select * from users where fb_id = ?", [_query[i].fb_id]);

                        array_out.push({
                            "video_id": _query[i]['video_id'],
                            "fb_id": _query[i]['fb_id'],
                            "user_info": {
                                "first_name": rd[0].first_name,
                                "last_name": rd[0].last_name,
                                "profile_pic": fx.getImageUrl(rd[0].profile_pic),
                                "username": rd[0].username,
                                "verified": rd[0].verified,
                            },

                            "comments": _query[i]['comments'],
                            "created": _query[i]['created']
                        })
                    }


                    return res.send({ isError: false, msg: array_out })











                } catch (e) {
                    console.log(e)
                }


            } else {
                return res.send(

                    {

                        isError: true,

                        msg: "Json Parem are missing"

                    })
            }
        }

    )

};