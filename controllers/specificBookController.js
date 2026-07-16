// controllers/specificBookController.js
const BookModel = require('../model/Books');

const getBookById = async (req, res) => { 
    try {
        const { id } = req.params; // نأخذ المعرف من الـ params
        const book = await BookModel.getBookById(id); // تمرير الـ id للدالة مع الأقواس ()

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
//add to cart func
module.exports = {
    getBookById 
};