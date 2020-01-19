"use strict";

const _res = require("../util/response");

exports.get = (req, res) => {
  return _res.success(res, null, 'API is alive.');
};