"use strict";

const User = require('../model/user');
const _res = require('../util/response');

// create and Save a new record
exports.create = (req, res) => {
    let userId = req.headers['user-id'] || '';
    // validate request
    if(!userId || !req.body.userName || !req.body.password || !req.body.firstName){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }

    User.findOne({
        $and: [
            {
                $or: [
                    {
                        userName: req.body.userName
                    }
                ],
                isActive: true
            }
        ]
    }, {
        _id: 1.0,
    }).then(mresult => {
        if(!mresult || !mresult._id){
            // create and save new object
            new User({
                customerId: req.body.customerId || null,
                teamId: req.body.teamId || null,
                number: req.body.number || '',
                userName: req.body.userName || '',
                password: req.body.password || '',
                title: req.body.title || '',
                firstName: req.body.firstName || '',
                lastName: req.body.lastName || '',
                dob: req.body.dob || '',
                age: req.body.age || 0,
                gender: req.body.gender || '',
                mobileNo: req.body.mobileNo || '',
                emailId: req.body.emailId || '',
                ssnid: req.body.ssnid || '',
                type: req.body.type || '',
                role: req.body.role || '',
                image: req.body.image || '',
                addressLine1: req.body.addressLine1 || '',
                addressLine2: req.body.addressLine2 || '',
                city: req.body.city || '',
                state: req.body.state || '',
                country: req.body.country || '',
                pincode: req.body.pincode || '',
                os: '',
                osVersion: '',
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
        }else{
            return _res.cError(res, 'User with same mobile number already exists. So please try with different mobile number.');
        }
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while creating a record.');
    });
};

// retrieve and return all records from the database.
exports.findAll = (req, res) => {
    User.find({
        isActive: true
    }).then(result => {
        return _res.success(res, result);
    }).catch(err => {
        return _res.error(res, err.message || 'Some error occurred while retrieving data.');
    });
};

// find a single record with an id
exports.findOne = (req, res) => {
    User.findById(req.params.id)
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
    if(!userId || !req.body.userName || !req.body.password || !req.body.firstName){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    let updateQuery = {
        customerId: req.body.customerId || null,
        teamId: req.body.teamId || null,
        number: req.body.number || '',
        userName: req.body.userName || '',
        password: req.body.password || '',
        title: req.body.title || '',
        firstName: req.body.firstName || '',
        lastName: req.body.lastName || '',
        dob: req.body.dob || '',
        age: req.body.age || 0,
        gender: req.body.gender || '',
        mobileNo: req.body.mobileNo || '',
        emailId: req.body.emailId || '',
        ssnid: req.body.ssnid || '',
        type: req.body.type || '',
        role: req.body.role || '',
        image: req.body.image || '',
        addressLine1: req.body.addressLine1 || '',
        addressLine2: req.body.addressLine2 || '',
        city: req.body.city || '',
        state: req.body.state || '',
        country: req.body.country || '',
        pincode: req.body.pincode || '',
        updatedBy: userId
    };
    User.findOne({
        userName: req.body.userName,
        isActive: true
    }, {
        _id: 1.0,
    }).then(uresult => {
        if(!uresult || !uresult._id || uresult._id == req.params.id){
            User.findByIdAndUpdate(req.params.id, updateQuery, {new: true})
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
        }else{
            return _res.cError(res, 'User with same user name already exists. So please try with different user name.');
        }
    }).catch(err => {
        return _res.error(res, 'Internal server error. Error updating record with id ' + req.params.id);
    });
};

// delete a record with the specified id in the request
exports.delete = (req, res) => {
    let userId = req.headers['user-id'] || '';
    if(!userId){
        return _res.vError(res, 'Validation failed. Please fill all the required fields.');
    }
    User.findByIdAndUpdate(req.params.id, {
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