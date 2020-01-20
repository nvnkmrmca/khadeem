const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
	customerId: { type: Schema.Types.ObjectId, default: null },
	teamId: { type: Schema.Types.ObjectId, default: null },
	number: String,
	userName: String,
	password: String,
	title: String,
	firstName: String,
	lastName: String,
	dob: String,
	age: Number,
	gender: String,
	mobileNo: String,
	emailId: String,
	ssnid: String,
	type: String,
	role: String,
	image: String,
	addressLine1: String,
	addressLine2: String,
	city: String,
	state: String,
	country: String,
	pincode: String,
	os: String,
	osVersion: String,
	isActive: Boolean,
	createdBy: { type: Schema.Types.ObjectId, default: null },
	updatedBy: { type: Schema.Types.ObjectId, default: null }
}, {
	timestamps: true
});

module.exports = mongoose.model('User', UserSchema);