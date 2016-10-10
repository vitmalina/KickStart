{
    "main": {
        "start": "app/main/main.js",
        "assets": [
            "app/main/conf.js"
        ]
    },

    "profile": {
        "start": "app/main/profile/profile.js",
        "assets": [
            "app/main/profile/conf.js",
            "app/main/profile/profile.html",
            "app/main/profile/profile.css"
        ]
    },

    "admin": {
        "start": "app/main/admin/admin.js",
        "assets": [
            "app/main/admin/conf.js",
            "app/main/admin/conf-groups.js",
            "app/main/admin/conf-roles.js"
        ]
    },

    "home": {
        "assets": [
            "app/home/conf.js",
            "app/home/user/view.html",
            "app/home/user/view.css",
            "app/home/group/view.html",
            "app/home/group/view.css"
        ],
        "route": "/home*",
        "start": "app/home/home.js"
    }
}
