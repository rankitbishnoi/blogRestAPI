const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'blog'},
  comment: { type: String, required: true},
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user'}
});


module.exports = mongoose.model('comment', commentSchema);
