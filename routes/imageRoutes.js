const express = require('express');
const {
  postImage,
  getAllImages,
  toggleLikeImage,
  getImage,
  getLikers
} = require('../controllers/imageController');
const { protect } = require('../controllers/authController');

const router = express.Router();

// Create or get all images
router
  .route('/')
  .post(postImage)
  .get(protect, getAllImages);

// Get an image
router.route('/:id').get(getImage);

// Like or Dislike an image
router.route('/:id/like').patch(toggleLikeImage);

// Get Likers
router.route('/:id/:is').get(getLikers);

module.exports = router;
