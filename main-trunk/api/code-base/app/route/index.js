'use strict';

module.exports = (app) => {
    require('./heartbeat')(app),
    require('./account')(app),
    require('./user')(app),
    require('./customer')(app),
    require('./team')(app),
    require('./ticket')(app),
    require('./file')(app)
};