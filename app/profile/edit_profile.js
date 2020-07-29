// app/routes.js
var uuid = require('uuid');
const https = require('request')
 
 var path = require('path');
 
var con = require('../../params.js')

 
module.exports = {
     
    edit_profile : function(req,res){ 
        fb_id = req.query.fb_id;
        first_name = req.query.first_name;
        last_name= req.query.last_name;
        username= req.query.username;
        gender = req.query.gender;
        bio= req.query.bio;
        if(!bio) bio = "";
        if(!gender) gender = "";
        if(!last_name) last_name = ""
        if(!username) {res.send({code:"201", msg:{response:"Username is missing"}});
    return
    }
        if(!first_name){                                 res.send({code:"201", msg:{response:"First name is missing"}})
    return;    
    }
        if(!last_name){                                res.send({code:"201", msg:{response:"Problem in updating"}})
return;
}

        if(fb_id&&first_name && last_name&& username && gender && bio){
            fb_id = req.query.fb_id.trim();
            first_name = req.query.first_name.trim();
            last_name= req.query.last_name.trim();
            username= req.query.username.trim();
            gender = req.query.gender.trim();
            bio= req.query.bio.trim();
    
            con.query("select * from users where username = ?",[username],function(e,r){

                if(e) console.log(e)


                else{

                    user_fb_id = ""
                    if(r.length != 0)
                        user_fb_id = r[0].fb_id


                     if(r.length>1)
                     {
                        res.send({code:"201", msg:{response:"Problem in updating"}})

                        return
                     }   

                    if(user_fb_id == ""|| user_fb_id == fb_id)
                    {
                        con.query("update users SET first_name =? , last_name =? , gender = ?, bio =?  , username = ?  WHERE fb_id = ? ",[first_name,last_name,gender,bio,username,fb_id],function(erri,r){



                            if(erri) {console.log(erri)

                                res.send({code:"201", msg:{response:"Problem in updating"}})

                            }
                            else{


                                con.query("select * from users where fb_id = ?",[fb_id],function(error,row){

                                    if(row.length!=0)
                                    {

                                        
                                array_out = [{

                                    first_name: row[0].first_name,
                                    username: row[0].username,
                                    verified : row[0].verified,

                                    "last_name" : row[0].last_name,
                                    "gender" : row[0].gender,
                                    "bio" : row[0].bio
                                }]


                                res.send({

                                    code:"200",
                                    msg: array_out
    
                                })
    
                                    }



                                })


                            }




                      

                        })
                    }
                    else{

                        res.send({code:"201", msg:{response:"Username already exist"}})


                    }












                }


            })

          

        }else{
            res.send(
              
            {
            
                code:201,
            
                msg:{response :"Json Parem are missing"}
            
            })
        }

    },




    follow_users: function(req,res){

        fb_id = req.query.fb_id;
        followed_fb_id = req.query.followed_fb_id;
        status= req.query.status;

        if(fb_id && followed_fb_id && status)
        {

            if(fb_id.trim() =="") return;
            if(followed_fb_id.trim() =="") return;
            if(status.trim() =="") return;
        
        
            if(status == "0")
            {

                con.query("delete frim follow_users where fb_id = ? and followed_fb_id = ?",[fb_id,followed_fb_id],function(e,r){


if(e) console.log(e)
            res.send({code:"200", msg:{response:"unfollow"}})

                    


                    

                })
            }
            else 
            {

                con.query("insert into follow_users(fb_id,followed_fb_id)values(?,?)",[fb_id,followed_fb_id],function(e,r){


                    if(e) console.log(e)

                    else{
                        res.send({code:"200", msg:{response:"follow successful"}})


con.query("insert into notification(my_fb_id,effected_fb_id,type,value)values(?,?,?,?)",[fb_id,followed_fb_id,"following_you",""],function(err,row){


    
})


                    }


                })



            }
        
        
        
        
        
        }else{
            res.send({code:"201", msg:{response:"Params not exist"}})

        }



    }
 
 



    

};



 