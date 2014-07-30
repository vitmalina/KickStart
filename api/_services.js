// ================================================
// This should have ALL POSSIBLE END POINTS
// All allowed End Points are based on roles. 
// See sys_roles, sys_actions, sys_role_action tables

var fs = require('fs');
var grid_list = {
    "name"        : { type: "string",  required: true },
    "cmd"         : { type: "string",  required: true },
    "limit"       : { type: "integer", require: false },
    "offset"      : { type: "integer", require: false },
    "selected"    : { type: "array",   require: false },
    "searchLogic" : { type: "string",  require: false, values: ['OR', 'AND'] },
    "search"      : { type: "object",  require: false },
    "sort"        : { type: "object",  require: false },
};
var grid_delete = {
    "name"     : { type: "string",  required: true },
    "cmd"      : { type: "string",  required: true },
    "selected" : { type: "array",   require: false }
}
var form_get = {

}
var form_save = {
    
}

// load services from other modules
module.exports = _.extend({},
    eval(fs.readFileSync(__dirname + '/shared/_services.js', 'utf8')),
    eval(fs.readFileSync(__dirname + '/admin/_services.js', 'utf8')),
    eval(fs.readFileSync(__dirname + '/hr/_services.js', 'utf8')),
    eval(fs.readFileSync(__dirname + '/project/_services.js', 'utf8'))
);