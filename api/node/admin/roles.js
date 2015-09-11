/**
*  Admin: Roles APIs
*/

module.exports = {

    '/api/admin/roles': function (req, res, next) {
        // prepend search fields with MST.
        w2ui.prependSearch(req.data.search, 'MST.');

        var sql = 'SELECT \
                MST.roleid, \
                MST.role_name, \
                MST.role_desc, \
                MST.last_userid, \
                TO_CHAR(MST.last_update, \'mm/dd/yyyy hh:mi pm\') as "last_update", \
                LAST_USER.userid as "last_user.userid", \
                LAST_USER.fname || \' \' || LAST_USER.lname as "last_user.name", \
                LAST_USER.fname as "last_user.fname", \
                LAST_USER.lname as "last_user.lname" \
             FROM roles MST\
                LEFT OUTER JOIN users LAST_USER ON MST.last_userid = LAST_USER.userid \
             WHERE {{search}} \
             ORDER BY {{sort}}';
        w2ui.getRecords(sql, req, res, { count: true });
    },

    '/api/admin/roles/save': function (req, res, next) {
        // prepare and save
        var rec  = req.data.record;
        var data = {
            recid  : req.data.recid,
            record : {
                role_name    : rec.role_name,
                role_desc    : rec.role_desc,
                last_userid  : req.session.user.userid,
                last_update  : '__now()'        
            }
        };
        w2ui.saveRecord(data, 'roles', 'roleid', req, res);        
    },

    '/api/admin/roles/delete': function (req, res, next) {
        w2ui.deleteRecords('roles', 'roleid', req, res);
    },

    '/api/admin/role/:id/members': function (req, res, next) {        
        w2ui.prependSearch(req.data.search, 'MST.'); // prepend search fields with MST.
        var roleid = req.info.route.id;
        var sql = 'SELECT \
                MST.userid, \
                MST.fname, \
                MST.lname, \
                MST.email, \
                MST.login, \
                MST.manager_userid, \
                TO_CHAR(MST.expires, \'mm/dd/yyyy\') as "expires", \
                MST.super, \
                MST.tmp_pass, \
                TO_CHAR(MST.tmp_pass_expires, \'mm/dd/yyyy\') as "tmp_pass_expires", \
                ROL.last_userid, \
                TO_CHAR(ROL.last_update, \'mm/dd/yyyy hh:mi pm\') as "last_update", \
                MANAGER.userid as "manager.userid", \
                MANAGER.fname || \' \' || MANAGER.lname as "manager.name", \
                MANAGER.fname as "manager.fname", \
                MANAGER.lname as "manager.lname", \
                MANAGER.email as "manager.email", \
                MANAGER.login as "manager.login", \
                MANAGER.expires as "manager.expires", \
                MANAGER.super as "manager.super", \
                LAST_USER.userid as "last_user.userid", \
                LAST_USER.fname || \' \' || LAST_USER.lname as "last_user.name", \
                LAST_USER.fname as "last_user.fname", \
                LAST_USER.lname as "last_user.lname" \
             FROM user_roles ROL \
                INNER JOIN users MST ON ROL.userid = MST.userid \
                LEFT OUTER JOIN users MANAGER ON MST.manager_userid = MANAGER.userid \
                LEFT OUTER JOIN users LAST_USER ON ROL.last_userid = LAST_USER.userid \
             WHERE MST.deleted != TRUE AND MST.hidden != TRUE \
                AND ROL.roleid = '+ roleid +' \
                AND ({{search}}) \
             ORDER BY {{sort}}';
        w2ui.getRecords(sql, req, res, { count: true });
    },    

    '/api/admin/role/:id/add': function (req, res, next) {
        var roleid = req.info.route.id;
        var users  = req.data.users;
        // only add new
        var sql = 'SELECT userid FROM user_roles WHERE roleid = '+ roleid + ' AND userid IN ('+ users +')';
        w2db.exec(sql, function (err, result) {
            if (err) {
                res.send({ status: 'error', message: 'DB Error: '+ err });
                return;
            }
            // filter out users already in the group
            for (var r in result.records) {
                var ind = users.indexOf(result.records[r].userid);
                if (ind != -1) users.splice(ind, 1);
            }
            if (users.length == 0) {
                // process records
                res.send({
                    "status"    : 'success',
                    "effected"  : 0
                });
                return;         
            }
            // insert new users
            var sql = 'INSERT INTO user_roles(roleid, userid, last_userid, last_update) VALUES ';
            for (var i in users) {
                sql += '('+ roleid +', '+ users[i] +', '+ req.session.user.userid +', now())';
                if (i < users.length -1) sql += ', ';
            }
            w2db.exec(sql, function (err, result) {
                if (err) {
                    res.send({ status: 'error', message: 'DB Error: '+ err });
                    return;
                }
                // process records
                res.send({
                    "status"    : 'success',
                    "effected"  : result.count
                });
            });
        });
    },

    '/api/admin/role/:id/remove': function (req, res, next) {
        var roleid = req.info.route.id;
        var users  = req.data.users;
        // prepare sql
        var sql = 'DELETE FROM user_roles WHERE roleid = '+ roleid +' AND userid IN ('+ users +')';
        w2db.exec(sql, function (err, result) {
            if (err) {
                res.send({
                    status  : 'error',
                    message : 'DB Error: '+ err
                });
            } else {
                // process records
                res.send({
                    "status"    : 'success',
                    "effected"  : result.count
                });
            }
        });
    },

    '/api/admin/role/:id/services': function (req, res, next) {        
        w2ui.prependSearch(req.data.search, 'MST.'); // prepend search fields with MST.
        var roleid = req.info.route.id;
        var sql = 'SELECT \
                MST.permid, \
                MST.module, \
                MST.service, \
                MST.last_userid, \
                TO_CHAR(MST.last_update, \'mm/dd/yyyy hh:mi pm\') as "last_update", \
                LAST_USER.userid as "last_user.userid", \
                LAST_USER.fname || \' \' || LAST_USER.lname as "last_user.name", \
                LAST_USER.fname as "last_user.fname", \
                LAST_USER.lname as "last_user.lname" \
             FROM role_services MST \
                LEFT OUTER JOIN users LAST_USER ON MST.last_userid = LAST_USER.userid \
             WHERE MST.roleid = '+ roleid +' \
                AND ({{search}}) \
             ORDER BY {{sort}}';
        w2ui.getRecords(sql, req, res, { count: true });
    },

    '/api/admin/role/:id/grant': function (req, res, next) {
        var roleid   = req.info.route.id;
        var services = req.data.services;
        var servDSP  = [];
        for (var s in services) servDSP.push("'" + services[s].replace(/'/g, "\\'") + "'");
        // only add new
        var sql = 'SELECT service FROM role_services WHERE roleid = '+ roleid +' AND service IN ('+ servDSP +')';
        w2db.exec(sql, function (err, result) {
            if (err) {
                res.send({ status: 'error', message: 'DB Error: '+ err });
                return;
            }
            // filter out services already in the role
            for (var r in result.records) {
                var ind = services.indexOf(result.records[r].service);
                if (ind != -1) services.splice(ind, 1);
            }
            if (services.length == 0) {
                // process records
                res.send({
                    "status"    : 'success',
                    "effected"  : 0
                });
                return;         
            }
            // insert new services
            var sql = 'INSERT INTO role_services(roleid, module, service, last_userid, last_update) VALUES ';
            for (var i in services) {
                var tmp = security.findService(services[i].replace(/\'/g, ''));
                if (!tmp) continue;
                sql += '('+ roleid +', \'' + tmp.module.replace(/'/g, "\\'") + '\', \''+ services[i].replace(/'/g, "\\'") +'\', '+ req.session.user.userid +', now())';
                if (i < services.length -1) sql += ', ';
            }
            w2db.exec(sql, function (err, result) {
                if (err) {
                    res.send({ status: 'error', message: 'DB Error: '+ err });
                    return;
                }
                // process records
                res.send({
                    "status"    : 'success',
                    "effected"  : result.count
                });
            });
        });
    }, 

    '/api/admin/role/:id/revoke': function (req, res, next) {
        var roleid   = req.info.route.id;
        var services = req.data.services;
        for (var s in services) services[s] = "'" + services[s].replace(/'/g, "\\'") + "'";
        var sql = 'DELETE FROM role_services WHERE roleid = '+ roleid +' AND service IN ('+ services +')';
        // prepare sql
        w2db.exec(sql, function (err, result) {
            if (err) {
                res.send({
                    status  : 'error',
                    message : 'DB Error: '+ err
                });
            } else {
                // process records
                res.send({
                    "status"    : 'success',
                    "effected"  : result.count
                });
            }
        });
    }           
};