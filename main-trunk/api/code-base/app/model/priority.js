const mongoose = require('mongoose');

const PrioritySchema = mongoose.Schema({
	name: String,
	htmlColor: String
});

module.exports = mongoose.model('Priority', PrioritySchema);