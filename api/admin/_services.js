services = {
    
    "/api/admin/users" : { 
        "desc"     : "List users",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/users.js",
        "vars"     : grid_list
    },

    "/api/admin/users/save" : { 
        "desc"     : "Add or update a user",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/users.js",
        "vars"     : { 'TODO': '' }
    },

    "/api/admin/users/delete" : { 
        "desc"     : "Delete users",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/users.js",
        "vars"     : { 'TODO': '' }
    },

    // User Groups

    "/api/admin/groups" : { 
        "desc"     : "List user groups",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/groups.js",
        "vars"     : grid_list
    },

    "/api/admin/groups/save" : { 
        "desc"     : "Add or update a user group",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/groups.js",
        "vars"     : { 'TODO': '' }
    },

    "/api/admin/groups/delete" : { 
        "desc"     : "Delete user groups",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/groups.js",
        "vars"     : { 'TODO': '' }
    },

    "/api/admin/group/:id/members" : { 
        "desc"     : "List group members",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/groups.js",
        "vars"     : grid_list
    },

    "/api/admin/group/:id/add" : { 
        "desc"     : "Add users to a group",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/groups.js",
        "vars"     : {
            "users": { "type": "array:int", "required": false }
        }
    },

    "/api/admin/group/:id/remove" : { 
        "desc"     : "Remove users from a group",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/groups.js",
        "vars"     : {
            "users": { "type": "array:int", "required": false }
        }
    },

    // Roles

    "/api/admin/roles" : { 
        "desc"     : "List roles",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/roles.js",
        "vars"     : grid_list
    },

    "/api/admin/roles/save" : { 
        "desc"     : "Add or update a role",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/roles.js",
        "vars"     : { 'TODO': '' }
    },

    "/api/admin/roles/delete" : { 
        "desc"     : "Delete user roles",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/roles.js",
        "vars"     : { 'TODO': '' }
    },

    "/api/admin/role/:id/members" : { 
        "desc"     : "List role members",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/roles.js",
        "vars"     : grid_list
    },

    "/api/admin/role/:id/add" : { 
        "desc"     : "Add users to a role",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/roles.js",
        "vars"     : {
            "users": { "type": "array:int", "required": false }
        }
    },

    "/api/admin/role/:id/remove" : { 
        "desc"     : "Remove users from a role",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/roles.js",
        "vars"     : {
            "users": { "type": "array:int", "required": false }
        }
    },

    "/api/admin/role/:id/services" : { 
        "desc"     : "List role services",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/roles.js",
        "vars"     : grid_list
    },

    "/api/admin/role/:id/grant" : { 
        "desc"     : "Grants access to a service",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/roles.js",
        "vars"     : { 'TODO': '' }
    },

    "/api/admin/role/:id/revoke" : { 
        "desc"     : "Revokes access to a service",
        "module"   : "admin",
        "access"   : "restricted",
        "path"     : "admin/roles.js",
        "vars"     : { 'TODO': '' }
    },
}