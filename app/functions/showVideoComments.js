const https = require('request')
    
 const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);

module.exports = {
    
    

    showVideoComments : async function(req,res){
        fb_id = req.query.fb_id;
 
        video_id = req.query.video_id;

        if(video_id){
            array_out = [];

            try{

                const acon = await amysql.createConnection({
                    host     : config.host,
                    user     : config.user,
                    password : config.password,
                    database : config.database
                  });



           const [_query,f] = await acon.execute("select * from video_comment where video_id= ? order by id DESC",[video_id])

           for(i in  _query)
           {
            [rd,f1] =await acon.execute("select * from users where fb_id= ?",[_query[i].fb_id]);
              
            array_out.push( 
                 {
                 "video_id" : _query[i]['video_id'],
                 "fb_id" : _query[i]['fb_id'],
                 "user_info" :{
                                 "first_name" :rd[0].first_name,
                                 "last_name" :rd[0].last_name,
                                 "profile_pic" :rd[0].profile_pic,
                                 "username" :rd[0].username,
                                 "verified" :rd[0].verified,
                 },
                 
                 "comments": _query[i]['comments'],
                 "created" : _query[i]['created']
                })
           }


           res.send({code:"200", msg:array_out})











        }
        catch(e)
        {
            console.log(e)
        }


        }else{
            res.send(
              
                {
                
                    code:201,
                
                    msg:{response :"Json Parem are missing"}
                
                })
        }
    }
 
 

};



 