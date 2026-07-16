const express = require('express');
const router = express.Router()
const bookId=require('../controllers/specificBookController')
router.get('/books/:Id', bookId.getBookById);
module.exports = router;