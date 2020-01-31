'use strict';

const middleware = require('./middleware');
const _ctrl = require('../controller/type');
const config = require('../config/index');
const route = config.routePrefix + '/type';

module.exports = (app) => {
    // Retrieve all
    app.get(route + 's', middleware.checkToken, _ctrl.findAll);
};