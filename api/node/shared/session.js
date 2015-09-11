/**
*  Common services: login, logout, etc.
*/

module.exports = {

    '/api': function (req, res, next) {
        res.send(_.extend({ status: 'success' }, security.getServices(req)));
    },

    '/api/explore': function (req, res, next) {
        var fs = require('fs');
        fs.readFile(__dirname + '/explore-api.html', 'utf8', function (err, data) {
            if (err) res.send(err); else res.send(data);
        });
    },

    '/api/login': function (req, res, next) {
        var login = req.data['login'];
        var pass  = req.data['pass'];
        if (req.query['login']) login = req.query['login'];
        if (req.query['pass']) pass = req.query['pass'];
        if (login && pass) {
            login = String(login).replace(/'/g, '');
            pass  = String(pass).replace(/'/g, '');
            var sql = 'SELECT userid, fname, lname, email, login, super \
                       FROM users \
                       WHERE login = \''+ login +'\' AND deleted != true \
                            AND (pass = MD5(\''+ pass +'\') OR (tmp_pass = \''+ pass +'\' AND tmp_pass_expires > current_timestamp)) \
                            AND (expires IS NULL OR expires > current_date)';
                w2db.exec(sql, function (err, result) {
                if (err) {
                    res.send({
                        status    : 'error', 
                        message    : 'Database Error'
                    });    
                    return;
                } 
                if (result.count == 1) {
                    req.session.user = result.records[0];
                    res.send({
                        status  : 'success', 
                        user    : req.session.user
                    });
                } else {
                    res.send({
                        status  : 'error', 
                        message : 'Incorrect login or password'
                    });
                    logger.error('LOGIN FAILED, USER:' + req.data['login'] + ', IP:'+ req.ip);                            
                }
            });
        } else {
            res.send({
                status  : 'error', 
                message : 'Incorrect login or password'
            });
        }
    },

    '/api/logout': function (req, res, next) {
        delete req.session.user;
        res.send({
            status : 'success'
        });
    },

    '/api/session': function (req, res, next) {
        if (req.session.user) {
            var done    = [];
            var user    = {};
            var groups  = {};
            var roles   = {};

            security.getUser(req, finish);
            security.getUserGroups(req, finish);
            security.getUserRoles(req, finish);

            function finish (type, data) {
                done.push(type);
                if (type == 'user') user = data;
                if (type == 'groups') groups = data;
                if (type == 'roles') roles = data;
                if (done.length == 3) {
                    res.send({
                        status   : 'success', 
                        user     : user,
                        groups   : groups,
                        roles    : roles,
                        services : security.getServices(req).services
                    });
                }
            }
        } else {
            res.send({
                status : 'error', 
                user   : 'No user session found'
            });        
        }
    },

    '/api/user/save': function (req, res, next) {
        var rec = req.data.record;
        var data   = {
            recid  : req.session.user.userid,
            record : {
                email_alt       : rec.email_alt,
                phone           : rec.phone,
                phone_alt       : rec.phone_alt,
                im              : rec.im,
                im_alt          : rec.im_alt,
                address         : rec.address,
                last_userid     : req.session.user.userid,
                last_update     : '__now()'  
            }
        };        
        // save 
        w2ui.saveRecord(data, 'users', 'userid', req, res);        
    },

    '/api/user/password': function (req, res, next) {
        var rec = req.data;
        var sql = 'UPDATE users SET pass = md5(\'' + String(rec.pass_new).replace(/'/g, '\'') + '\') \
                   WHERE userid = ' + req.session.user.userid + ' \
                      AND (pass = MD5(\''+ String(rec.pass_old).replace(/'/g, '\'') +'\') \
                            OR (tmp_pass = \''+ String(rec.pass_old).replace(/'/g, '\'') +'\' AND tmp_pass_expires > current_timestamp) \
                      )';
        w2db.exec(sql, function (err, result) {
            if (err || result.count == 0) {
                res.send({
                    status  : 'error', 
                    message : 'Password was not changed'
                });    
                return;
            } else {
                res.send({
                    status  : 'success'
                });
            }
        });
    },

    '/api/user/save-photo': function (req, res, next) {
        var rec = req.data;
        var sql = 'UPDATE users SET photo = \'' + String(rec.photo).replace(/'/g, '\'') + '\' \
                   WHERE userid = ' + req.session.user.userid;
        w2db.exec(sql, function (err, result) {
            if (err || result.count == 0) {
                res.send({
                    status  : 'error', 
                    message : 'Error while saving the photo'
                });    
                return;
            } else {
                res.send({
                    status  : 'success'
                });
            }
        });
    }    
}