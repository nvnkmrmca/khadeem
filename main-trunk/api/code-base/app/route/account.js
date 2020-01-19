'use strict';

const middleware = require('./middleware');
const _ctrl = require('../controller/account');
const config = require('../config/index');
const route = config.routePrefix + '/account';

module.exports = (app) => {
    // login
    app.post(route + '/login', _ctrl.login);

    // change password
    app.post(route + '/changepassword/:id', middleware.checkToken, _ctrl.changePassword);
};