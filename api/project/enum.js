/**
*  Enum for projects
*/

module.exports = {

    '/api/project/enum/projects': function (req, res, next) {
        var ret = [];
        var sql =  'SELECT projectid as id, project_name as text, \
                        projectid, project_name, \
                        OWNER.userid as "owner.userid", \
                        OWNER.fname || \' \' || OWNER.lname as "owner.name", \
                        OWNER.fname as "owner.fname", \
                        OWNER.lname as "owner.lname" \
                    FROM project.projects MST \
                        INNER JOIN users OWNER ON MST.owner_userid = OWNER.userid \
                    WHERE status = \'O\' \
                        AND (project_name ILIKE \''+ (req.data['search'] || '') +'%\') \
                    ORDER BY project_name\
                    LIMIT '+ (req.data['max'] || 500);
        w2ui.getEnum(sql, req, res);
    }
}