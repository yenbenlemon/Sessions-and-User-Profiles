const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	privacy: {type: Boolean, required: true},
	total_quizzes: {type: Number, default: 0},
	total_score: {type: Number, default: 0}
});

module.exports = mongoose.model("User", userSchema);
