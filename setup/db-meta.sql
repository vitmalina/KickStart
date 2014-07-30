/* PostgreSQL version */

CREATE TABLE users (
  userid BIGSERIAL,
  fname varchar(50),
  lname varchar(50),
  pref_name varchar(100),
  email varchar(75),
  email_alt varchar(75),
  phone varchar(75),
  phone_alt varchar(75),
  im varchar(75),
  im_alt varchar(75),
  address varchar(500),
  login varchar(32) NOT NULL,
  pass varchar(32) NOT NULL,
  manager_userid bigint,
  expires date DEFAULT NULL,
  super bool DEFAULT false,
  hidden bool DEFAULT false,
  deleted bool DEFAULT false,
  tmp_pass varchar(32),
  tmp_pass_expires timestamp,
  notes text,
  photo text,
  last_userid bigint,
  last_update timestamp,
  PRIMARY KEY (userid)
) WITH OIDS;
ALTER TABLE users ADD CONSTRAINT login_unique UNIQUE(login);
ALTER TABLE users ADD CONSTRAINT manager_userid FOREIGN KEY (manager_userid) REFERENCES users(userid) ON DELETE No Action ON UPDATE No Action;

CREATE TABLE groups (
  groupid BIGSERIAL,
  group_name varchar(100) NOT NULL,
  group_desc text,
  owner_userid BIGINT,
  closed bool DEFAULT false,
  published bool DEFAULT false,
  last_userid BIGINT NOT NULL,
  last_update timestamp,
  PRIMARY KEY (groupid)
) WITH OIDS;
ALTER TABLE groups ADD CONSTRAINT groups_name_unique UNIQUE(group_name);
ALTER TABLE groups ADD CONSTRAINT groups_admin_userid FOREIGN KEY (owner_userid) REFERENCES users(userid) ON DELETE RESTRICT ON UPDATE No Action;

CREATE TABLE roles (
  roleid BIGSERIAL,
  role_name varchar(100) NOT NULL,
  role_desc text,
  last_userid BIGINT,
  last_update timestamp,
  PRIMARY KEY (roleid)
) WITH OIDS;
ALTER TABLE roles ADD CONSTRAINT role_name_unique UNIQUE(role_name);

CREATE TABLE role_services (
  permid BIGSERIAL,
  roleid BIGINT NOT NULL,
  module varchar(100) not null,
  service varchar(2000) not null,
  last_userid BIGINT,
  last_update timestamp,
  PRIMARY KEY (permid)
) WITH OIDS;
ALTER TABLE role_services ADD CONSTRAINT role_service_unique UNIQUE(roleid, service);

CREATE TABLE user_groups (
  ugid BIGSERIAL,
  userid BIGINT NOT NULL,
  groupid BIGINT NOT NULL,
  last_userid bigint,
  last_update timestamp,
  PRIMARY KEY (ugid)
) WITH OIDS;
ALTER TABLE user_groups ADD CONSTRAINT groups_one_user_per_group UNIQUE(groupid, userid);
ALTER TABLE user_groups ADD CONSTRAINT ug_userid FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE ON UPDATE No Action;
ALTER TABLE user_groups ADD CONSTRAINT ug_groupid FOREIGN KEY (groupid) REFERENCES groups(groupid) ON DELETE CASCADE ON UPDATE No Action;

CREATE TABLE user_roles (
  urid BIGSERIAL,
  userid BIGINT NOT NULL,
  roleid BIGINT NOT NULL,
  scope varchar(100),
  last_userid bigint,
  last_update timestamp,
  PRIMARY KEY (urid)
) WITH OIDS;
ALTER TABLE user_roles ADD CONSTRAINT ur_userid FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE ON UPDATE No Action;
ALTER TABLE user_roles ADD CONSTRAINT ur_roleid FOREIGN KEY (roleid) REFERENCES roles(roleid) ON DELETE CASCADE ON UPDATE No Action;