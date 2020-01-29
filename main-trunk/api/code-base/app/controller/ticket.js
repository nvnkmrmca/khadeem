"use strict";

const mongoose = require('mongoose');
const Ticket = require('../model/ticket');
const _res = require('../util/response');

// create and Save a new record
exports.create = (req, res) => {
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId || !req.body.type || !req.body.subject || !req.body.priority || !req.body.status){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    // create and save new object
    new Ticket({
        type: req.body.type || '',
        subject: req.body.subject || '',
        description: req.body.description || '',
        attachment: (req.body.attachment && req.body.attachment.lenght > 0) ? req.body.attachment : [],
        priority: req.body.priority || '',
        customer: req.body.customer || null,
        team: req.body.team || null,
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

// retrieve and return all records from the database customer Id.
exports.findAllByCustomer = (req, res) => {
    Ticket.find({
        customer: req.params.id,
        isActive: true
    }).then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};

// retrieve and return all records from the database customer Id.
exports.findMy = (req, res) => {
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    Ticket.find({
        $and: [
            { $or: [
                {createdBy: userId}, 
                {assignedTo: userId}
            ]},
            {isActive: true}
        ]
    }).then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};

// retrieve and return all records from the database by team Id.
exports.findAllByTeam = (req, res) => {
    Ticket.find({
        team: req.params.id,
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
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId || !req.body.type || !req.body.subject || !req.body.priority || !req.body.status){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    Ticket.findByIdAndUpdate(req.params.id, {
        type: req.body.type || '',
        subject: req.body.subject || '',
        description: req.body.description || '',
        attachment: (req.body.attachment && req.body.attachment.lenght > 0) ? req.body.attachment : [],
        priority: req.body.priority || '',
        customer: req.body.customer || null,
        team: req.body.team || null,
        status: req.body.status || '',
        latitude: req.body.latitude || 0,
        longitude: req.body.longitude || '',
        location: req.body.location || '',
        tags: (req.body.tags && req.body.tags.length > 0) ? req.body.tags : [],
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

// assign team for a ticket
exports.assignUser = (req, res) => {
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId || !req.body.assignedTo){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    Ticket.findByIdAndUpdate(req.params.id, {
        assignedTo: req.body.assignedTo,
        updatedBy: userId || null
    }, {new: true})
    .then(result => {
        if(!result || !result._id){
            return _res.cError(res, 'Could not assing user to ticket with id ' + req.params.id);
        }
        return _res.success(res, true, 'User assigned to ticket successfully.');
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return _res.nError(res, 'Record not found with id ' + req.params.id);
        }
        return _res.error(res, 'Internal server error. Could not delete record with id ' + req.params.id);
    });
};

//update due date for a ticket
exports.updateDueDate = (req, res) => {
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId || !req.body.dueDate){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    Ticket.findByIdAndUpdate(req.params.id, {
        dueDate: req.body.dueDate,
        updatedBy: userId || null
    }, {new: true})
    .then(result => {
        if(!result || !result._id){
            return _res.cError(res, 'Could not update due date to ticket with id ' + req.params.id);
        }
        return _res.success(res, true, 'Due date updated successfully.');
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
exports.updateResponse = (req, res) => {
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
exports.deleteResponse = (req, res) => {
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

// retrieve and return all records from the database.
exports.findAllTags = (req, res) => {
    Ticket.aggregate([{
        $match: {
            $and: [
                {
                     isActive: true
                }
            ]
        }
    },
    {
               $project : {
                   _id : 0,
                   tags : 1
               }
           }, {
               $unwind : "$tags"
           }, {
               $group : {
                   _id : "$tags.name",
                   count : {
                       $sum : 1
                   }
               }
           }
       ])
    .then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};

// retrieve and return all records from the database customer Id.
exports.findAllByTagsCustomer = (req, res) => {
    Ticket.aggregate([
        {
               $match: {
                   $and: [
                       {
                            customer: mongoose.Types.ObjectId(req.params.id),
                            isActive: true
                       }
                   ]
               }
           },
       {
               $project : {
                   _id : 0,
                   tags : 1
               }
           }, {
               $unwind : "$tags"
           }, {
               $group : {
                   _id : "$tags.name",
                   count : {
                       $sum : 1
                   }
               }
           }
       ]).then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};

// retrieve and return all records from the database customer Id.
exports.search = (req, res) => {
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    let query = {
        isActive: true
    };
    if(req.body.status){
        query.status = req.body.status;
    }
    if(req.body.priority){
        query.priority = req.body.priority;
    }
    if(req.body.assignedTo){
        query.assignedTo = req.body.assignedTo;
    }
    if(req.body.type){
        query.type = req.body.type;
    }
    if(req.body.subject){
        query.subject = req.body.subject;
    }
    if(req.body.tag){
        query.tag.name = req.body.tag;
    }
    if(req.body.location){
        query.location = req.body.location;
    }
    if(req.body.customer){
        query.customer = req.body.customer;
    }
    if(req.body.team){
        query.team = req.body.team;
    }
    Ticket.find(query).then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};

// retrieve and return all records from the database customer Id.
exports.searchMy = (req, res) => {
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    let query = {
        isActive: true
    };
    if(req.body.status){
        query.status = req.body.status;
    }
    if(req.body.priority){
        query.priority = req.body.priority;
    }
    if(req.body.assignedTo){
        query.assignedTo = req.body.assignedTo;
    }
    if(req.body.type){
        query.type = req.body.type;
    }
    if(req.body.subject){
        query.subject = req.body.subject;
    }
    if(req.body.tag){
        query.tag.name = req.body.tag;
    }
    if(req.body.location){
        query.location = req.body.location;
    }
    if(req.body.customer){
        query.customer = req.body.customer;
    }
    if(req.body.team){
        query.team = req.body.team;
    }
    Ticket.find({
        $and: [
            { $or: [
                {createdBy: userId}, 
                {assignedTo: userId}
            ]},
            query
        ]
    }).then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};