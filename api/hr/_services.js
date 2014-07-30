services = {

    /* USER */

    "/api/hr/timesheet/list" : {
        "desc"      : "Lists timesheets for the user",
        "module"    : "hr",
        "access"    : "restricted",
        "path"      : "hr/hr.js",
        "vars"      : null
    },

    "/api/hr/timesheet/:id/details" : {
        "desc"      : "Lists details of a timesheet for the user",
        "module"    : "hr",
        "access"    : "restricted",
        "path"      : "hr/hr.js",
        "vars"      : null
    },

    "/api/hr/timesheet/save" : {
        "desc"      : "Saves user timesheet",
        "module"    : "hr",
        "access"    : "restricted",
        "path"      : "hr/hr.js",
        "vars"      : null
    },

    /* ADMIN */

    "/api/hr/timesheet/all" : {
        "desc"      : "Lists timesheets for all users",
        "module"    : "hr",
        "access"    : "restricted",
        "path"      : "hr/hr.js",
        "vars"      : null
    },

    "/api/hr/timesheet/all/:id/details" : {
        "desc"      : "Lists details of a timesheet for the user",
        "module"    : "hr",
        "access"    : "restricted",
        "path"      : "hr/hr.js",
        "vars"      : null
    }
}