'use strict';

const _ctrl = require('../controller/heartbeat');
const config = require('../config/index');
const route = config.routePrefix + '/heartbeat';

module.exports = (app) => {
    app.route(route).get(_ctrl.get);
};
