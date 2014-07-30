/**
*  General Human Resources APIs
*/

module.exports = { 
    
    '/api/hr/timesheet/list': function (req, res, next) {
        var userid = req.session.user.userid;
        // prepend search fields with MST.
        w2ui.prependSearch(req.data.search, 'MST.'); 
        var sql = 'SELECT \
                MST.tsid, \
                MST.description, \
                TO_CHAR(MST.start_date, \'mm/dd/yyyy\') as "start_date", \
                TO_CHAR(MST.end_date, \'mm/dd/yyyy\') as "end_date", \
                EXTRACT(WEEK FROM MST.start_date + interval \'1 day\') as "weeknum", \
                MST.status, \
                MST.hours, \
                SUBMITTER.userid as "submitter.userid", \
                SUBMITTER.fname || \' \' || SUBMITTER.lname as "submitter.name", \
                SUBMITTER.fname as "submitter.fname", \
                SUBMITTER.lname as "submitter.lname", \
                SUBMITTER.email as "submitter.email", \
                MST.last_userid, \
                TO_CHAR(MST.last_update, \'mm/dd/yyyy hh:mi pm\') as "last_update", \
                LAST_USER.userid as "last_user.userid", \
                LAST_USER.fname || \' \' || LAST_USER.lname as "last_user.name", \
                LAST_USER.fname as "last_user.fname", \
                LAST_USER.lname as "last_user.lname" \
             FROM hr.timesheets MST\
                LEFT OUTER JOIN users SUBMITTER ON MST.userid = SUBMITTER.userid \
                LEFT OUTER JOIN users LAST_USER ON MST.last_userid = LAST_USER.userid \
             WHERE MST.userid = '+ userid + ' AND ({{search}}) \
             ORDER BY {{sort}}';
        w2ui.getRecords(sql, req, res, { count: true });
    },

    '/api/hr/timesheet/:id/details': function (req, res, next) {
        var userid = req.session.user.userid;
        var tsid   = req.biport.params.id;
        // prepend search fields with MST.
        w2ui.prependSearch(req.data.search, 'MST.'); 
        var sql = 'SELECT \
                MST.tsdtlid, \
                MST.hours_sun, \
                MST.hours_mon, \
                MST.hours_tue, \
                MST.hours_wed, \
                MST.hours_thu, \
                MST.hours_fri, \
                MST.hours_sat, \
                MST.hours_sat, \
                PAR.description as "timesheet.description", \
                TO_CHAR(PAR.start_date, \'mm/dd/yyyy\') as "timesheet.start_date", \
                TO_CHAR(PAR.end_date, \'mm/dd/yyyy\') as "timesheet.end_date", \
                EXTRACT(WEEK FROM PAR.end_date) as "timesheet.weeknum", \
                PAR.status as "timesheet.status", \
                PAR.hours as "timesheet.hours", \
                PRJ.projectid as "project.projectid", \
                PRJ.project_name as "project.project_name" \
             FROM hr.timesheet_dtl MST\
                INNER JOIN hr.timesheets PAR ON MST.tsid = PAR.tsid \
                LEFT OUTER JOIN project.projects PRJ ON MST.projectid = PRJ.projectid \
             WHERE PAR.userid = '+ userid + ' AND MST.tsid = '+ tsid + ' AND ({{search}}) \
             ORDER BY {{sort}}';
        w2ui.getRecords(sql, req, res, { count: true, master: "timesheet" });
    },

    '/api/hr/timesheet/save': function (req, res, next) {
        var rec     = req.data.record;
        var details = req.data.details;
        var data = {
            recid  : req.data.recid,
            record : {
                description   : rec.description,
                start_date    : rec.start_date,
                end_date      : rec.end_date,
                userid        : rec.userid,
                status        : rec.status,
                hours         : rec.hours,
                last_userid   : req.session.user.userid,
                last_update   : '__now()'        
            }
        };
        w2ui.saveRecord(data, 'hr.timesheets', 'tsid', req, res, function (recid) {
            // saving details
            var sql = 'DELETE FROM hr.timesheet_dtl WHERE tsid = '+ recid +';\n';
            for (var d in details) {
                var rec = details[d];
                if (rec.projectid == 0) rec.projectid = 'null';                
                sql += 'INSERT INTO hr.timesheet_dtl (tsid, projectid, hours_sun, hours_mon, hours_tue, hours_wed, hours_thu, hours_fri, hours_sat, hours_total) '+
                       'VALUES(' + recid + ', ' + rec.projectid + ', ' +
                            (rec.hours_sun || 0) + ', '+
                            (rec.hours_mon || 0) + ', '+
                            (rec.hours_tue || 0) + ', '+
                            (rec.hours_wed || 0) + ', '+
                            (rec.hours_thu || 0) + ', '+
                            (rec.hours_fri || 0) + ', '+
                            (rec.hours_sat || 0) + ', '+
                            (rec.hours_total || 0) + 
                       ');';
            }
            w2db.exec(sql, function (err, result) {
                if (err) {
                    res.send({
                        status  : 'error', 
                        message : 'Database Error'
                    });    
                    return;
                }
                res.send({
                    status  : 'success'
                });
            });
        });
    }
}