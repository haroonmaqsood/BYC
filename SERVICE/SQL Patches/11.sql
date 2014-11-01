ALTER TABLE picture DROP picture, DROP crop;
RENAME TABLE picture TO sets;

CREATE TABLE `pictures` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `set_id` int(11) NOT NULL,
  `picture` varchar(255) NOT NULL DEFAULT '',
  `crop` text,
  `position` varchar(5) NOT NULL,
  `createdDttm` datetime NOT NULL,
  `updatedDttm` datetime DEFAULT NULL,
  `deletedDttm` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=latin1;