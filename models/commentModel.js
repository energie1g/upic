const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'A comment must have a comment!']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A comment must have a user']
  },
  image: {
    type: mongoose.Schema.ObjectId,
    ref: 'Image',
    required: [true, 'A comment must be attached to an image']
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
