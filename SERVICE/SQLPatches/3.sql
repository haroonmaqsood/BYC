ALTER TABLE picture ADD title varchar(80) NULL AFTER picture;
ALTER TABLE picture ADD slug varchar(80) NOT NULL AFTER title;