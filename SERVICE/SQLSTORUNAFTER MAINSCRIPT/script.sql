ALTER TABLE likes CHANGE picture_id set_id int(11) NOT NULL;
INSERT INTO LIKES(SET_ID) SELECT ID FROM SETS WHERE 1=1;

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

ALTER TABLE notifications ADD seenDttm datetime DEFAULT NULL AFTER type_id;


insert into sets (featured) select id from picture  where 1=1