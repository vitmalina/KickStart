config = {
    profile_layout: {
        name    : 'profile_layout',
        panels  : [
            { type: 'left', size: 150, minSize: 100, resizable: true, style: 'border-right: 1px solid silver' },
            { type: 'main', minSize: 350, overflow: 'hidden' }
        ]
    },

    profile_sidebar: {
        name    : 'profile_sidebar',
        nodes   : [ 
            { id: 'general', text: 'General', group: true, expanded: true, 
                nodes: [
                    { id: 'profile', text: 'Profile', icon: 'icon-user', selected: true },
                    // { id: 'my-groups', text: 'Groups', icon: 'icon-users' },
                    // { id: 'my-roles', text: 'Roles', icon: 'icon-profile' },
                    { id: 'my-prefs', text: 'Preferences', icon: 'icon-cog' }
                ]
            }
        ],
        onClick: function (event) {
            app.profile.action(event);
        }
    },

    profile_edit: { 
        name : 'profile_edit',
        url  : {
            save : app.context + '/api/user/save',
        },
        style: 'border: 0px; background-color: transparent',
        fields : [
            { type: 'text', field: 'email_alt',
                html: { group: 'Contact Info', caption: 'Email (other)', attr: 'style="width: 200px;" maxlength="75"', span: 7 }
            },
            { type: 'text', field: 'phone',
                html: { caption: 'Phone (official)', attr: 'style="width: 200px;" maxlength="75"', span: 7 }
            },
            { type: 'text', field: 'phone_alt', 
                html: { caption: 'Phone (mobile)', attr: 'style="width: 200px;" maxlength="75"', span: 7 }
            },
            { type: 'text', field: 'im', 
                html: { caption: 'IM', attr: 'style="width: 200px;" maxlength="75"', span: 7 }
            },
            { type: 'text', field: 'im_alt',
                html: { caption: 'IM (other)', attr: 'style="width: 200px;" maxlength="75"', span: 7 }
            },
            { type: 'textarea', field: 'address',
                html: { caption: 'Address', attr: 'style="width: 200px; height: 55px; resize: none" maxlength="500"', span: 7 }
            }
        ]
    }    
}