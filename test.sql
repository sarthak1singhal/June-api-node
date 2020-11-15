-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 29, 2020 at 11:45 AM
-- Server version: 5.6.45
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dtrack_dtrack`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `pass` varchar(250) NOT NULL COMMENT 'password should be md5()'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `pass`) VALUES
(1, 'admin@admin.com', 'e10adc3949ba59abbe56e057f20f883e');

-- --------------------------------------------------------

--
-- Table structure for table `device_tokon`
--

CREATE TABLE `device_tokon` (
  `id` int(11) NOT NULL,
  `fb_id` varchar(250) NOT NULL,
  `tokon` varchar(250) NOT NULL,
  `phone_id` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `discover_section`
--

CREATE TABLE `discover_section` (
  `id` INT AUTO_INCREMENT primary key NOT NULL,
  `section_name` varchar(50) NOT NULL,
  `section_image` varchar(50) default NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `value` int(12) default 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1;





  
 

-- --------------------------------------------------------

--
-- Table structure for table `fav_sound`
--

CREATE TABLE `fav_sound` (
  `id` int(11) NOT NULL,
  `fb_id` varchar(50) NOT NULL,
  `sound_id` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `follow_users`
--

CREATE TABLE `follow_users` (
  `id` int(11) NOT NULL,
  `fb_id` varchar(250) NOT NULL,
  `followed_fb_id` varchar(250) NOT NULL COMMENT 'a person who follow by other'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `my_fb_id` varchar(250) NOT NULL,
  `effected_fb_id` varchar(250) NOT NULL,
  `value` varchar(250) NOT NULL COMMENT 'this could be a video id',
  `type` varchar(250) NOT NULL COMMENT 'likes,comments,mention,followers',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

 

--
-- Table structure for table `sound`
--
 
CREATE TABLE `sound` (
  `id` int(11) NOT NULL,
  `sound_name` varchar(250) NOT NULL,
  `description` varchar(150) NOT NULL,
  `thum` varchar(500) NOT NULL,
  `section` varchar(250) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `priority` int NOT NULL default 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sound`
--

 
-- --------------------------------------------------------

--
-- Table structure for table `sound_section`
--

CREATE TABLE `sound_section` (
  `id` int(11) NOT NULL,
  `section_name` varchar(150) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sound_section`
--

INSERT INTO `sound_section` (`id`, `section_name`, `created`) VALUES
(27, 'Global Pop', '2020-05-23 11:28:19'),
(31, 'Trending', '2020-05-23 11:53:08'),
(32, 'TEST SECTION', '2020-05-25 16:48:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `fb_id` varchar(150) NOT NULL,
  `username` varchar(50) DEFAULT "",
  `verified` int(2) NOT NULL DEFAULT 0,
  `first_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL default "",
  `last_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL default "",
  `password` varchar(200) DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `phoneNumber` varchar(12) DEFAULT NULL,
  `isPhoneVerified` int(2) NOT NULL DEFAULT 0,
  `country_code` varchar(5) DEFAULT NULL,
  `gender` varchar(7) DEFAULT NULL,
  `bio` varchar(150) DEFAULT NULL,
  `profile_pic` varchar(300) DEFAULT NULL,
  `block` int(2) NOT NULL DEFAULT 0,
  `isPrivate` int(2) NOT NULL DEFAULT 0,
  `content_language` varchar(50) DEFAULT NULL ,
  `app_language` varchar(50) DEFAULT NULL ,
  `dob` DATE DEFAULT NULL ,
  `version` varchar(15) DEFAULT '0',
  `device` varchar(25) DEFAULT NULL,
  `signup_type` varchar(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP  
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `verification_request`
--

CREATE TABLE `verification_request` (
  `id` int(11) NOT NULL,
  `fb_id` varchar(150) NOT NULL,
  `profile` varchar(250) NOT NULL,
  `document` varchar(250) NOT NULL,
  `status` varchar(10) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `fb_id` varchar(150) NOT NULL,
  `description` varchar(400) NOT NULL DEFAULT "",
  `video` varchar(500) NOT NULL DEFAULT 'NULL',
  `thum` varchar(500) NOT NULL DEFAULT 'NULL',
  `gif` varchar(500) default NULL,
  `view` int(11) NOT NULL DEFAULT '0',
  `section` varchar(250) NOT NULL DEFAULT '0',
  `sound_id` varchar(120) NOT NULL DEFAULT '0',
  `language` varchar(20) NOT NULL DEFAULT 'english',
  `category` varchar(35) DEFAULT NULL,
  `like` int(11) NOT NULL  default 0 COMMENT '1= like ',
  `unlike` int(11) NOT NULL default 0  COMMENT '1= dislike ',
  `report` int(11) NOT NULL default 0  COMMENT '1= report ',
  `urlStorageType` varchar(10) NOT NULL default 'aws',
  `isCommentable` int(2) NOT NULL default 1,
  `isDuet` int(2) NOT NULL default 1,
  `isAvailable` int(2) NOT NULL default 0,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

 
--
-- Table structure for table `video_comment`
--

CREATE TABLE `video_comment` (
  `id` int(11) NOT NULL,
  `video_id` varchar(150) NOT NULL,
  `fb_id` varchar(50) NOT NULL,
  `comments` varchar(250) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `video_like_dislike`
--

CREATE TABLE `video_like_dislike` (
  `id` int(11) NOT NULL,
  `video_id` varchar(50) NOT NULL,
  `fb_id` varchar(150) NOT NULL,
  `creator_id` varchar(50) NOT NULL,
  `action` int(11) NOT NULL  default 0 COMMENT '1= like ',
   	  
`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


 
CREATE TABLE `reportVideo` (
  `id` INT AUTO_INCREMENT primary key NOT NULL,
  `video_id` varchar(50) NOT NULL,
  `fb_id` varchar(50) NOT NULL,
  `video_creater_id` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

 
CREATE TABLE `user_preference` (

`user_id` varchar(150) not null,
`pref_1` varchar(20) not null DEFAULT '0',
`pref_1_count` int(5) not null DEFAULT '0',
`pref_2` varchar(20) not null DEFAULT '0',
`pref_2_count` int(5) not null DEFAULT '0',
`pref_3` varchar(20) not null DEFAULT '0',
`pref_3_count` int(5) not null DEFAULT '0',
`pref_4` varchar(20) not null DEFAULT '0',
`pref_4_count` int(5) not null DEFAULT '0',
`pref_5` varchar(20) not null DEFAULT '0',
`pref_5_count` int(5) not null DEFAULT '0',
`user_up_value` int(10) not null DEFAULT '0',
`user_down_value` int(50) not null DEFAULT '0',
`language` varchar(15) not null 
);

 
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `device_tokon`
--
ALTER TABLE `device_tokon`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `discover_section`
--
 

--
-- Indexes for table `fav_sound`
--
ALTER TABLE `fav_sound`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `follow_users`
--
ALTER TABLE `follow_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sound`
--
ALTER TABLE `sound`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sound_section`
--
ALTER TABLE `sound_section`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section_name` (`section_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `fb_id` (`fb_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `verification_request`
--
ALTER TABLE `verification_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `video_comment`
--
ALTER TABLE `video_comment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `video_like_dislike`
--
ALTER TABLE `video_like_dislike`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `device_tokon`
--
ALTER TABLE `device_tokon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `discover_section`
--
 

--
-- AUTO_INCREMENT for table `fav_sound`
--
ALTER TABLE `fav_sound`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `follow_users`
--
ALTER TABLE `follow_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sound`
--
ALTER TABLE `sound`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT for table `sound_section`
--
ALTER TABLE `sound_section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `verification_request`
--
ALTER TABLE `verification_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `video_comment`
--
ALTER TABLE discover_section ADD UNIQUE (section_name);

ALTER TABLE `video_comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `video_like_dislike`
--
ALTER TABLE `video_like_dislike`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
