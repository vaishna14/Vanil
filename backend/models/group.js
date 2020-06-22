const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const groupSchema = mongoose.Schema({
  groupList: { type: String, required: true, },
  userCreated: { type: String },
});

groupSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Group", groupSchema);
