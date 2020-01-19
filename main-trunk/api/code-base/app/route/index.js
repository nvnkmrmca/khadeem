'use strict';

module.exports = (app) => {
    require('./heartbeat')(app),
    require('./account')(app),
    require('./user')(app),
    require('./file')(app)
};