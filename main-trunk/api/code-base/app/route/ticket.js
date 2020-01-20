'use strict';

const middleware = require('./middleware');
const _ctrl = require('../controller/ticket');
const config = require('../config/index');
const route = config.routePrefix + '/ticket';

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

    // status update
    app.put(route + '/status/:id', middleware.checkToken, _ctrl.statusUpdate);

    // Add response by ticket id
    app.post(route + '/response/:id', middleware.checkToken, _ctrl.addComment);

    // Update response by id
    app.put(route + '/response/:id', middleware.checkToken, _ctrl.updateComment);

    // Delete response by id
    app.delete(route + '/response/:id', middleware.checkToken, _ctrl.deleteComment);

};