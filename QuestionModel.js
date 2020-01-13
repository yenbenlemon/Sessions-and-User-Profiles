const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let questionSchema = Schema({
	question: {type: String, required: true},
	correct_answer: {type: String, required: true},
	incorrect_answers: [{type: String, required: true}]
});

questionSchema.statics.findIDArray = function(arr, callback){
	this.find({'_id': {$in: arr}}, function(err, results){
		if(err){
			callback(err);
			return;
		}
		callback(null, results);		
	});
}

questionSchema.statics.getRandomQuestions = function(callback){
	this.aggregate([{ "$sample": { size: 10 } }]).exec(callback);
}

module.exports = mongoose.model("Question", questionSchema);