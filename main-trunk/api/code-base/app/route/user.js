'use strict';

const middleware = require('./middleware');
const _ctrl = require('../controller/user');
const config = require('../config/index');
const route = config.routePrefix + '/user';

module.exports = (app) => {
    // Create
    app.post(route, middleware.checkToken, _ctrl.create);

    // Retrieve all
    app.get(route + 's', middleware.checkToken, _ctrl.findAll);

    // Retrieve single with id
    app.get(route + '/:id', middleware.checkToken, _ctrl.findOne);

    // Update by id
    app.put(route + '/:id', middleware.checkToken, _ctrl.update);

    // Delete by id
    app.delete(route + '/:id', middleware.checkToken, _ctrl.delete);
};