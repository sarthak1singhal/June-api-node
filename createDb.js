var connection = require('./params.js')


  
const db = {
    'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': ''
    },
	'database': 'marketing',
    'users_table': 'allusers'
};


 
  

  
connection.query('\
CREATE TABLE if not exists `' + 'marketing' + '`.`' + 'allusers' + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `f_name` VARCHAR(60) NOT NULL, \
    `l_name` VARCHAR(60) NOT NULL, \
    `phoneNo` VARCHAR(13) NOT NULL, \
    `access` VARCHAR(10) NOT NULL, \
    `countryCode` VARCHAR(5) NOT NULL, \
    `email` VARCHAR(60) NOT NULL, \
    `password` VARCHAR(150) NOT NULL, \
    `mailVerified` int(2) NOT NULL , \
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
     PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');
  



connection.query('\
CREATE TABLE if not exists `' + 'marketing' + '`.`' + 'influencer_details' + '` ( \
    `foreign_id` int NOT NULL unique REFERENCES allusers(id) ON DELETE CASCADE , \
    `content_language` VARCHAR(60) NOT NULL, \
    `region` VARCHAR(60) NOT NULL, \
    `content_category` VARCHAR(40) NOT NULL, \
    `content_category2` VARCHAR(40) NOT NULL, \
    `gender` VARCHAR(10) NOT NULL, \
    `birth_date` date NOT NULL \
)');
  

 
connection.query('\
CREATE TABLE if not exists `' + 'marketing' + '`.`' + 'countries' + '` ( \
    `foreign_id` int NOT NULL REFERENCES influencer_details(foreign_id)  ON DELETE CASCADE, \
    `country` VARCHAR(60) NOT NULL \
)');



 
connection.query('\
CREATE TABLE if not exists `' + 'marketing' + '`.`' + 'content_languages' + '` ( \
    `foreign_id` int NOT NULL REFERENCES influencer_details(foreign_id)  ON DELETE CASCADE, \
    `language` VARCHAR(60) NOT NULL \
)');
  
connection.query('\
CREATE TABLE if not exists `' + 'marketing' + '`.`' + 'social_media_platforms' + '` ( \
    `foreign_id` int NOT NULL UNIQUE REFERENCES influencer_details(foreign_id)  ON DELETE CASCADE , \
    `isYoutube` int(2) NOT NULL, \
    `youtube_access_token` VARCHAR(300) NOT NULL, \
    `youtube_refresh_token` VARCHAR(200) NOT NULL, \
    `youtube_expiry` int(15) NOT NULL, \
    `youtube_id` VARCHAR(30) NOT NULL, \
    `youtube_channel_name` VARCHAR(50) NOT NULL, \
    `youtube_channel_description` int(100) NOT NULL, \
    `youtube_thumbnail_m` VARCHAR(100) NOT NULL, \
    `youtube_thumbnail_h` VARCHAR(100) NOT NULL, \
    `youtube_view` int(15) NOT NULL, \
    `youtube_subscribers` int(15) NOT NULL, \
    `youtube_videos` VARCHAR(10) NOT NULL, \
    `isFacebook` int(2) NOT NULL, \
    `facebook_access_token` VARCHAR(300) NOT NULL, \
    `facebook_refresh_token` VARCHAR(200) NOT NULL, \
    `facebook_expiry` int(15) NOT NULL, \
    `facebook_id` VARCHAR(30) NOT NULL, \
    `facebook_page_description` VARCHAR(100) NOT NULL, \
    `facebook_page_likes` int(100) NOT NULL, \
    `facebook_thumbnail_m` VARCHAR(100) NOT NULL, \
    `facebook_posts` int(15) NOT NULL, \
    `isInstagram` int(2) NOT NULL, \
    `instagram_access_token` VARCHAR(300) NOT NULL, \
    `instagram_refresh_token` VARCHAR(200) NOT NULL, \
    `instagram_expiry` int(15) NOT NULL, \
    `instagram_id` VARCHAR(30) NOT NULL, \
    `instagram_page_description` VARCHAR(100) NOT NULL, \
    `instagram_thumbnail_m` VARCHAR(100) NOT NULL, \
    `instagram_followers` int(15) NOT NULL, \
    `instagram_posts` int(15) NOT NULL \
)');
  

 
connection.query('\
CREATE TABLE if not exists `' + 'marketing' + '`.`' + 'brand_details' + '` ( \
    `foreign_id` int NOT NULL REFERENCES allusers(id)  ON DELETE CASCADE, \
    `brand_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `logo` VARCHAR(100) NOT NULL, \
    `brand_name` VARCHAR(100) NOT NULL, \
    `description` VARCHAR(300) NOT NULL, \
    `website` VARCHAR(100) NOT NULL, \
    `contact_name` VARCHAR(100) NOT NULL, \
    `phone_number` VARCHAR(100) NOT NULL, \
    `address` VARCHAR(100) NOT NULL, \
    `city` VARCHAR(100) NOT NULL, \
    `country` VARCHAR(300) NOT NULL, \
    `postal_code` VARCHAR(100) NOT NULL, \
    `company_email` VARCHAR(100) NOT NULL, \
    PRIMARY KEY (`brand_id`), \
    UNIQUE INDEX `id_UNIQUE` (`brand_id` ASC) \
        )');



connection.query('\
CREATE TABLE if not exists `' + 'marketing' + '`.`' + 'campaign_details' + '` ( \
    `foreign_id` int NOT NULL REFERENCES allusers(id)  ON DELETE CASCADE, \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `brand_id` INT NOT NULL, \
    `campaign_name` VARCHAR(100) NOT NULL, \
    `product_name` VARCHAR(100) NOT NULL, \
    `product_description` VARCHAR(300) NOT NULL, \
    `product_category` VARCHAR(20) NOT NULL, \
    `dos` VARCHAR(200) NOT NULL, \
    `donts` VARCHAR(200) NOT NULL, \
    `isInstagram` INT(2) NOT NULL, \
    `isYoutube` INT(2) NOT NULL, \
    `isFacebook` INT(2) NOT NULL, \
    `insta_hash_tags` VARCHAR(200) NOT NULL, \
    `insta_tags` VARCHAR(100) NOT NULL, \
    `insta_something_else` VARCHAR(200) NOT NULL, \
    `insta_your_post` VARCHAR(100) NOT NULL, \
    `insta_reference` VARCHAR(200) NOT NULL, \
    `insta_min_followers` int(10) NOT NULL, \
    `fb_tags` VARCHAR(100) NOT NULL, \
    `fb_hash_tags` VARCHAR(200) NOT NULL, \
    `fb_something_else` VARCHAR(100) NOT NULL, \
    `fb_your_post` VARCHAR(200) NOT NULL, \
    `fb_reference` VARCHAR(100) NOT NULL, \
    `fb_min_likes` int(10) NOT NULL, \
    `yt_hash_tags` VARCHAR(200) NOT NULL, \
    `yt_something_else` VARCHAR(100) NOT NULL, \
    `yt_reference` VARCHAR(100) NOT NULL, \
    `yt_min_subs` int(10) NOT NULL, \
    `is_prod_digital` int(2) NOT NULL, \
    `will_company_send` int(2) NOT NULL, \
    `start_date` DATE NOT NULL, \
    `end_date` DATE NOT NULL, \
    `status` VARCHAR(10) NOT NULL, \
    `average_price` INT NOT NULL, \
    `min_age` INT NOT NULL, \
    `max_age` INT NOT NULL, \
    `gender` VARCHAR(7) NOT NULL, \
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
    PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
        )');
        

 

connection.query('\
CREATE TABLE if not exists `' + 'marketing' + '`.`' + 'campaign_countries' + '` ( \
    `foreign_id` int NOT NULL REFERENCES campaign_details(id)  ON DELETE CASCADE, \
    `country` VARCHAR(60) NOT NULL \
)');





connection.query('\
CREATE TABLE if not exists `' + 'marketing' + '`.`' + 'campaign_languages' + '` ( \
    `foreign_id` int NOT NULL REFERENCES campaign_details(id)  ON DELETE CASCADE, \
    `languages` VARCHAR(60) NOT NULL \
)');

connection.query('\
CREATE TABLE if not exists `' + 'marketing' + '`.`' + 'campaign_categories' + '` ( \
    `foreign_id` int NOT NULL REFERENCES campaign_details(id)  ON DELETE CASCADE, \
    `category` VARCHAR(60) NOT NULL \
)');

connection.query('\
CREATE TABLE if not exists `' + 'marketing' + '`.`' + 'bids' + '` ( \
    `foreign_id` int NOT NULL REFERENCES campaign_details(id)  ON DELETE CASCADE, \
    `category` VARCHAR(60) NOT NULL \
)');


console.log('Success: Database Created!')

connection.end();







 