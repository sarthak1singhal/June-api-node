// app/routes.js
var uuid = require('uuid');
const https = require('request')
 
 var path = require('path');
 const amysql = require('mysql2/promise');
 readJson = require("r-json");
const config = readJson(`config.json`);
 
module.exports = {
    
    

    discover : async function(req,res){

arr_out = []


        fb_id = req.query.fb_id;
 
        if(fb_id){
            
          

                 q = "Select * from videos where section = ? order by rand() limit 4"
                v = []
           
              try{
                const acon = await amysql.createConnection({
                  host     : config.host,
                  user     : config.user,
                  password : config.password,
                  database : config.database
                });
                
                hmap = {};
                arr = [];
                const [rows, fields]  =  await acon.execute("select * from discover_section order by value limit 20");
                for(i in rows)
                {
          
          
                  v.unshift(rows[i].id)
                  
                  const [row_posts, fields]  =  await acon.execute(q,v);
          
                  for(j in row_posts)
                  {
                    [query1,f]= await acon.execute("select * from users where fb_id=? ", [row_posts[j].fb_id]);
                      
                    [query112,f1]= await acon.execute("select * from sound where id= ?", [row_posts[j].sound_id]);
                     
                       
                    [countcomment,f] =await acon.execute("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);
                     
                    
                    [liked,f] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id=? and fb_id= ?",[row_posts[j].id,row_posts[j].fb_id]);
                     
                    score = 60 + row_posts[j]['like'] - 1.5*row_posts[j]['unlike']  - 2*row_posts[j]['report'] ;
          
                    if( row_posts[j]>1000)
                    {
                      score =  row_posts[j]['like'] - 12*  row_posts[j]['report'] - 7* row_posts[j]['unlike']; 
                    }
                    else if( row_posts[j]['view']>10000)
                    {
                      score = row_posts[j]['like'] - 120* row_posts[j]['report'] - 70* row_posts[j]['unlike'] ;
                    }
                     if(score>0)
                    {
                      smap = {};
                      if(query112.length ==0)
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
                              "section":null,
                              "created" : null,
                                  
                            }
          
                      }else{
                          console.log(query112)
                        smap = {
                          "id" : query112[0].id,
                          "audio_path" :{
                                      "mp3" : query112[0].id+".mp3",//complete sound path here
                                      "acc" :query112[0].id+".aac"
                          },
                              "sound_name" :query112[0].sound_name,
                              "description" : query112[0].description,
                              "thum" :query112[0].thum,
                              "section": query112[0].section,
                              "created" : query112[0].created,
                                  
                            }
                      }
          
          
          
          
          
                      arr.push({
                      "id" :  row_posts[j]['id'],
                      "fb_id" :  row_posts[j]['fb_id'],
                      "user_info":{
                              "fb_id" : query1[0].fb_id,
                              "first_name" : query1[0].first_name,
                              "last_name" :query1[0].last_name,
                              "profile_pic" : query1[0].profile_pic,
                              "username" : query1[0].username,
                              "verified" : query1[0].verified,
                              "gender" : query1[0].gender,
                              "created" : query1[0].created,
                      },
                      "count" :
                            {  "like_count": row_posts[j]['like'],
                              "video_comment_count": countcomment['count'],
                              "view" :row_posts[j]['view'],

                            },
                      "liked": liked['count'],			
                      "video" : row_posts[j]['video'],
                      "thum" :row_posts[j]['thum'],
                      "gif" :row_posts[j]['gif'],
                      "description": row_posts[j]['description'],
                      "sound" :smap,
                      "created" : row_posts[j]['created']}
                    );
          
          

           
                    }
          
                     
                  }
          
          
          
          
          
          
                  v.shift();
          
          
                  
          
                }

                if(arr.length!=0)
                {
                    arr_out.push({
                        section_name:rows[j].section_name,
                        section_videos:arr
                    })
                }
          
          
              }catch(e)
            {
                console.log(e);
            }


            res.send({code:"200", msg: arr_out})


        }else{
            res.send(
              
            {
            
                code:201,
            
                msg:{response :"Json Parem are missing"}
            
            })
        }

    },




    SearchByHashTag : async function(req,res){
      fb_id = req.query.fb_id;

      if(!fb_id) fb_id = ""

      tag = req.query.tag

      if(!tag) tag = ""

      token = req.query.token
      if(fb_id.trim() != "" && tag.trim()!="")
      {

        try{


          const acon = await amysql.createConnection({
            host     : config.host,
            user     : config.user,
            password : config.password,
            database : config.database
          });



          [q,w] = acon.execute("update users set token = ? where fb_id = ?",[token,fb_id])

          [row,w] = acon.execute("select * from videos where description like '%" + tag +"%' order by rand()")



        for(i in row)
    		{
    		    
    		    [rd,f]=acon.execute("select * from users where fb_id= ? ", [row[i].fb_id]);
		        
		        [rd12,f1]=acon.execute("select * from sound where id= ? ",[row[i].sound_id]);
		        
		        countLikes_count =acon.execute("SELECT count(*) as count from video_like_dislike where video_id=? ", [row[i].id]);
                
		        countcomment_count = acon.execute("SELECT count(*) as count from video_comment where video_id=? ",[row[i].id]);
                
                
            liked_count = acon.execute("SELECT count(*) as count from video_like_dislike where video_id= ? and fb_id= ? ",[[row[i].id],fb_id]);
            
            smap  = {}
            if(rd12.length==0)
            {

              smap ={
                "id" :null,
                "audio_path" :{
                            "mp3": null,
                            "acc" : null
                },
                    "sound_name" :null,
                    "description" : null,
                    "thum" : null,
                    "section" : null,
                    "created" : null,
                        
                  }
            

            }else{

              smap ={
                "id" : rd12[0].id,
                "audio_path" :{
                            "mp3": rd12[0].id +".mp3",
                            "acc" : rd12[0].id + ".aac"
                },
                    "sound_name" : rd12[0].sound_name,
                    "description" : rd12[0].description,
                    "thum" : rd12[0].thum,
                    "section" : rd12[0].section,
                    "created" : rd12[0].created,
                        
                  }
            }


        	   	array_out.push(
                 
              {  "id" : row[i]['id'],
        			"fb_id" : row[i]['fb_id'],
        			"user_info" :{
            					    "first_name" :rd[0].first_name,
                        			"last_name" :rd[0].last_name,
                        			"profile_pic" :rd[0].profile_pic,
                        			"username" :rd[0].username,
                        			"verified" :rd[0].verified,
              },
            		"count":{
            					    "like_count": countLikes_count['count'],
                        			"video_comment_count": countcomment_count['count'],
                        			"view": row[i]['view'],
                },
            		"liked" :liked_count['count'],			
            	    "video" : row[i]['video'],
        			"thum" : row[i]['thum'],
        			"gif" : row[i]['gif'],
        			"description" : row[i]['description'],
        			"sound" : smap,
        			"created" : row[i]['created']
}        		);
    			
    		}


        res.send({code : 200, msg:array_out})


        }catch(e)
        {
          console.log(e)
        }

      }else{

        res.send({code:"201", msg:"params not found"})

      }



    }
    




,
    search : async function (req,res){
      type = req.query.type;
      keyword = req.query.keyword;
    
    
      if(!keyword) keyword = ""
      if(type && keyword.trim()!="")
      {
        if(type == "video")
        {
          
        }
      }
    }
 
 

};



 