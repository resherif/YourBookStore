const express = require('express');
const router = express.Router();
const reqAuth = require('../middlewares/authMiddleware').requireAuth;
const isAdmin = require('../middlewares/authMiddleware').isAdmin;
const homeControllers=require('../controllers/homeControllers')
router.get('/books', homeControllers.getAllBooks);
router.put('/books/:id',reqAuth,isAdmin, homeControllers.editBook);
router.delete('/books/:id',reqAuth,isAdmin, homeControllers.deleteBooks);
router.post('/books',reqAuth,isAdmin, homeControllers.createBook);
module.exports = router;