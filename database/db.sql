-- MySQL dump 10.13  Distrib 5.5.23, for Win64 (x86)
--
-- Host: localhost    Database: nodejs
-- ------------------------------------------------------
-- Server version       5.5.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `deleted_posts`
--

DROP TABLE IF EXISTS `deleted_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deleted_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `header` varchar(128) NOT NULL,
  `description` blob NOT NULL,
  `comments_count` int(11) NOT NULL,
  `tags` blob NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_ref` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deleted_posts`
--

LOCK TABLES `deleted_posts` WRITE;
/*!40000 ALTER TABLE `deleted_posts` DISABLE KEYS */;
INSERT INTO `deleted_posts` VALUES (11,'2020-01-29 02:39:07','Can you be the most of this','Masasdam',75,'hello guys',2),(20,'2020-01-29 02:47:53','Can you be the most of this','Gagagagogogo',61,'magnaluna daas',2),(21,'2020-01-29 02:39:07','Can you be the most of this','Masasdam',75,'hello guys',2),(22,'2020-01-29 02:47:53','Can you be the most of this','Gagagagogogo',61,'magnaluna daas',2),(23,'2020-01-29 03:29:59','Can you be the most of this','No u cant',7,'magnaluna',2),(24,'2020-01-29 02:50:56','Can you be the most of this','Gagagagogogo',8,'magnaluna daas',2),(25,'2020-01-29 02:46:30','Can you be the most of this','Gagagagogogo',94,'magnaluna daas',2),(26,'2020-01-29 02:46:51','Can you be the most of this','Gagagagogogo',43,'magnaluna daas',2),(27,'2020-01-29 02:45:06','Can you be the most of this','Gagagagogogo',6,'magnaluna daas',2),(28,'2020-01-29 02:43:06','Can you be the most of this','Gagagagogogo',59,'magnaluna daas',2),(29,'2020-01-29 02:43:02','Can you be the most of this','Gagagagogogo',67,'magnaluna daas',2),(30,'2020-01-29 02:41:31','Can you be the most of this','Gagagagogogo',24,'magnaluna sas',2),(31,'2020-01-29 02:41:20','Can you be the most of this','Gagagagogogo',30,'magnaluna sas',2),(32,'2020-01-29 02:35:20','Can you be the most of this','No u cant',6,'otter hello fetch',2),(33,'2020-01-29 02:36:11','Can you be the most of this','No u cant',73,'otter hello fetch',2),(34,'2020-01-29 02:36:19','Can you be the most of this','No u cant',40,'otter hello fetch',2),(35,'2020-01-29 02:36:29','Can you be the most of this','No u cant',17,'otter hello fetch',2),(36,'2020-01-31 14:32:17','Joke can never bo to be intrance of port by me',"Isn\'t it?",29,'lol parket where is your packet',2),(37,'2020-01-31 13:15:39','Hello tatatatatatat','My frens',44,'polish',2),(38,'2020-01-28 08:04:42','Hello!','World!',32,'hello world',1),(39,'2020-01-29 02:38:27','Can you be the most of this','Assssd',81,'otterton reeer tet',2),(40,'2020-01-29 02:32:20','Can you be the most of this','No u cant',31,'otter hello fetch',2),(43,'2020-01-31 13:53:46','Hello!','World!',32,'hello world',1),(44,'2020-02-01 04:53:24','Can you be the most of this','Haha, u can',85,'really not joke',2),(45,'2020-02-01 07:45:22','Hello, Boys! Welcome to my channel!','I \"will\" gank you!',4,'haha boy meme',2),(46,'2020-02-01 09:18:53','This is my new post!','Today I write to you my post. You read it now, I know. Thanks for reading!',69,'you waste time congrats',2),(47,'2020-02-01 09:18:03','This is my new post!','Today I write to you my post. You read it now, I know. Thanks for reading!',69,'you waste time congrats',2),(48,'2020-02-01 09:17:21','This is my new post!','Today I write to you my post. You read it now, I know. Thanks for reading!',4,'you waste time congrats',2),(49,'2020-02-01 09:16:40','This is my new post!','Today I write to you my post. You read it now, I know. Thanks for reading!',90,'you waste time congrats',2),(50,'2020-02-01 09:16:11','This is my new post!','Today I write to you my post. You read it now, I know. Thanks for reading!',25,'you waste time congrats',2),(51,'2020-02-01 09:15:31','This is my new post!','Today I write to you my post. You read it now, I know. Thanks for reading!',97,'you waste time congrats',2),(52,'2020-02-01 09:15:06','This is my new post!','Today I write to you my post. You read it now, I know. Thanks for reading!',49,'you waste time congrats',2),(53,'2020-02-01 09:14:42','This is my new post!','Today I write to you my post. You read it now, I know. Thanks for reading!',12,'you waste time congrats',2),(54,'2020-02-01 09:14:33','This is my new post!','Today I write to you my post. You read it now, I know. Thanks for reading!',24,'you waste time congrats',2),(55,'2020-02-01 09:13:25','This is my new post!','Today I write to you my post. You read it now, I know. Thanks for reading!',79,'you waste time congrats',2),(56,'2020-02-01 09:10:55','This is my new post!','Today I write to you my post. You read it now, I know. Thanks for reading!',13,'you waste time congrats',2),(57,'2020-02-01 10:33:39','Re:Zero second season','Coming out at April',3,'serontes',4),(58,'2020-02-22 11:11:25','ALklasjdlaksjdlaskdja','asdasdasdsa',68,'asd sdf dfg dfg dfg',5),(59,'2020-02-22 11:31:31','Tyg  hiuhi uh h gt','╨╖╨╛╨╕╨╜╨┐ ╨╜╨┐ ╨│╨╜ ╨┐╨│╨╜╨┐ ╤И╨│╨╜╨┐ ╨│╤И╨╜ ╨┐',90,'asd dgh hkj ytfuyf yty ytyty yty',2);
/*!40000 ALTER TABLE `deleted_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `header` varchar(128) NOT NULL,
  `description` blob NOT NULL,
  `comments_count` int(11) NOT NULL,
  `tags` blob NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_ref1` (`user_id`),
  CONSTRAINT `user_ref` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (36,'2020-02-01 07:31:25','My cat is my dog','No, my cat is my cat, not dog!',21,'cat dog animals',2),(37,'2020-02-01 07:39:02','Large text by Example','This is the largest text i ever seen, because it not true. Text must be beautiful relative to this site. If I will match this text with good posts in other sites, my site will be poor. But it\'s my first site on React! What I can I do! Yes. Agada.',84,'large_text maybe very_large_text',2),(38,'2020-02-01 07:42:22','Ser0ntes is a bad guy','Because he\'s listening \'Bad Guy\', haha!',26,'billie eilish serontes',2),(39,'2020-02-01 08:10:10','I need to pass this symbol \"','Yes, this symbol must be and here \", and here \\\"',5,'symbol test sql_injection',2),(49,'2020-02-01 09:17:31','This is my new post!','Today I write to you my post. You read it now, I know. Thanks for reading!',92,'you waste time congrats',2),(53,'2020-02-01 10:34:41','Re:Zero second season','Coming out at April',11,'anime rezero serontes spasibozapost',4),(54,'2020-02-09 09:00:38','Text with line break','Now I want to break a line here. May I use symbol \\n? Don\'t think so, because it\'s have server checking to this text.',94,'line_break',2);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `registration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `username` varchar(32) CHARACTER SET utf8 NOT NULL,
  `password` varchar(64) CHARACTER SET utf8 NOT NULL,
  `is_moderator` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2020-01-28 08:04:32','Hacker','You can\'t hack me!',0),(2,'2020-01-28 13:52:32','Example','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f',0),(3,'2020-02-01 09:20:26','EnDronist','dbf0f9af0b7287102fd4baa3f6b0b506ca5c8ab9c78b1a6deff300ef26641ac4',1),(4,'2020-02-01 10:26:51','Ser0ntes','15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225',0),(5,'2020-02-22 10:31:00','JarWeese','054e3b308708370ea029dc2ebd1646c498d59d7203c9e1a44cf0484df98e581a',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-02-22 22:27:23