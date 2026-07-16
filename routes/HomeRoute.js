const express = require('express');
const router = express.Router();
const homeControllers=require('../controllers/homeControllers')
router.get('/books', homeControllers.getAllBooks);
// router.put('/',middleware , controller);
router.put('/books/:id', homeControllers.editBook);
// router.delete('/', middleware, controller);
router.delete('/books/:id', homeControllers.deleteBooks);
// router.post('/',middleware , controller)
router.post('/books', homeControllers.createBook);
module.exports = router;