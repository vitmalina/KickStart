main.prefs = {
    data: {},
    defaults: null,

    init: function (defaults) {
        this.defaults = defaults;
        // init preferences
        try {
            var saved = localStorage.getItem(app._conf.name + '-preferences');
            saved = JSON.parse(saved);
            this.data = $.extend(true, {}, defaults, saved);
        } catch (e) {
            this.data = null;
        }
        if (this.data == null) {
            this.data = $.extedn(true, {}, defaults);
            localStorage.setItem(app._conf.name + '-preferences', JSON.stringify(this.data));
        }
    },

    reset: function () {
        this.data = {};
        this.set(this.defaults);
    },

    set: function (name, value) {
        if (name == null) return;
        if (typeof name == 'object') {
            $.extend(true, this.data, name);
        } else if (String(name).indexOf('.') != -1) {
            var cur  = this.data;
            var tmp  = name.split('.');
            var last = name;
            tmp.forEach(function (item) {
                if (typeof cur[item] == 'object') cur = cur[item];
                last = item;
            });
            cur[last] = value;
        } else {
            this.data[name] = value;
        }
        localStorage.setItem(app._conf.name + '-preferences', JSON.stringify(this.data));
    },

    get: function (name) {
        var value;
        if (name == null) { 
            // return all
            value = this.data;
        } else if (String(name).indexOf('.') != -1) {
            var tmp = name.split('.');
            value = this.data;
            tmp.forEach(function (item) {
                value = value[item];
            });
        } else {
            value = this.data[name]
        }
        return value;
    }
};