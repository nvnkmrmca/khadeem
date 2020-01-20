const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TeamSchema = mongoose.Schema({
	customerId: { type: Schema.Types.ObjectId, default: null },
	name: String,
	isActive: Boolean,
	createdBy: { type: Schema.Types.ObjectId, default: null },
	updatedBy: { type: Schema.Types.ObjectId, default: null }
}, {
	timestamps: true
});

module.exports = mongoose.model('Team', TeamSchema);