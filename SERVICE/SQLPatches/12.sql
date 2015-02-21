ALTER TABLE comments CHANGE picture_id set_id int(11) DEFAULT NULL;
ALTER TABLE likes CHANGE picture_id set_id int(11) NOT NULL;
