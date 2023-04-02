const express = require('express');
const router = express.Router();
const {signupUser, loginUser, resetPassword, updateUser} = require('../controllers/users');

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/forgot-password', resetPassword);
router.patch('/update', updateUser);

module.exports = router;