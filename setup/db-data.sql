INSERT INTO users(userid, fname, lname, email, login, pass, super, hidden, deleted, last_userid, last_update)
VALUES (1, 'Admin', 'Admin', '', 'admin', md5('admin'), true, false, false, 1, now());
