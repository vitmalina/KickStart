/**
*  Module that helps to work with Postgres DB
*  DEPENDENCIES: pg or mysql
*/

var dbLink  = null;

// public
module.exports = {
    type    : null,
    connect : connect,
    exec    : exec
};
return;

/*
*  Implementation
*/

function connect (conf) {
    // postgres
    if (conf.type == 'postgres') {
        // reads connect information from conf.js file
        var postgres = require('pg');
        module.exports.type = 'postgres';
        dbLink = new postgres.Client('postgres://'+ conf.user + ':' + conf.pass + '@' + conf.host + ':' + conf.port + '/' + conf.db);
        dbLink.connect(function (error) {
            // log connection error 
            if (error) { 
                var msg = 'Postgres: cannot connect to the database (HOST:'+ conf.host + ', USER:' + conf.user + ', DB:' + conf.db + ')' + ' -- ' + error;
                if (logger) logger.error(msg); else console.log(msg);
            }
        });
        return 'postgres';
    }
    // MySQL
    if (conf.type == 'mysql') {
        var msg = 'Mysql is not currently supported.';
        if (logger) logger.error(msg); else console.log(msg);
        return 'mysql';
    }
}

function exec (sql, callBack) {
    // Postgres
    if (module.exports.type == 'postgres') {
        dbLink.query(sql, function (err, result) {
            if (err) {
                var msg = 'Postgres: SQL Error' + ' -- ' + err + '\n' + sql;
                if (logger) logger.error(msg); else console.log(msg);
                callBack(err, msg);
                return;
            }
            // process records
            callBack(null, {
                count    : result.rowCount,
                records  : result.rows,
                fields   : result.fields,
                _result  : result
            });
        });
    }
}