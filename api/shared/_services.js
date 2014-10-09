services = {
    
    // Common Services

    "/api" : {
        "desc"   : "List allowed services",    // description of the service
        "module" : "global",
        "access" : "public",                   // access = public | common | restricted
        "path"   : "shared/session.js",        // controller
        "vars"   : null                        // all possible variables
    },

    "/api/explore" : {
        "desc"   : "Explore allowed services",
        "module" : "global",
        "access" : "public",
        "path"   : "shared/session.js",
        "vars"   : null
    },

    "/api/user" : {
        "desc"   : "Current user information",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/session.js",
        "vars"   : null
    },

    "/api/user/save" : {
        "desc"   : "Saves user contract information",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/session.js",
        "vars"   : { 'TODO': '' }
    },

    "/api/user/save-photo" : {
        "desc"   : "Saves user photo",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/session.js",
        "vars"   : { 'TODO': '' }
    },

    "/api/user/password" : {
        "desc"   : "Resets user password",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/session.js",
        "vars"   : {
            "pass_old" : { "type": "string", "required": true, "min": 6, "max": 32 },
            "pass_new" : { "type": "string", "required": true, "min": 6, "max": 32 }
        }
    },

    "/api/login" : {
        "desc"   : "Login and start session",
        "module" : "global",
        "access" : "public",
        "path"   : "shared/session.js",
        "vars"   : {
            "login" : { "type": "string", "required": true },
            "pass"  : { "type": "string", "required": true, "min": 6, "max": 32 }
        }
    },

    "/api/logout" : {
        "desc"   : "Logout and destroy session",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/session.js",
        "vars"   : null
    },

    // ENUM Lists

    "/api/enum/users" : {
        "desc"   : "List users (for autocomplete)",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/enum.js",
        "vars"   : {
            "search"  : { "type": "string" },
            "max"     : { "type": "int", "default": 200 }
        }
    },

    "/api/enum/groups" : {
        "desc"   : "List groups (for autocomplete)",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/enum.js",
        "vars"   : {
            "search" : { "type": "string" },
            "max"    : { "type": "int", "default": 200 }
        }
    },

    "/api/enum/roles" : {
        "desc"   : "List roles (for autocomplete)",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/enum.js",
        "vars"   : {
            "search" : { "type": "string" },
            "max"    : { "type": "int", "default": 200 }
        }
    },

    // General Lists

    "/api/users" : {
        "desc"   : "List users",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/common.js",
        "vars"   : grid_list
    },

    "/api/user/:id/photo" : {
        "desc"   : "Returns user photo",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/common.js",
        "vars"   : null
    },

    "/api/groups" : {
        "desc"   : "List groups",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/common.js",
        "vars"   : grid_list
    },    

    "/api/group/:id/members" : {
        "desc"   : "List group members (only published groups)",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/common.js",
        "vars"   : null
    },

    "/api/group/:id/join" : {
        "desc"   : "Join user group (only open groups)",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/common.js",
        "vars"   : { 'TODO': '' }
    },

    "/api/group/:id/leave" : {
        "desc"   : "Leave user group (only open groups)",
        "module" : "global",
        "access" : "common",
        "path"   : "shared/common.js",
        "vars"   : { 'TODO': '' }
    }    
};