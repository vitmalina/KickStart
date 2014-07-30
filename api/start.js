var express     = require('express'); 
var session     = require('express-session');
var cookieParser= require('cookie-parser');
var bodyParser  = require('body-parser');
var compress    = require('compression');
var MongoStore  = require('connect-mongo')(session);
var winston     = require('winston');
var conf        = require('./conf.js');
var server      = express();

// globals
global._        = require('underscore');
global.w2ui     = require('./w2ui/w2ui.js');
global.w2db     = require('./w2ui/w2db.js');
global.security = require('./security.js');

// postgres
w2db.connect(_.extend({}, conf.postgres, { type: 'postgres' }));

// general
server.use(compress());
server.use(cookieParser());
server.use(bodyParser({ extended: true }));
server.use('/favicon.ico', function (req, res, next) { res.end(); });

// add headers
server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// sessions (in mangodb)
server.use(session({
    store  : new MongoStore(conf.mongodb),
    secret : '91df48jdDufu40d841=9ifjhkdfdf'
}));

// logger: access
var loggerAccess = new (winston.Logger) ({
    transports: [
        new (winston.transports.Console)({ 
            colorize: true 
        }),
        new (winston.transports.DailyRotateFile)({ 
            maxsize     : 100 * 1024 * 1024, // 100MB
            filename    : './log/access',
            datePattern : '.dd-MM-yyyy.log',
            json        : false 
        })
    ]
});
server.use(function (req, res, next) {
    loggerAccess.info(req.ip + ' - ' + req.url + ', sesid:' + req.session.id + ', agent:"' + req.headers['user-agent'] + '"');
    next();
});

// logger: errors
global.logger = new (winston.Logger) ({
    transports: [
        new (winston.transports.Console)({
            colorize: true
        }),
        new (winston.transports.DailyRotateFile)({ 
            maxsize     : 100 * 1024 * 1024, // 100MB
            filename    : './log/log',
            datePattern : '.dd-MM-yyyy.log',
            json        : false 
        })
    ]
});

// public folder
server.use('/',  express.static(__dirname.substr(0, __dirname.length - 4) + '/web'));

logger.info('================= Server Started ==================');

// security check
security.init();
server.use(security.check);
server.use(security.process);

// START THE SERVER
server.listen(conf.port);
logger.info('LISTENING on port ' + conf.port);