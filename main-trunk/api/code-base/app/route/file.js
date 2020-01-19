'use strict';

const middleware = require('./middleware');
var multer  = require('multer');
const config = require('../config/index');
const route = config.routePrefix + '/upload';

// var upload = multer({ dest: 'files/' });

const Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, './assets/file')
    },
    filename(req, file, callback) {
      // callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
      callback(null, `${file.originalname}`)
    },
});
const upload = multer({ storage: Storage });

module.exports = (app) => {
    // upload
    app.post(route, middleware.checkToken, upload.single('file'), (req, res,next) => {
        return res.send({ data: true, message: '' });
    });
};