/**
*  Main configuration file
*/

module.exports = {
    port: 3000,   
    mongodb: {
        host : 'localhost',
        port : 27017,
        db   : 'sessions',
        user : '',
        pass : ''
    },
    postgres : {
        host : 'localhost',
        port : 5432,
        db   : 'kickstart',
        user : 'vitali',
        pass : 'vitali'
    }
}