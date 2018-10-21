var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var CommentsSchema = new Schema({
  
  body: String
});

var NoteComments = mongoose.model("Comments", CommentsSchema);

// Export the CommentsSchema model
module.exports = Comments;