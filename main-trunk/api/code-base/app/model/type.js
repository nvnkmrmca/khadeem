const mongoose = require('mongoose');

const TypeSchema = mongoose.Schema({
	name: String
});

module.exports = mongoose.model('Type', TypeSchema);