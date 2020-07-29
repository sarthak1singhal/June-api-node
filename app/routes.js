// app/routes.js
  var uuid = require('uuid');
const https = require('request')
 
 var path = require('path');
 var con = require('../params.js')

const { v4: uuidv4 } = require('uuid');
 
var bcrypt = require('bcrypt-nodejs');
var uploadVideo = require('./functions/uploadVideo.js');
var reportVideo = require('./functions/reportVideo.js');
const { version } = require('os');

var showAllVideos = require('./home/showAllVideos.js');

var showMyAllVideos = require('./profile/showMyAllVideos.js')
var discover = require('./discover/discover')
var likeDislikeVideo = require('./functions/likeDislikeVideo')

var postComment = require('./functions/postComment')
var showVideoComments = require('./functions/showVideoComments')
var sounds = require('./functions/sounds')
var profile = require('./profile/profile')

var edit_profile = require('./profile/edit_profile')
//var postComment = require('./functions/postComment')
//var postComment = require('./functions/postComment')



module.exports = function(app, passport) {

	app.get('/index', (req, res) =>{
		

		if(req.query.p)
		{
			var p = req.query.p;
			if(p == "try_con"){
				res.send({message : "working"}) 
			}else
			if(p=="uploadVideo")
			{
				uploadVideo.uploadVideo(req)
			}
			if(p == "reportVideo"){
				reportVideo.reportVideo(req,res);
			}
			if(p == "signup"){
				signup(req,res);
			}else 
			if(p == "showAllVideos")
			{
				showAllVideos.showAllVideos(req,res);
			}else
			if(p =="showMyAllVideos")
			{
				showMyAllVideos.showMyAllVideos(req,res);
			}else
			if(p =="discover")
			{
				discover.discover(req,res);
			}else
			if(p=="likeDislikeVideo")
			{
				likeDislikeVideo.likeDislikeVideo(req,res);
			}
			else
			if(p=="postComment")
			{
				postComment.postComment(req,res);
			}else
			if(p=="showVideoComments")
			{
				showVideoComments.showVideoComments(req,res);
			}
			else if(p=="updateVideoView")
			{
				updateVideoView(req,res);
				
			}else if(p=="allSounds")
			{
				sounds.allSounds(req,res);

			}else if(p=="fav_sound")
			{
				sounds.fav_sound(req,res);

			}else if(p=="my_liked_video")
			{
				profile.my_liked_video(req,res);
			}
			else if(p=="my_FavSound")
			{
				sounds.my_FavSound(req,res);
			}
			else if(p=="edit_profile")
			{
				edit_profile.edit_profile(req,res);
			}
			else if(p=="follow_users")
			{
				edit_profile.follow_users(req,res);
			}		
			else if(p=="get_user_data")
			{
				profile.get_user_data(req,res);
			}	
			else if(p=="get_followers")
			{
				profile.get_followers(req,res);
			}
			else if(p=="get_followings")
			{
				profile.get_followings(req,res);
			}



			
			else if(p=="my_FavSound")
			{
				sounds.my_FavSound(req,res);
			}
			
		}




 	});

	 
 



 


   
		 
  
 
  
  









 





 
 
 

};



 function signup(req,res){
	console.log(req.headers)
 

	header_device = req.headers.device;
	header_version = req.headers['version'];
	header_tokon = req.headers['tokon'];
 	header_deviceid = req.headers['deviceid'];


	 fb_id = req.query.fb_id;
	 first_name = req.query.first_name;
	 last_name = req.query.last_name;
	 gender = req.query.gender;
	 profile_pic = req.query.profile_pic;
	 version1 = req.query.version;
	 device = req.query.device
	 signup_type= req.query.signup_type
	 username = first_name + Math.floor(Math.random() * 10000000);
//get a unique username here 

	 if(fb_id && first_name && last_name)
	 {	

		con.query("select * from users where fb_id = ?",[fb_id],function(e,r){

			if(e){res.send({
				code:200,
				msg : {response :"problem in signup"}
			}) 
			console.log(e)}
			con.query("select * from device_tokon where fb_id= ?",[fb_id],function(er,ro){

				if(er){
					res.send({
						code:200,
						msg : {response :"problem in signup"}
					})
					console.log(er)
				}
				if(r.length !=0)
				{
 
					if(r.block == "0")
					{
 
						res.send(
							
							{
							code:200,	
							msg:{
							"fb_id" : r.fb_id,
							"action" : "login",
							"profile_pic": r.profile_pic,
							"first_name" : r.first_name,
							"last_name" : r.last_name,
							"username" : r.username,
							"verified" : r.verified,
							"bio" :r.bio,
							"gender": r.gender,
							"tokon" : r.tokon
						}})
					}else{
 
						res.send({
							code:201,
							msg : "error in login"
						}) 
					}
				}else{
 
 					con.query("insert into users(fb_id,username,first_name,last_name,profile_pic,version,device,signup_type,gender)values(?,?,?,?,?,?,?,?,?)",[fb_id,username,first_name,last_name,profile_pic,version1,device,signup_type,gender],function(error,row){

						if(error){ 
							console.log(error)

 							res.send({
								code:200,
								msg : {response :"problem in signup"}
							})
							
						
						}else{
 
							var date = new Date(); var timestamp = date. getTime();
							tokon = timestamp + Math.floor(Math.random() * 100000000)
							console.log(tokon,"RANDAAP")
							con.query("insert into device_tokon(fb_id,tokon,phone_id)values(?,?,?)",[fb_id,tokon,header_deviceid], function(er1,ro1){
								if(er1){
									
									console.log("JHANT")
									console.log(er1)
							
								}
								else{
									res.send({
										code: 200,
										msg : {
											"fb_id" : fb_id,
											"username" : username,
											"action" : "signup",
											"profile_pic": profile_pic,
											"first_name" : first_name,
											"last_name" : last_name,
											"signup_type" : signup_type,
											"gender" : gender,
											"tokon" : tokon
										}
									})
								}


							})

						}


					})

				}

			})


		})
	 }
	 else{

		res.send(
{
	code:201,
			msg:{response :"Json Parem are missing"}
		})

	 }


}



function updateVideoView(req,res){

	id = req.query.id;

	if(id){
		con.query("update videos set `view` = `view` + 1 where id = ?",[id],function(er,row){


res.send(
{
	code:"200",
			msg:{response :"success"}
		})

			
		})

	}
	else{

		res.send(
{
	code:201,
			msg:{response :"Json Parem are missing"}
		})

	 }

}