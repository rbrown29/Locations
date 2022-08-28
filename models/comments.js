const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
	comment: String,
	createdAt: {type: String, default: Date.now},
	user1: String,
	name: String
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
