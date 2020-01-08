const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    destionation: String,
    encoding: String,
    fieldname: String,
    mimetype: String,
    originalname: String,
    path: {
      type: String,
      required: [true, 'An image must have a path.']
    },
    size: Number,
    imgUrl: {
      type: String,
      required: [true, "We didn't find any image to upload."]
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'An image must have a user.']
    },
    likes: {
      type: Number,
      default: 0
    },
    description: {
      type: String
    },
    likers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    comments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
