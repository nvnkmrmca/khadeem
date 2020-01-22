"use strict";

const Team = require('../model/team');
const _res = require('../util/response');

// create and Save a new record
exports.create = (req, res) => {
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId || !req.body.customerId || !req.body.name){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
     // create and save new object
     new Team({
        customerId: req.body.customerId,
        name: req.body.name,
        isActive: true,
        createdBy: userId
    }).save().then(result => {
        if(!result || !result._id){
            return _res.cError(res, 'Some error occurred while creating a record.');
        }
        return _res.success(res, result._id);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while creating a record.');
    });
};

// retrieve and return all records from the database.
exports.findAll = (req, res) => {
    Team.find({
        isActive: true
    }).then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};

// retrieve and return all records from the database.
exports.findAllByCustomer = (req, res) => {
    Team.find({
        customerId: req.params.customerId,
        isActive: true
    }).then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};

// find a single record with an id
exports.findOne = (req, res) => {
    Team.findById(req.params.id)
    .then(result => {
        if(!result || !result._id) {
            return _res.cError(res, 'Record not found with id ' + req.params.id);
        }
        return _res.success(res, result);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return _res.nError(res, 'Record not found with id ' + req.params.id);
        }
        return _res.error(res, 'Error retrieving record with id ' + req.params.id);
    });
};

// update a record identified by id in the request
exports.update = (req, res) => {
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId || !req.body.customerId || !req.body.name){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    Team.findByIdAndUpdate(req.params.id, {
        customerId: req.body.customerId,
        name: req.body.name,
        updatedBy: userId
    }, {new: true})
    .then(result => {
        if(!result || !result._id){
            return _res.cError(res, 'Error updating record with id ' + req.params.id);
        }
        return _res.success(res, result._id);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return _res.nError(res, 'Record not found with id ' + req.params.id);
        }
        return _res.error(res, 'Internal server error. Error updating record with id ' + req.params.id);
    });     
};

// delete a record with the specified id in the request
exports.delete = (req, res) => {
    let userId = req.headers['user-id'] || '';
    if(!userId){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    Team.findByIdAndUpdate(req.params.id, {
        isActive: false,
        updatedBy: userId || null
    }).then(result => {
        if(!result || !result._id){
            return _res.cError(res, 'Could not delete record with id ' + req.params.id);
        }
        return _res.success(res, true, 'Record deleted successfully.');
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return _res.nError(res, 'Record not found with id ' + req.params.id);
        }
        return _res.error(res, 'Internal server error. Could not delete record with id ' + req.params.id);
    });
};