const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CustomerSchema = mongoose.Schema({
	name: String,
	logo: String,
	isActive: Boolean,
	createdBy: { type: Schema.Types.ObjectId, default: null },
	updatedBy: { type: Schema.Types.ObjectId, default: null }
}, {
	timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);