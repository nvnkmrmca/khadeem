const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TagSchema = mongoose.Schema({
	name: String,
	description: String,
	customer: String,
	isActive: Boolean,
	createdBy: { type: Schema.Types.ObjectId, default: null },
	updatedBy: { type: Schema.Types.ObjectId, default: null }
}, {
	timestamps: true
});

const ResponseSchema = mongoose.Schema({
	type: String,
	comment: String,
	attachment: String,
	isActive: Boolean,
	createdBy: { type: Schema.Types.ObjectId, default: null },
	updatedBy: { type: Schema.Types.ObjectId, default: null }
}, {
	timestamps: true
});

const TicketSchema = mongoose.Schema({
	type: String,
	subject: String,
	description: String,
	attachment: [String],
	priority: String,
	customer: { type: Schema.Types.ObjectId, default: null },
	team: { type: Schema.Types.ObjectId, default: null },
	status: String,
	latitude: String,
	longitude: String,
	location: String,
	tags: [TagSchema],
	responses: [ResponseSchema],
	isActive: Boolean,
	createdBy: { type: Schema.Types.ObjectId, default: null },
	updatedBy: { type: Schema.Types.ObjectId, default: null }
}, {
	timestamps: true
});

module.exports = mongoose.model('Ticket', TicketSchema);