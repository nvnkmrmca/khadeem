'use strict';

const middleware = require('./middleware');
const _ctrl = require('../controller/priority');
const config = require('../config/index');
const route = config.routePrefix + '/priorities';

module.exports = (app) => {
    // Retrieve all
    app.get(route, middleware.checkToken, _ctrl.findAll);
};