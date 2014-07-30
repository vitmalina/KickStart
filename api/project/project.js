/**
*  General Project APIs
*/

module.exports = { 
    '/api/project/list': function (req, res, next) {
        var sql ='\
            SELECT \
                master.projectid, \
                master.proj_name, \
                master.proj_status, \
                master.current_mstoneid, \
                TO_CHAR(master.date_due, \'yyyy/mm/dd\') as date_due, \
                TO_CHAR(master.date_started, \'yyyy/mm/dd\') as date_started, \
                customer.custid     as "customer.custid", \
                customer.first_name as "customer.first_name", \
                customer.last_name  as "customer.last_name", \
                customer.orgid      as "customer.orgid", \
                org.org_name        as "customer.org_name", \
                customer.job_title  as "customer.job_title", \
                customer.status     as "customer.status", \
                owner.userid        as "owner.userid", \
                owner.fname         as "owner.fname", \
                owner.lname         as "owner.lname\", \
                TO_CHAR(master.last_update, \'YYYY/MM/DD HH24:MI:SS TZ\') as last_update, \
                last_user.userid    as "last_user.userid", \
                last_user.fname     as "last_user.fname", \
                last_user.lname     as "last_user.lname" \
             FROM crm.projects master \
                 LEFT OUTER JOIN crm.customers customer ON (master.custid = customer.custid) \
                 LEFT OUTER JOIN crm.organizations org  ON (customer.orgid = org.orgid) \
                 LEFT OUTER JOIN public.sys_users owner ON (master.owner_userid = owner.userid) \
                 LEFT OUTER JOIN public.sys_users last_user ON (master.last_userid = last_user.userid) \
             WHERE deleted IS NULL \
                 AND '+ (req.data['status'] ? "proj_status = '"+ req.data['status'] +"' AND " : '') +' \
                 {{search}} \
             ORDER BY {{order}}';
        w2ui.getRecords(sql, req, res, { count: true });
    },

    '/api/project/save': function (req, res, next) {
        var rec  = req.data.record;
        var data = {
            recid  : req.data.recid,
            record : {
                proj_name     : rec.proj_name,
                date_due      : rec.date_due,
                owner_userid  : rec.owner_userid[0].id,
                custid        : rec.custid ? rec.custid[0].cutid : null,
                last_userid   : req.session.user.userid,
                last_update   : '__now()'        
            }
        };
        w2ui.saveRecord(data, 'crm.projects', 'projectid', req, res);
    },

    '/api/project/delete': function (req, res, next) {
        // SOFT DELETE
        var sel = req.data.selected;
        for (var s in sel) {
            var data = {
                recid  : sel[s],
                record : {    deleted : true }
            };
            w2ui.saveRecord(data, 'crm.projects', 'projectid', req, res);
        }
    }
}