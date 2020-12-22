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
        let { razorpayorderid ,  razorpaypaymentid , razorpaysignature  , amount } = req.body;
        let userid = req.user.id;
        const amToCoin = {
            60: 49,
            300:199,
            1000:549,
            2000:999
        }

    
        const hmac = crypto.createHmac('sha256', 'H6HTbmbnD0PEelgn2BeFXjq7');

        hmac.update(razorpayorderid + "|" + razorpaypaymentid);
        
        let generatedSignature = hmac.digest('hex');

        let isSignatureValid = generatedSignature == razorpaysignature;

       if(isSignatureValid){
        let addPayment = await acon.query("insert into payments (paymentid, orderid, paymentsignature, userid , amount )values(?,?,?,?,?)", [paymentid, orderid, paymentsignature, userid, amount]).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));
        if (addPayment) {
             let updateuser = await acon.query("update users set coins = coins + ? where fb_id = ?",[amToCoin[parseInt(amount) , userid]  ]).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));    
        if(updateuser){
                res.send( { statusCode : 200 , data:{ paymentdone : isSignatureValid } , message:'ok'  } )
             }else{
             res.send( { statusCode : 500 , data:{  } , message:'internal server error'  } )
             }
         }else{
             res.send( { statusCode : 500 , data:{  } , message:'internal server error'  } )
         }
        }else{
            res.send( { statusCode : 500 , data:{  } , message:'internal server error'  } )   
        }
        }catch(err){
            res.send( { statusCode : 500 , data:{  } , message:'internal server error'  } )
        }       
    })
}
