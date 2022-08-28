
//========= location schema ================//
const mongoose = require("mongoose")

const locationSchema = new mongoose.Schema({
	name: {type: String, require: true, unique: true},
	image:{type: String, require: true},
	description: {type: String, require: true},
  	likes: {type: Number, default: 0},
	likedAndLoved:[{
		username:String,
		liked:Boolean,
		loved:Boolean,
	}],
	createdAt: {type: String, default: Date.now},
	user1: String,
	comments: String
})

const Location = mongoose.model('Location', locationSchema)

module.exports = Location
