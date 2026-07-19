// controllers/specificBookController.js
const BookModel = require('../model/Books');

const getBookById = async (req, res) => { 
    try {
        const { id } = req.params; 
        const book = await BookModel.getBookById(id); 

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.json({
            success: true,
            message: 'Book retrieved successfully',
            data: book
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, err: err.message });
    }
};
module.exports = {
    getBookById 
};