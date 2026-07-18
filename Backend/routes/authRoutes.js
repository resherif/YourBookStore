const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');
const refreshController = require('../controllers/refreshController');

router.post('/login', loginController);
router.post('/register', registerController);
router.get('/refresh', refreshController);

module.exports = router;
