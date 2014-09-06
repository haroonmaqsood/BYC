ALTER TABLE users ADD firstName varchar(50) NULL AFTER picture;
ALTER TABLE users ADD lastName varchar(50) NULL AFTER firstName;
ALTER TABLE users ADD hairType varchar(50) NULL AFTER lastName;
ALTER TABLE users ADD course varchar(255) NULL AFTER hairType;
ALTER TABLE users ADD lastSalon varchar(50) NULL AFTER course;
ALTER TABLE users ADD lastCutCost varchar(50) NULL AFTER lastSalon;