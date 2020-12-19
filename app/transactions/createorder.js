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

    app.post('/createorders', fx.isLoggedIn, async function(req, res) {
        let { ammount , currency , receipt } = req.body;
     
        var instance = new Razorpay({
            key_id: 'rzp_test_Jj18yUc535vLdk',
            key_secret: 'H6HTbmbnD0PEelgn2BeFXjq7',
            headers: {
              "X-Razorpay-Account": "FII7vy0E8UyFJa"
            }
          });

          instance.orders.create({amount, currency, receipt},function(err, order){
            console.log(err,order ,"=======================>")
                 if(order){
                     res.send({ statusCode : 200 , data:{ orderId :  order } , message :'ok' })
                 }  else{
                    res.send({ statusCode : 500 , data:{ } , message :'internal server error' })
                 } 

          })


    

    })
}
