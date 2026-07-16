// controllers/homeControllers.js
const BookModel = require('../model/Books');
const getAllBooks = async (req, res) => { 
    try {
        const { category } = req.query;
        let books;
        if (category) {
books=await BookModel.getByCategory(category)
        }
        else { books = await BookModel.getAllBooks(); }
        
        if (!books || books.length === 0) {
            return res.status(404).json({ success: false, message: 'No books are found' });
        }
        res.json({
            success: true,
            message: 'All books are retrieved successfully',
            data: books
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, err: err.message });
    }
};

// 2. Create Book
const createBook = async (req, res) => { 
    try { 
        const { title, price, category_id, stock, description } = req.body;
        
        if (!title || !price) {
            return res.status(400).json({ success: false, message: 'Title and price are required' });
        }

        const book = await BookModel.createBook(title, price, category_id, stock, description);
        
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: book
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, err: err.message });
    }
};

// 3. Edit Book
const editBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price, category_id, stock, description } = req.body;

        const updatedBook = await BookModel.EditBook(id, title, price, category_id, stock, description);

        if (!updatedBook) {
            return res.status(404).json({ success: false, message: 'Book not found to edit' });
        }

        res.json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, err: err.message });
    }
};

// 4. Delete Book
const deleteBooks = async (req, res) => { 
    try { 
        const { id } = req.params; // جلب الـ ID من الـ URL params
        const book = await BookModel.deletBook(id); // تمرير الـ ID للدالة

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found to delete' });
        }
        res.json({
            success: true,
            message: 'Book deleted successfully',
            data: book
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, err: err.message });
    }
};

module.exports = {
    getAllBooks,
    createBook,
    editBook,
    deleteBooks
};