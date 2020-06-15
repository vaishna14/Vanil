const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  time: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  status: { type: String, required: true },
  createdDate: { type: String, required: true },
  InprogressDate: { type: String },
  CompletedDate: { type: String },
});

module.exports = mongoose.model("Post", postSchema);
