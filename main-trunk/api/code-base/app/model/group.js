const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema({
	name: String
});

module.exports = mongoose.model('Group', GroupSchema);