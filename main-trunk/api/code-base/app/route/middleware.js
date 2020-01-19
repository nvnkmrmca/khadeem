const jwt = require('jsonwebtoken');
const config = require('../config/index');
const _res = require("../util/response");

exports.checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
          _res.unAuthorized(res, 'Token is not valid.');
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    _res.unAuthorized(res, 'Authentication token is not supplied.');
  }
};

// module.exports = {
//   checkToken: checkToken
// }
