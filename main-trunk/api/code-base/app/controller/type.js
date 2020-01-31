"use strict";

const Type = require('../model/type');
const _res = require('../util/response');

// retrieve and return all records from the database.
exports.findAll = (req, res) => {
    Type.find({}).then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};
