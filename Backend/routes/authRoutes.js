const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');
const refreshController = require('../controllers/refreshController');
const { requestPasswordReset, resetPassword } = require('../controllers/passwordResetController');

router.post('/login', loginController);
router.post('/register', registerController);
router.get('/refresh', refreshController);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
