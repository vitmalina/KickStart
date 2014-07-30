/**
*  Admin: Groups APIs
*/

module.exports = {

    '/api/admin/groups': function (req, res, next) {
        // prepend search fields with MST.
        w2ui.prependSearch(req.data.search, 'MST.');

        var sql = 'SELECT \
                MST.groupid, \
                MST.group_name, \
                MST.group_desc, \
                MST.closed, \
                MST.published, \
                MST.owner_userid, \
                MST.last_userid, \
                TO_CHAR(MST.last_update, \'mm/dd/yyyy hh:mi pm\') as "last_update", \
                OWNER.userid as "owner.userid", \
                OWNER.fname || \' \' || OWNER.lname as "owner.name", \
                OWNER.fname as "owner.fname", \
                OWNER.lname as "owner.lname", \
                OWNER.email as "owner.email", \
                OWNER.login as "owner.login", \
                OWNER.expires as "owner.expires", \
                OWNER.super as "owner.super", \
                LAST_USER.userid as "last_user.userid", \
                LAST_USER.fname || \' \' || LAST_USER.lname as "last_user.name", \
                LAST_USER.fname as "last_user.fname", \
                LAST_USER.lname as "last_user.lname" \
             FROM groups MST\
                LEFT OUTER JOIN users OWNER ON MST.owner_userid = OWNER.userid \
                LEFT OUTER JOIN users LAST_USER ON MST.last_userid = LAST_USER.userid \
             WHERE {{search}} \
             ORDER BY {{sort}}';
        w2ui.getRecords(sql, req, res, { count: true });
    },

    '/api/admin/groups/save': function (req, res, next) {
        // prepare and save
        var rec  = req.data.record;
        var data = {
            recid  : req.data.recid,
            record : {
                group_name      : rec.group_name,
                group_desc      : rec.group_desc,
                closed          : rec.closed,
                published       : rec.published,
                owner_userid    : (rec.owner && rec.owner.id ? rec.owner.id : null),
                last_userid     : req.session.user.userid,
                last_update     : '__now()'        
            }
        };
        w2ui.saveRecord(data, 'groups', 'groupid', req, res);        
    },

    '/api/admin/groups/delete': function (req, res, next) {
        w2ui.deleteRecords('groups', 'groupid', req, res);
    },

    '/api/admin/group/:id/members': function (req, res, next) {
        // prepend search fields with MST.
        w2ui.prependSearch(req.data.search, 'MST.');

        var groupid = req.info.route.id;
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
                GRP.last_userid, \
                TO_CHAR(GRP.last_update, \'mm/dd/yyyy hh:mi pm\') as "last_update", \
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
             FROM user_groups GRP \
                INNER JOIN users MST ON GRP.userid = MST.userid \
                LEFT OUTER JOIN users MANAGER ON MST.manager_userid = MANAGER.userid \
                LEFT OUTER JOIN users LAST_USER ON GRP.last_userid = LAST_USER.userid \
             WHERE MST.deleted != TRUE AND MST.hidden != TRUE \
                AND GRP.groupid = '+ groupid +' \
                AND ({{search}}) \
             ORDER BY {{sort}}';
        w2ui.getRecords(sql, req, res, { count: true });
    },    

    '/api/admin/group/:id/add': function (req, res, next) {
        var groupid = req.info.route.id;
        var users   = req.data.users;
        var sql = 'SELECT userid FROM user_groups WHERE groupid = '+ groupid + ' AND userid IN ('+ users + ')';
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
            var sql = 'INSERT INTO user_groups(groupid, userid, last_userid, last_update) VALUES ';
            for (var i in users) {
                sql += '('+ groupid +', '+ users[i] +', '+ req.session.user.userid +', now())';
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

    '/api/admin/group/:id/remove': function (req, res, next) {
        var groupid = req.info.route.id;
        var users   = req.data.users;
        // prepare sql
        var sql = 'DELETE FROM user_groups WHERE groupid = '+ groupid +' AND userid IN ('+ users +')';
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