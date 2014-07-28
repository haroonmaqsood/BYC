-- Create syntax for TABLE 'picture'
CREATE TABLE `picture` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `picture` varchar(255) NOT NULL DEFAULT '',
  `q1` int(11) DEFAULT NULL COMMENT 'How much did it cost roughly?',
  `q2` int(11) DEFAULT NULL COMMENT 'What type of hair do you have?',
  `q3` int(11) DEFAULT NULL COMMENT 'Hair colour?',
  `q4` int(11) DEFAULT NULL COMMENT 'Salon location?',
  `createdDttm` datetime NOT NULL,
  `updatedDttm` datetime DEFAULT NULL,
  `deletedDttm` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'test'
CREATE TABLE `test` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'users'
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL DEFAULT '',
  `email` varchar(200) NOT NULL DEFAULT '',
  `password` varchar(150) NOT NULL DEFAULT '',
  `fullName` varchar(150) DEFAULT '',
  `picture` varchar(255) DEFAULT NULL,
  `steptwo` datetime DEFAULT NULL,
  `q1` varchar(255) DEFAULT NULL COMMENT 'When did you last cut your hair?',
  `q2` varchar(255) DEFAULT NULL COMMENT 'How much did it cost?',
  `q3` varchar(255) DEFAULT NULL COMMENT 'What is your favourite hairstyle?',
  `q4` varchar(255) DEFAULT NULL COMMENT 'What type of hair do you have?',
  `q5` varchar(255) DEFAULT NULL COMMENT 'Current hair colour?',
  `q6` varchar(255) DEFAULT '' COMMENT 'Current salon location?',
  `q7` varchar(255) DEFAULT NULL COMMENT 'How often do you cut?',
  `ip` varchar(50) NOT NULL DEFAULT '',
  `agent` text NOT NULL,
  `token` varchar(50) NOT NULL DEFAULT '',
  `createdDttm` datetime NOT NULL,
  `updatedDttm` datetime DEFAULT NULL,
  `deletedDttm` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;