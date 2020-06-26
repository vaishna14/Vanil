const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true, },
  lastName: { type: String, required: true, },
  contact: { type: Number, required: true, },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  groupName:{type:String},
  tasks:{type:Array},
  myAvatar:{type:String}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
