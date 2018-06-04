const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
const CommentsSchema = new Schema({
  body: String
});

// This creates our model from the above schema using mongoose's model method
const Comments = mongoose.model("Comments", CommentsSchema);

module.exports = Comments;