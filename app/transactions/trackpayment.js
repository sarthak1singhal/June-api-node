var path = require('path');
const config = readJson(`config.json`);
const acon = require('../../initSql')
const RazorPay = require('razorpay'); 

var con = require('../../params.js')
const fx = require('../functions/functions')
const multer = require("multer")
var fs = require('file-system');

const upload = multer({
    dest: path.join(__dirname, '../../upload')
        // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

module.exports = function(app) {

    app.post('/addpayments', fx.isLoggedIn, async function(req, res) {
        let { paymentid, orderid , paymentsignature ,userid ,ammount} = req.body;
     
    
       let addPayment = await acon.query("insert into payments (paymentid,orderid,paymentsignature, userid , ammount )values(?,?,?,?,?)", [paymentid, orderid , paymentsignature , userid ,ammount]).catch( (e) => res.send({ statusCode : 500 ,message : e ,data :{ } }));
        if(addPayment){
            
            return res.send({ statusCode : 200 , message: 'ok' , data:{}});
        }   
    

    })
}
