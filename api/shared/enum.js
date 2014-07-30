/**
*  Common services: login, logout, etc.
*/

module.exports = {

    '/api/enum/users': function (req, res, next) {
        var ret = [];
        var sql = "SELECT userid as id, lname || ', ' || fname as text, userid, fname, lname, email \
                   FROM users \
                   WHERE hidden != true AND deleted != true \
                        AND (lname ILIKE '"+ (req.data['search'] || '') +"%' OR fname ILIKE '"+ (req.data['search'] || '') +"%') \
                   ORDER BY lname, fname\
                   LIMIT "+ (req.data['max'] || 500);
        w2ui.getEnum(sql, req, res);
    },

    '/api/enum/groups':  function (req, res, next) {
        var ret = [];
        var sql = "SELECT groupid as id, group_name as text, groupid, group_name \
                   FROM groups \
                   WHERE group_name ILIKE '%"+ (req.data['search'] || '') +"%' \
                   ORDER BY group_name \
                   LIMIT "+ (req.data['max'] || 500);
        w2ui.getEnum(sql, req, res);
    },

    '/api/enum/roles':  function (req, res, next) {
        var ret = [];
        var sql = "SELECT roleid as id, role_name as text, roleid, role_name \
                   FROM roles \
                   WHERE role_name ILIKE '%"+ (req.data['search'] || '') +"%' \
                   ORDER BY role_name \
                   LIMIT "+ (req.data['max'] || 500);
        w2ui.getEnum(sql, req, res);
    }
}