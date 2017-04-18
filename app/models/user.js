// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	_id: Number,
    image: String,
	name: String,
	title: String,
	sex:   String,
	startDate:   String,
	officePhone:   String,
	cellPhone:   String,
	SMS:   String,
	email:   String,
	manager:   {},
	directReports: []
});

module.exports = mongoose.model('User', UserSchema);
