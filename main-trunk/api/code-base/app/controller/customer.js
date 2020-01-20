"use strict";

const Customer = require('../model/customer');
const _res = require('../util/response');

// create and Save a new record
exports.create = (req, res) => {
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId || !req.body.name){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
     // create and save new object
     new Customer({
        name: req.body.name,
        logo: req.body.logo || '',
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
    Customer.find({
        isActive: true
    }).then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};

// find a single record with an id
exports.findOne = (req, res) => {
    Customer.findById(req.params.id)
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
    if(!userId || !req.body.name){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        logo: req.body.logo || '',
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
    Customer.findByIdAndUpdate(req.params.id, {
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