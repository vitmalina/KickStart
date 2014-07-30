INSERT INTO users(userid, fname, lname, email, login, pass, super, hidden, deleted, last_userid, last_update)
VALUES (1, 'admin', 'admin', '', 'admin', md5('admin'), true, false, false, 1, now());
