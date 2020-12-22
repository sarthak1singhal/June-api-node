var path = require('path');
const config = readJson(`config.json`);
const acon = require('../../initSql')
const RazorPay = require('razorpay');

var con = require('../../params.js')
const fx = require('../functions/functions')
const multer = require("multer")
var fs = require('file-system');
const formateDate = require('../functions/formatedate');

const upload = multer({
    dest: path.join(__dirname, '../../upload')
        // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

module.exports = function(app) {

    app.post('/userstats', fx.isLoggedIn, async function(req, res) {
        
        let { time } = req.body;

        let userid = req.user.id;

        let formatedDate = formateDate(new Date())
        let allTransactions = await acon.query("select * from transactions where user_to = ? and where createdat between ? and ?",[userid,time,formatedDate]).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));
        let totalNumberOfDiamonds = allTransactions.reduce((a,b)=> parseInt(a.diamonds) +  parseInt(b.diamonds),0) 
        return res.send({ statusCode: 200, message: 'ok', data: { NumberOfDiamonds : totalNumberOfDiamonds} });
       

    })
}