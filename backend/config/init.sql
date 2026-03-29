# ************************************************************
# Sequel Ace SQL dump
# 版本号： 20062
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主机: 127.0.0.1 (MySQL 8.1.0)
# 数据库: wechat_mini_program
# 生成时间: 2026-03-29 11:59:05 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# 转储表 admin_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `admin_users`;

CREATE TABLE `admin_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;

INSERT INTO `admin_users` (`id`, `username`, `password`, `created_at`)
VALUES
	(1,'admin','password','2026-03-18 13:54:35');

/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 articles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `articles`;

CREATE TABLE `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `article_type` enum('case','qa') NOT NULL,
  `publish_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `view_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;

INSERT INTO `articles` (`id`, `title`, `content`, `image_url`, `article_type`, `publish_date`, `view_count`, `created_at`, `updated_at`)
VALUES
	(1,'案例分享｜江苏妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774001290077-748466310.png','case','2026-03-20 10:08:10',13,'2026-03-24 13:07:08','2026-03-24 13:07:08'),
	(2,'案例分享｜山东妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774002634681-341129020.jpg','case','2026-03-20 10:30:00',1,'2026-03-24 13:07:08','2026-03-24 13:07:08'),
	(3,'案例分享｜山西妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774002737964-639251173.jpg','case','2026-03-20 10:32:00',3,'2026-03-24 13:07:08','2026-03-24 13:07:08'),
	(4,'案例分享｜湖南妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774004293247-186745539.jpg','case','2026-03-20 18:58:13',13,'2026-03-24 13:07:08','2026-03-24 13:07:08'),
	(5,'案例分享｜河南妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774180479465-268667060.jpg','case','2026-03-22 19:54:40',2,'2026-03-24 13:07:08','2026-03-25 14:50:22'),
	(6,'案例分享｜湖北妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774180498640-26927563.jpg','case','2026-03-22 19:54:59',0,'2026-03-24 13:07:08','2026-03-24 13:07:08'),
	(7,'案例分享｜河北妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774180513474-479316738.jpg','case','2026-03-22 19:55:13',1,'2026-03-24 13:07:08','2026-03-27 10:58:35'),
	(8,'案例分享｜北京妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774180530297-116393492.jpg','case','2026-03-22 19:55:30',0,'2026-03-24 13:07:08','2026-03-24 13:07:08'),
	(9,'案例分享｜辽宁妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774180543419-514603483.jpg','case','2026-03-22 19:55:43',3,'2026-03-24 13:07:08','2026-03-24 14:00:43'),
	(10,'案例分享｜温州妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2. Do you have xxx\\n3. Do you sdfjkaljfa\\n4. Have you xxxx\\n\\n\"},{\"insert\":{\"image\":\"http://localhost:3000/uploads/file-1774269082579-175770537.jpg\"}},{\"insert\":\"\\n\"}]}','/uploads/file-1774180557202-547861585.jpg','case','2026-03-22 21:25:35',14,'2026-03-24 13:07:08','2026-03-24 13:07:08'),
	(11,'案例分享｜浙江妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：2\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774180913775-920153605.jpg','case','2026-03-23 20:17:21',27,'2026-03-24 13:07:08','2026-03-29 11:42:24'),
	(31,'Q&A ｜重匹相关','{\"ops\":[{\"attributes\":{\"color\":\"#66a3e0\",\"underline\":true},\"insert\":\"什么是重匹？\"},{\"attributes\":{\"header\":2},\"insert\":\"\\n\"},{\"insert\":\"\\n首先，给第一次知道“重匹”的伙伴们科普一下重匹的定义：\\n互惠生落地美国后，在和家庭相处过程中，家庭因为互惠生没有达到期待或者双方认为性格等方面不适合，在\"},{\"attributes\":{\"color\":\"#09408e\",\"link\":\"https://zhida.zhihu.com/search?content_id=109295186&content_type=Article&match_order=1&q=%E7%BE%8E%E5%9B%BD%E7%A4%BE%E5%8C%BA&zhida_source=entity\"},\"insert\":\"美国社区\"},{\"insert\":\"代表（community counselor），家庭以及互惠生三方协调商量下达成一致决定，进行第二次匹配。\\n根据互惠生项目的官方规定，互惠生有重匹的机会但重匹的时间只有2周，如果在规定的2周内没有找到适合的家庭，需要提前结束项目回国，而且回国的机票是由学生个人来承担的。尽管APiA对于重匹的次数是没有限定的，但是友情建议伙伴们不要多次重匹，因为这会让家庭留下不好的印象，对于重匹造成不好的结果。\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\",\"underline\":true},\"insert\":\"常见重匹或被重匹因素\"},{\"attributes\":{\"header\":2},\"insert\":\"\\n\"},{\"insert\":\"\\n说了那么多，有必要给大家介绍一下造成重匹或被重匹的常见因素，大家可以提前避免陷入需要重匹的窘境。\\n1.驾驶达不到家庭的需求（85%的被重匹的原因）\\n2.缺乏安全意识\\n3.不懂如何管孩子\\n4.家庭没有履行项目规定的义务\\n5.不擅长沟通，屡次造成误解\\n6.说谎&造假\\n7.酒驾\\n8.没有遵守家庭提出的规则\\n9.家庭临时退出项目，不需要互惠生了\\n\"}]}','/uploads/file-1774358422275-817150219.jpg','qa','2026-03-24 21:20:22',9,'2026-03-24 13:20:22','2026-03-27 08:24:56');

/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 carousel_images
# ------------------------------------------------------------

DROP TABLE IF EXISTS `carousel_images`;

CREATE TABLE `carousel_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `order_num` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `content` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `carousel_images` WRITE;
/*!40000 ALTER TABLE `carousel_images` DISABLE KEYS */;

INSERT INTO `carousel_images` (`id`, `image_url`, `title`, `order_num`, `created_at`, `updated_at`, `content`)
VALUES
	(2,'/uploads/file-1774002694034-962117135.jpg','car2',2,'2026-03-20 09:13:15','2026-03-24 13:43:36','{\"ops\":[{\"insert\":\"car 2\\n\"}]}'),
	(3,'/uploads/file-1774002710476-831798790.jpg','car1',1,'2026-03-20 09:44:45','2026-03-24 13:43:25','car2'),
	(4,'/uploads/file-1774002678056-869392630.jpg','car3',3,'2026-03-20 09:48:50','2026-03-24 13:43:44','{\"ops\":[{\"insert\":\"car3\\n\"}]}');

/*!40000 ALTER TABLE `carousel_images` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 case_studies
# ------------------------------------------------------------

DROP TABLE IF EXISTS `case_studies`;

CREATE TABLE `case_studies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text,
  `image_url` varchar(255) DEFAULT NULL,
  `publish_date` datetime DEFAULT NULL,
  `view_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `like_count` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `case_studies` WRITE;
/*!40000 ALTER TABLE `case_studies` DISABLE KEYS */;

INSERT INTO `case_studies` (`id`, `title`, `content`, `image_url`, `publish_date`, `view_count`, `created_at`, `updated_at`, `like_count`)
VALUES
	(1,'案例分享｜江苏妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774001290077-748466310.png','2026-03-20 10:08:10',13,'2026-03-20 10:08:10','2026-03-23 12:13:11',0),
	(2,'案例分享｜山东妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774002634681-341129020.jpg','2026-03-20 10:30:00',1,'2026-03-20 10:30:34','2026-03-23 12:13:02',0),
	(3,'案例分享｜山西妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774002737964-639251173.jpg','2026-03-20 10:32:00',3,'2026-03-20 10:32:18','2026-03-23 12:12:51',0),
	(4,'案例分享｜湖南妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774004293247-186745539.jpg','2026-03-20 18:58:13',13,'2026-03-20 10:58:13','2026-03-23 12:12:42',0),
	(5,'案例分享｜河南妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774180479465-268667060.jpg','2026-03-22 19:54:40',0,'2026-03-22 11:54:39','2026-03-23 12:12:32',0),
	(6,'案例分享｜湖北妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774180498640-26927563.jpg','2026-03-22 19:54:59',0,'2026-03-22 11:54:58','2026-03-23 12:12:22',0),
	(7,'案例分享｜河北妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774180513474-479316738.jpg','2026-03-22 19:55:13',0,'2026-03-22 11:55:13','2026-03-23 12:12:15',0),
	(8,'案例分享｜北京妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774180530297-116393492.jpg','2026-03-22 19:55:30',0,'2026-03-22 11:55:30','2026-03-23 12:12:05',0),
	(9,'案例分享｜辽宁妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774180543419-514603483.jpg','2026-03-22 19:55:43',1,'2026-03-22 11:55:43','2026-03-23 12:14:05',0),
	(10,'案例分享｜温州妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：1\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2. Do you have xxx\\n3. Do you sdfjkaljfa\\n4. Have you xxxx\\n\\n\"},{\"insert\":{\"image\":\"http://localhost:3000/uploads/file-1774269082579-175770537.jpg\"}},{\"insert\":\"\\n\"}]}','/uploads/file-1774180557202-547861585.jpg','2026-03-22 21:25:35',14,'2026-03-22 11:55:57','2026-03-23 13:25:50',0),
	(11,'案例分享｜浙江妹子，财政学专业，待业，250美金','{\"ops\":[{\"insert\":\"✅ \"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"王姐妹的基本情况\"},{\"insert\":\"\\n02年的浙江妹子，24年6月毕业，财政教学专业，毕业后做税务助理，现在待业，去过日本、新加坡\\n\\n匹配家庭情况：N/Y 一个孩子\\n面签领管：北京领管\\n签证次数：2\\n签证加分点：英语好\\n出发时间：26年3月21日\\n\\n\\n\"},{\"attributes\":{\"color\":\"#66a3e0\"},\"insert\":\"面签经过｜北京领管\"},{\"insert\":\"\\n\\n1. Do you want to xxxx\\n2.  Do you have xxx\\n3.  Do you sdfjkaljfa\\n4.  Have you xxxx\\n\"}]}','/uploads/file-1774180913775-920153605.jpg','2026-03-23 20:17:21',11,'2026-03-22 12:01:53','2026-03-24 12:23:39',0);

/*!40000 ALTER TABLE `case_studies` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 contact_submissions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `contact_submissions`;

CREATE TABLE `contact_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `birthday` varchar(20) DEFAULT NULL,
  `intended_programs` varchar(255) DEFAULT NULL,
  `other_project` varchar(255) DEFAULT NULL,
  `highest_education` varchar(100) DEFAULT NULL,
  `conditions` varchar(255) DEFAULT NULL,
  `english_level` varchar(50) DEFAULT NULL,
  `english_score` varchar(100) DEFAULT NULL,
  `childcare_exp` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `contact` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `contact_submissions` WRITE;
/*!40000 ALTER TABLE `contact_submissions` DISABLE KEYS */;

INSERT INTO `contact_submissions` (`id`, `name`, `birthday`, `intended_programs`, `other_project`, `highest_education`, `conditions`, `english_level`, `english_score`, `childcare_exp`, `city`, `contact`, `created_at`)
VALUES
	(1,'1','2026-03-27','互惠澳洲,互惠美国','','高中毕业','无犯罪记录,未婚未育','有语言成绩','222','是','555','6666','2026-03-27 13:06:00'),
	(2,'aa','2026-03-27','澳洲WHV工作','','本科','无犯罪记录','无语言成绩','','否','123','444','2026-03-27 13:27:46'),
	(3,'2','2026-03-27','互惠澳洲,澳洲WHV工作','','研究生或以上','未婚未育','无语言成绩','','否','大力','44','2026-03-27 13:34:23'),
	(4,'55','2026-03-27','互惠澳洲','','研究生或以上','未婚未育','无语言成绩','','否','66','77','2026-03-27 13:39:07'),
	(5,'55','2026-03-27','互惠美国,澳洲WHV工作','','大专','未婚未育,无犯罪记录','无语言成绩','','否','66','777','2026-03-27 13:54:32'),
	(6,'33','2026-03-27','互惠澳洲,互惠美国','','研究生或以上','未婚未育','无语言成绩','','否','55','66','2026-03-27 14:01:54'),
	(7,'666','2026-03-27','互惠美国,互惠澳洲,美国Camp','','研究生或以上','近五年内无心理疾病/手术史,未婚未育,无犯罪记录','无语言成绩','','否','77','777','2026-03-27 14:21:51'),
	(8,'33','2026-03-27','互惠美国,澳洲WHV工作,互惠澳洲','','高中毕业','无犯罪记录','无语言成绩','','是','44','44','2026-03-27 14:28:23'),
	(9,'344','2026-03-27','互惠美国','','研究生或以上','无犯罪记录','无语言成绩','','是','4','4','2026-03-27 14:30:25'),
	(10,'123','2026-03-27','互惠澳洲','','研究生或以上','无犯罪记录','无语言成绩','','否','2','2','2026-03-27 14:35:06'),
	(11,'123','2026-03-27','互惠美国','','研究生或以上','未婚未育','无语言成绩','','否','123','123','2026-03-27 14:36:56'),
	(12,'1','2026-03-27','澳洲WHV工作,澳洲WHV工作,互惠澳洲','','研究生或以上','无犯罪记录','无语言成绩','','否','1','1','2026-03-27 14:43:46'),
	(13,'213','2026-03-29','互惠澳洲','','本科','无犯罪记录','有语言成绩','四级 555','是','444','555','2026-03-29 11:42:57'),
	(14,'555','2026-03-29','互惠澳洲,澳洲WHV工作,互惠美国','','研究生或以上','无犯罪记录','有语言成绩','999','否','0999','999','2026-03-29 11:53:01');

/*!40000 ALTER TABLE `contact_submissions` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 qa_articles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `qa_articles`;

CREATE TABLE `qa_articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text,
  `image_url` varchar(255) DEFAULT NULL,
  `publish_date` datetime DEFAULT NULL,
  `view_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
