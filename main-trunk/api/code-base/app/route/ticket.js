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

    // Retrieve all by customerId
    app.get(route + 's/bycustomer/:id', middleware.checkToken, _ctrl.findAllByCustomer);

    // Retrieve all by teamId
    app.get(route + 's/byteam/:id', middleware.checkToken, _ctrl.findAllByTeam);

    // Retrieve single with id
    app.get(route + '/:id', middleware.checkToken, _ctrl.findOne);

    // Update by id
    app.put(route + '/update/:id', middleware.checkToken, _ctrl.update);

    // Delete by id
    app.delete(route + '/:id', middleware.checkToken, _ctrl.delete);

    // status update
    app.put(route + '/status/:id', middleware.checkToken, _ctrl.statusUpdate);

    // Add response by ticket id
    app.post(route + '/response/:id', middleware.checkToken, _ctrl.addResponse);

    // Update response by id
    app.put(route + '/response/:id', middleware.checkToken, _ctrl.updateResponse);

    // Delete response by id
    app.delete(route + '/response/:id', middleware.checkToken, _ctrl.deleteResponse);

    // Retrieve all tags
    app.get(route + 's/tags', middleware.checkToken, _ctrl.findAllTags);

    // Retrieve all tags by customerId
    app.get(route + 's/tagsbycustomer/:id', middleware.checkToken, _ctrl.findAllByTagsCustomer);

};