'use strict';

const middleware = require('./middleware');
const _ctrl = require('../controller/team');
const config = require('../config/index');
const route = config.routePrefix + '/team';

module.exports = (app) => {
    // Create
    app.post(route, middleware.checkToken, _ctrl.create);

    // Retrieve all
    app.get(route + 's', middleware.checkToken, _ctrl.findAll);

    // Retrieve all
    app.get(route + 's/:customerId', middleware.checkToken, _ctrl.findAllByCustomer);

    // Retrieve single with id
    app.get(route + '/:id', middleware.checkToken, _ctrl.findOne);

    // Update by id
    app.put(route + '/:id', middleware.checkToken, _ctrl.update);

    // Delete by id
    app.delete(route + '/:id', middleware.checkToken, _ctrl.delete);
};