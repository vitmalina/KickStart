/**
*  Admin: Users APIs
*/

module.exports = {

    '/api/admin/users': function (req, res, next) {
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
                MST.tmp_pass, \
                TO_CHAR(MST.tmp_pass_expires, \'mm/dd/yyyy\') as "tmp_pass_expires", \
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

    '/api/admin/users/save': function (req, res, next) {
        var rec = req.data.record;
        var data   = {
            recid  : req.data.recid,
            record : {
                fname           : rec.fname,
                lname           : rec.lname,
                email           : rec.email,
                email_alt       : rec.email_alt,
                phone           : rec.phone,
                phone_alt       : rec.phone_alt,
                im              : rec.im,
                im_alt          : rec.im_alt,
                address         : rec.address,
                notes           : rec.notes,
                login           : rec.login,
                expires         : rec.expires,
                manager_userid  : (rec.manager && rec.manager.id ? rec.manager.id : null),
                super           : rec.super,
                last_userid     : req.session.user.userid,
                last_update     : '__now()'  
            }
        };        
        // generate password for new records
        if (data.recid == 0) data.record['pass'] = w2ui.randText(10);
        // save 
        w2ui.saveRecord(data, 'users', 'userid', req, res);        
    },

    '/api/admin/users/delete': function (req, res, next) {
        w2ui.softDelete('users', 'userid', req, res);
    }
};