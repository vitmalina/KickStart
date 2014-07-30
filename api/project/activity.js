/**
*  Project Activities APIs
*/

module.exports = { 

    '/api/project/:id/activity/list': function (req, res, next) {
        var projid = req.biport.params.id;
        var sql = 'SELECT \
                master.activityid, \
                TO_CHAR(master.activity_date, \'YYYY/MM/DD\') as activity_date, \
                master.activity_desc, \
                master.activity_duration, \
                owner.userid    as "owner.userid", \
                owner.fname     as "owner.fname", \
                owner.lname     as "owner.lname", \
                TO_CHAR(master.last_update, \'YYYY/MM/DD HH24:MI:SS TZ\') as last_update, \
                last_user.userid    as "last_user.userid", \
                last_user.fname     as "last_user.fname", \
                last_user.lname     as "last_user.lname" \
             FROM crm.proj_activities master \
                LEFT OUTER JOIN sys_users owner USING (userid) \
                LEFT OUTER JOIN sys_users last_user ON last_user.userid = master.last_userid \
             WHERE projectid = '+ projid +' AND {{search}} \
             ORDER BY {{sort}}';
        w2ui.getRecords(sql, req, res, { count: true });
    },

    '/api/project/:id/activity/save': function (req, res, next) {
        var projid = req.biport.params.id;
        var rec  = req.data.record;
        var data = {
            recid  : req.data.recid,
            record : {
                projectid          : projid,
                userid             : rec.userid[0].id,
                activity_desc      : rec.activity_desc,
                activity_duration  : rec.activity_duration,
                activity_date      : rec.activity_date,
                last_userid        : req.session.user.userid,
                last_update        : '__now()'        
            }
        };
        w2ui.saveRecord(data, 'crm.proj_activities', 'activityid', req, res);
    },

    '/api/project/:id/activity/delete': function (req, res, next) {
        var projid = req.biport.params.id;
        w2ui.deleteRecords('crm.proj_activities', 'projectid = '+ projid +' AND activityid', req, res);
    }
}