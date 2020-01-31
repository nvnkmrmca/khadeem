const mongoose = require('mongoose');

const TagSchema = mongoose.Schema({
	name: String,
	normalized: String,
	__v: Number
});

module.exports = mongoose.model('Tag', TagSchema);