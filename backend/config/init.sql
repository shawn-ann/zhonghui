
# 转储表 home_menus
# ------------------------------------------------------------

DROP TABLE IF EXISTS `home_menus`;

CREATE TABLE `home_menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `icon_url` varchar(255) DEFAULT NULL,
  `content` text,
  `order_num` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `home_menus` WRITE;
INSERT INTO `home_menus` (`id`, `title`, `icon_url`, `content`, `order_num`, `created_at`, `updated_at`)
VALUES
	(1,'互惠美国','/uploads/menu-1.png','',1,'2026-04-01 10:00:00','2026-04-01 10:00:00'),
	(2,'澳洲whv','/uploads/menu-2.png','',2,'2026-04-01 10:00:00','2026-04-01 10:00:00'),
	(3,'美国营地','/uploads/menu-3.png','',3,'2026-04-01 10:00:00','2026-04-01 10:00:00'),
	(4,'我要咨询','/uploads/menu-4.png','',4,'2026-04-01 10:00:00','2026-04-01 10:00:00'),
	(5,'关于我们','/uploads/menu-5.png','',5,'2026-04-01 10:00:00','2026-04-01 10:00:00');
UNLOCK TABLES;

