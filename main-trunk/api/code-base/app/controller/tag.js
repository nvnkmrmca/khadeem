"use strict";

const Tag = require('../model/tag');
const _res = require('../util/response');

// retrieve and return all records from the database.
exports.findAll = (req, res) => {
    Tag.find({}).then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};
