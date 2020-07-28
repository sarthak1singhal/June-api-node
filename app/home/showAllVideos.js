// app/routes.js
var uuid = require('uuid');
const https = require('request')
 
 var path = require('path');
 var con = require('../../params.js');
const { language } = require('googleapis/build/src/apis/language');
const { map } = require('jquery');

 
module.exports = {
    
    

  showAllVideos : function(req, res){

 
        console.log(req.query);
        fb_id = req.query.fb_id;
        action = req.query.action;
        token = req.query.token;
        _language = req.query.language;


        video_id = req.query.video_id
        if(fb_id  ){
          con.query("update users set tokon = ? where fb_id = ?",[fb_id],function(e,r){})


          if(!_language)
          {
            con.query("select * from users where id= ?",[fb_id],function(e,r){
              if(r.length!=0)
              {
                _language = r[0].language.toLowerCase();
              }else{
                _language = "";
              }

              showVideos(fb_id,action,token,_language,video_id,res);


            })
          }else{
            showVideos(fb_id,action,token,_language,video_id,res);

          }


       


 
        }else{
            res.send({code:201, response:"error"});

        }

        
        

    }
 
 

};



function showVideos(fb_id,action,token,language,video_id,res)
{
  if(video_id)
  {

    hmap = {};
    con.query("select * from videos where id= ?",[video_id],function(e,r){

        if(e){ console.log(e,"ShowAllVIdeos. 75")
    
        res.send({code:200,msg:"error"})
      }
        else{

          
            i=0
            console.log(i)
            con.query("select * from users where fb_id= ?",[r[i].fb_id],function(e1,r1){
              if(e1) console.log(e1)

              con.query("select * from sound where id = ?",[r[0].sound_id],function(e2,r2){
                i=0

                if(e2) console.log(e2)
                console.log(r[0],"SS" + i)

                con.query("SELECT SUM(action) as count, SUM(dislike) as dislike, SUM(report) as report from video_like_dislike where video_id= ?",[r[i].id],function(e3,r3){
                  if(e3) console.log(e3,"90");

                  con.query("SELECT count(*) as count from video_comment where video_id= ?",[r[0].id],function(e4,r4){

                      if(e4) console.log(e4)

                      con.query("SELECT count(*) as count from video_like_dislike where video_id= ? and fb_id= ? ",[r[i].id,fb_id],function(e5,r5){
                        if(e5) console.log(e5)

                        console.log(r2,"r2")


                        smap = {};
                        if(r2.length ==0)
                        {

                          smap = {
                            "id" : null,
                            "audio_path" :{
                                        "mp3" :null,//complete sound path here
                                        "acc" :null
                            },
                                "sound_name" :null,
                                "description" : null,
                                "thum" :null,
                                "section": null,
                                "created" : null,
                                    
                              }

                        }else{
                          smap = {
                            "id" : r2[0].id,
                            "audio_path" :{
                                        "mp3" : r2[0].id+".mp3",//complete sound path here
                                        "acc" :r2[0].id+".aac"
                            },
                                "sound_name" :r2[0].sound_name,
                                "description" : r2[0].description,
                                "thum" :r2[0].thum,
                                "section": r2[0].section,
                                "created" : r2[0].created,
                                    
                              }
                        }
                        hmap=[{
                          "id" : r[i]['id'],
                          "fb_id" : r[i]['fb_id'],
                          "user_info":{
                                      "first_name" : r1[0].first_name,
                                          "last_name": r1[0].last_name,
                                          "profile_pic" : r1[0].profile_pic,
                                          "username" :r1[0].username,
                                          "verified" : r1[0].verified,
                                  },
                            "count" :{
                                      "like_count" : r3['like'],
                                          "video_comment_count" :  r4['count']
                                  },
                            "liked": r5['count'],			
                              "video": r[i]['video'],
                          "thum" : r[i]['thum'],//complete file path for the files
                          "gif" : r[i]['gif'],
                          "description": r[i]['description'],
                          "sound" : smap,
                          "created" : r[i]['created']
                        }];

                         res.send({code: 200,msg:hmap})

                      })

                  })
                })

              })

            })
    


          }

 

    })
  }else{

    q = "Select * from videos where section = ?"

  


    
  }




}