/**
*  Admin: Users APIs
*/

module.exports = {

    '/api/users': function (req, res, next) {
        // prepend search fields with MST.
        w2ui.prependSearch(req.data.search, 'MST.');
        
        var sql = 'SELECT \
                MST.userid, \
                MST.fname, \
                MST.lname, \
                MST.email, \
                MST.email_alt, \
                MST.phone, \
                MST.phone_alt, \
                MST.im, \
                MST.im_alt, \
                MST.address, \
                MST.notes, \
                MST.login, \
                MST.manager_userid, \
                TO_CHAR(MST.expires, \'mm/dd/yyyy\') as "expires", \
                MST.super, \
                MST.last_userid, \
                TO_CHAR(MST.last_update, \'mm/dd/yyyy hh:mi pm\') as "last_update", \
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
             FROM users MST\
                LEFT OUTER JOIN users MANAGER ON MST.manager_userid = MANAGER.userid \
                LEFT OUTER JOIN users LAST_USER ON MST.last_userid = LAST_USER.userid \
             WHERE MST.deleted != TRUE AND MST.hidden != TRUE AND ({{search}}) \
             ORDER BY {{sort}}';
        w2ui.getRecords(sql, req, res, { count: true });
    },

    '/api/user/:id/photo': function (req, res, next) {
        var userid = req.info.route.id
        var sql = 'SELECT photo FROM users \
                   WHERE userid = ' + userid;
        w2db.exec(sql, function (err, result) {
            var photo = '';
            if (err || result.count == 0 || !result.records[0].photo) {
                photo = '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';
            } else {
                photo = result.records[0].photo;
                photo = photo.substr(photo.indexOf(',') + 1);
            }
            res.header('Content-Type', 'image/jpg');
            res.send(new Buffer(photo, 'base64'));
        });
    },

    '/api/groups': function (req, res, next) {
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

    '/api/group/:id/members': function (req, res, next) {
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
                INNER JOIN groups MSTG ON GRP.groupid = MSTG.groupid \
                LEFT OUTER JOIN users MANAGER ON MST.manager_userid = MANAGER.userid \
                LEFT OUTER JOIN users LAST_USER ON GRP.last_userid = LAST_USER.userid \
             WHERE MST.deleted != TRUE AND MST.hidden != TRUE \
                AND GRP.groupid = '+ groupid +' \
                AND MSTG.published = true\
                AND ({{search}}) \
             ORDER BY {{sort}}';
        w2ui.getRecords(sql, req, res, { count: true });
    },    

    '/api/group/:id/join': function (req, res, next) {
        var groupid = req.info.route.id;
        var sql = 'SELECT groupid, published, closed, \
                    (SELECT count(1)  FROM user_groups WHERE groupid = '+ groupid + ' AND userid = '+ req.session.user.userid + ') as isMember \
                   FROM groups \
                   WHERE groupid = ' + groupid;
        w2db.exec(sql, function (err, result) {
            if (err) {
                res.send({ status: 'error', message: 'DB Error: '+ err });
                return;
            }
            var msg = '';
            if (result.count == 0 || result.records.length == 0) msg = 'DB Error';
            if (result.records[0].closed) msg = 'You cannot join a closed group';
            if (result.records[0].ismember != '0') msg = 'You already a member of this group';
            if (msg != '') {
                res.send({
                    "status"    : 'error',
                    "message"   : msg
                });                  
                return;              
            } else {
                // insert new users
                var sql = 'INSERT INTO user_groups(groupid, userid, last_userid, last_update) \
                           VALUES ('+ groupid +', '+ req.session.user.userid +', '+ req.session.user.userid +', now())';
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
            }
        });
    },

    '/api/group/:id/leave': function (req, res, next) {
        var groupid = req.info.route.id;
        // prepare sql
        var sql = 'DELETE FROM user_groups WHERE groupid = '+ groupid +' AND userid = '+ req.session.user.userid;
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