const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true},
    created: { type: Date},
    author: { type: String, required: true},
    likes: [{
      userid: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
      time: Date
    }],
    dislikes: [{
      userid: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
      time: Date
    }],
    agerestriction: { type: String, default: 'false'},
    tags: [String],
    imageSrc: String
  });

module.exports = mongoose.model('blog', blogSchema);
