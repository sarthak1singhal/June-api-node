// app/routes.js
var uuid = require('uuid');
const https = require('request')
 
 var path = require('path');
 var con = require('../../params.js')

 
module.exports = {
    
    

    reportVideo : function(req, res){

        console.log("SASTI");

        console.log(req.query);
        fb_id = req.query.fb_id;
        action = req.query.action;

        video_id = req.query.video_id
        if(fb_id && video_id && action ){



            con.query("select * from device_tokon where fb_id = ?",[fb_id],function(dd,rrr){

                console.log(rrr, "MAA KA BHOSDAS")
                if(dd) console.log(dd)
                else if(rrr.length!=0)
                {
                    video_id = parseInt(video_id);
 
                    con.query("select * from videos where id = ?", [video_id],function(e,r){
        
                        if(e) console.log(e)
        
                        console.log(r, "RHOS IS R")
                        videoCreatorId = r[0].fb_id
                       
                                if(videoCreatorId!=fb_id)
                                {
                                    if(action == "I don't like it")
                                    {
                                        con.query("update videos set `unlike` = `unlike` + 1 where id=?",[video_id], function(e1,r1){
        
                                            if(e1) console.log(e1);
        
                                        });
                                    }
                                    else  
                                    {
                                       
                                        con.query("insert into reportVideo(video_id,fb_id,video_creater_id,action)values(?,?,?,?)",[video_id,fb_id,videoCreatorId, action],function(err,row){
        
                                            if(err) console.log(err)
        
                                            con.query("update videos set `report` = `report` + 1 where id = ?", [video_id],function(e2,r2){
        
                                                if(e2) console.log(e2);
        
        
        
                                            })
                        
                                        }) 
                                    
                                    
                                    
                                    }
               
                                    
                                }
                           
        
        
                      
        
        
                    })
                
                }

            })


            res.send({code:200, response:"actions success"});

        }else{
            res.send({code:201, response:"error"});

        }

        
        

    }
 
 

};



 