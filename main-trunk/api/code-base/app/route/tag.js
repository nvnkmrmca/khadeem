'use strict';

const middleware = require('./middleware');
const _ctrl = require('../controller/tag');
const config = require('../config/index');
const route = config.routePrefix + '/tag';

module.exports = (app) => {
    // Retrieve all
    app.get(route + 's', middleware.checkToken, _ctrl.findAll);
};