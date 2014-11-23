CREATE TABLE `notifications` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `from_user_id` int(11) NOT NULL,
  `to_user_id` int(11) NOT NULL,
  `type` varchar(10) NOT NULL DEFAULT '',
  `type_id` int(11) NOT NULL,
  `createdDttm` datetime NOT NULL,
  `updatedDttm` datetime DEFAULT NULL,
  `deletedDttm` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;