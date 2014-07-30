services = {

    "/api/project/enum/projects" : {
        "desc"      : "List of open projects (for enum)",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/enum.js",
        "vars"      : null
    },
    
    "/api/project/list" : { 
        "desc"      : "List of projects",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/project.js",
        "vars"      : grid_list
    },

    "/api/project/save" : {
        "desc"      : "Adds a new project",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/project.js",
        "vars"      : grid_list
    },

    "/api/project/delete" : {
        "desc"      : "Deletes existing project(s)",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/project.js",
        "vars"      : grid_list
    },

    "/api/project/:id/overview" : {
        "desc"      : "Project overview",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/project.js",
        "vars"      : null
    },

    "/api/project/:id/activity/list" : {
        "desc"      : "List of activities for the project",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/activity.js",
        "vars"      : grid_list
    },

    "/api/project/:id/activity/save" : {
        "desc"      : "Save activity within the project",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/activity.js",
        "vars"      : null
    },

    "/api/project/:id/activity/delete" : {
        "desc"      : "Delete activity within the project",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/activity.js",
        "vars"      : null
    },

    "/api/project/:id/task/list" : {
        "desc"      : "List of tasks for the project",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/task.js",
        "vars"      : grid_list
    },

    "/api/project/:id/task/save" : {
        "desc"      : "Save task within the project",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/task.js",
        "vars"      : null
    },

    "/api/project/:id/review/list" : {
        "desc"      : "List of reviews for the project",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/review.js",
        "vars"      : grid_list
    },

    "/api/project/:id/review/save" : {
        "desc"      : "Save review within the project",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/review.js",
        "vars"      : null
    },

    "/api/project/:id/report/list" : {
        "desc"      : "List of reports for the project",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/report.js",
        "vars"      : grid_list
    },

    "/api/project/:id/report/save" : {
        "desc"      : "Save report within the project",
        "module"    : "project",
        "access"    : "restricted",
        "path"      : "project/report.js",
        "vars"      : null
    }
}