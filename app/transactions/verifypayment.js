var path = require('path');
const config = readJson(`config.json`);
const acon = require('../../initSql')
const RazorPay = require('razorpay'); 
const  crypto = require('crypto');
var con = require('../../params.js')
const fx = require('../functions/functions')
const multer = require("multer")
var fs = require('file-system');

const upload = multer({
    dest: path.join(__dirname, '../../upload')
});

module.exports = function(app) {

    app.post('/verfiypayment', fx.isLoggedIn, async function(req, res) {
        try{
        let { razorpayorderid ,  razorpaypaymentid , razorpaysignature } = req.body;


        const hmac = crypto.createHmac('sha256', 'H6HTbmbnD0PEelgn2BeFXjq7');

        hmac.update(razorpayorderid + "|" + razorpaypaymentid);
        
        let generatedSignature = hmac.digest('hex');

        let isSignatureValid = generatedSignature == razorpaysignature;

        res.send( { statusCode : 200 , data:{ paymentdone : isSignatureValid } , message:'ok'  } )
    
        }catch(err){
            res.send( { statusCode : 500 , data:{  } , message:'internal server error'  } )
        }       
    })
}
