'use strict';

module.exports = (app) => {
    require('./heartbeat')(app),
    require('./account')(app),
    require('./user')(app),
    require('./customer')(app),
    require('./team')(app),
    require('./ticket')(app),
    require('./priority')(app),
    require('./tag')(app),
    require('./group')(app),
    require('./type')(app),
    require('./file')(app)
};