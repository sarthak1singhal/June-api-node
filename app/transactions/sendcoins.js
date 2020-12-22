
const fx = require('../functions/functions')
const  { coinsToDiamond , diamondToINR  } = require('../functions/coinstodiamonds')
const acon = require('../../initSql');

module.exports = function(app) {

    app.post('/sendcoins', fx.isLoggedIn, async function(req, res) {

        let { userTo , coins ,giftname  } = req.body;
        let userid = req.user.id ; 
        let diamonds = coinsToDiamond(coins);
        try{   
         await acon.beginTransactionAsync();
        let allPromises = [ acon.query("update users set coins = coins - ? where fb_id = ?",[amToCoin[parseInt(coins) , userid]  ]) , acon.query("update users set diamonds = diamonds + ? where fb_id = ?",[diamonds, userTo] , acon.query("insert into transactions (user_to,user_from,coins,diamonds,gift_name )values(?,?,?,?, ?)",[userTo,userid,coins,diamonds,giftname]) ) ] 
        const results = await Promise.all(allPromises)
        await acon.commit()
        await acon.end()
        return res.send({statusCode : 200 , message:'ok' , data : results})
    } catch (err) {
        await acon.rollback()
        await acon.end()
        return res.send({statusCode : 500 , message:'internal server error' , data : err})
      
    }     

    })
}