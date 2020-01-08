const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleAbonneUser,
  getAbonnes,
  updatePImage
} = require('../controllers/userController');

const {
  signup,
  login,
  isLoggedIn,
  logout
} = require('../controllers/authController');

const router = express.Router();

// router.use(isLoggedIn);

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// S'abonner ou !
router.route('/:id/follow').patch(toggleAbonneUser);

// If certain user is following another
router.route('/:id/:is').get(getAbonnes);

// Update profile picture
router.route('/:id/updatePImage').patch(updatePImage);

module.exports = router;
