'use strict';

const middleware = require('./middleware');
const _ctrl = require('../controller/group');
const config = require('../config/index');
const route = config.routePrefix + '/group';

module.exports = (app) => {
    // Retrieve all
    app.get(route + 's', middleware.checkToken, _ctrl.findAll);
};