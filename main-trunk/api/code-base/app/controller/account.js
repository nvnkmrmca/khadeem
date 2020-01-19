"use strict";

const jwt = require('jsonwebtoken');
const config = require('../config/index');
const User = require('../model/user');
const _res = require("../util/response");

// validate and verify user
exports.login = (req, res) => {
    // validate request
    if(!req.body.userName || !req.body.password) {
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }

    // verify user
    User.find({
                userName: req.body.userName,
                password: req.body.password,
                isActive: true
    }).then(result => {
        if(!result || result.length < 1){
            return _res.cError(res, 'User not found.');
        }
        // update os & os version for logged in user
        if(req.body.os || req.body.osVersion){
            User.findByIdAndUpdate(result[0]._id, {
                os: req.body.os || '',
                osVersion: req.body.osVersion || ''
            }, {new: true})
            .then(result => {
            }).catch(err => {
            });
        }
        // generate token
        let token = jwt.sign({ username: req.body.userName },config.secret, { expiresIn: '24h' }); // expires in 24 hours
        return _res.success(res, {
            token: token,
            user: result[0]
        });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return _res.nError(res, 'User not found.');
        }
        return _res.error(res, 'Internal Server Error.');
    });
};

// change password
exports.changePassword = (req, res) => {
    // validate request
    if(!req.params.id || !req.body.password || !req.body.newPassword) {
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    let userId = req.headers['user-id'] || '';

    // find record and update it with the request body
    User.findOneAndUpdate({
        _id: req.params.id,
        password: req.body.password
    }, {
        password: req.body.newPassword || '',
        updatedBy: userId
    }, {new: true})
    .then(result => {
        if(!result || !result._id){
            return _res.success(res, false, 'Please enter the valid password.');
        }
        return _res.success(res, true);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return _res.nError(res, 'Record not found with id ' + req.params.id);
        }
        return _res.error(res, 'Internal server error. Error updating record with id ' + req.params.id);
    });
};