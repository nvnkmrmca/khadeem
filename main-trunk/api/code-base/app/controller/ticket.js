"use strict";

const Ticket = require('../model/ticket');
const _res = require('../util/response');

// create and Save a new record
exports.create = (req, res) => {
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId || !req.body.type || !req.body.subject || !req.body.priority || !req.body.customer || !req.body.status){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    // create and save new object
    new Ticket({
        type: req.body.type || '',
        subject: req.body.subject || '',
        description: req.body.description || '',
        attachment: (req.body.attachment && req.body.attachment.lenght > 0) ? req.body.attachment : [],
        priority: req.body.priority || '',
        customer: req.body.customer || '',
        status: req.body.status || '',
        latitude: req.body.latitude || 0,
        longitude: req.body.longitude || '',
        location: req.body.location || '',
        tags: (req.body.tags && req.body.tags.length > 0) ? req.body.tags : [],
        responses: (req.body.responses && req.body.responses.length > 0) ? req.body.responses : [],
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
    Ticket.find({
        isActive: true
    }).then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};

// find a single record with an id
exports.findOne = (req, res) => {
    Ticket.findById(req.params.id)
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
    return _res.cError(res, 'Not implemented.');
};

// delete a record with the specified id in the request
exports.delete = (req, res) => {
    let userId = req.headers['user-id'] || '';
    if(!userId){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    Ticket.findByIdAndUpdate(req.params.id, {
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

// ticket status update
exports.statusUpdate = (req, res) => {
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId || !req.body.status){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    Ticket.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
        updatedBy: userId || null
    }, {new: true})
    .then(result => {
        if(!result || !result._id){
            return _res.cError(res, 'Could not update status of ticket with id ' + req.params.id);
        }
        return _res.success(res, true, 'Ticket status updated successfully.');
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return _res.nError(res, 'Record not found with id ' + req.params.id);
        }
        return _res.error(res, 'Internal server error. Could not delete record with id ' + req.params.id);
    });
};

// add response to a ticket
exports.addResponse = (req, res) => {
    if(!req.body.type || !req.body.comment || !req.params.id){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    let userId = req.headers['user-id'] || '';
    Ticket.updateOne({
        _id: req.params.id
    },{
        $push: {
            responses: {
                type: req.body.type || '',
                comment: req.body.comment || '',
                attachment: req.body.attachment || '',
                isActive: true,
                createdBy: userId || null
            }
        }
    },{ new: true }).then(result => {
        if(!result || !result.ok || result.ok < 1){
            return _res.cError(res, 'Failed to add response.');
        }
        Ticket.findById(req.params.id, {
            responses: [{
                $elemMatch: {
                    isActive: true
                }
            }]
        }).then(cResult => {
            if(!cResult || !cResult.responses || cResult.responses.length < 1){
                return _res.cError(res, 'Failed to add response.');
            }
            return _res.success(res, cResult.responses[cResult.responses.length - 1]._id);
        }).catch(err => {
            return _res.error(res, err.message || 'Some error occurred while creating a record.');
        });
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while creating a record.');
    });
};

// update response
exports.updateComment = (req, res) => {
    if(!req.body.type || !req.body.comment || !req.params.id){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    let userId = req.headers['user-id'] || '';
    Ticket.findOneAndUpdate({
        'responses._id': req.params.id 
    }, {
        $set: {
            'responses.$.type': req.body.type || '',
            'responses.$.comment': req.body.comment || '',
            'responses.$.attachment': req.body.attachment || '',
            'responses.$.updatedBy': userId || null
        }
    }, {
        projection: {
        }
    }).then(result => {
        if(!result || !result._id){
            return _res.cError(res, 'Failed to update response.');
        }
        return _res.success(res, req.params.id);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while creating a record.');
    });
};

// delete response
exports.deleteComment = (req, res) => {
    Ticket.update({
        'responses._id': req.params.id
    }, { 
        $pull: 
        { 
            responses: { _id: req.params.id }
        }
    }, { safe: true, multi: true, new: true }).then(result => {
        if(!result || !result.ok || result.ok < 1){
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