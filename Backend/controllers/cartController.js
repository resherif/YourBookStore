const CartModel = require('../model/CartModel');

const getCart = async (req, res) => {
    try {
        const userId = req.user.id; 
        const cartItems = await CartModel.getCart(userId);
        res.json({ success: true, data: cartItems });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const addItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { book_id, quantity } = req.body;
        
        if (!book_id) {
            return res.status(400).json({ success: false, message: "Book ID is required" });
        }

        const item = await CartModel.addToCart(userId, book_id, quantity || 1);
        res.status(201).json({ success: true, message: "Added to cart successfully", data: item });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const updateItemQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { book_id, quantity } = req.body;

        if (quantity <= 0) {
            await CartModel.removeFromCart(userId, book_id);
            return res.json({ success: true, message: "Item removed because quantity is 0" });
        }

        const updated = await CartModel.updateQuantity(userId, book_id, quantity);
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { book_id } = req.params;
        await CartModel.removeFromCart(userId, book_id);
        res.json({ success: true, message: "Item removed from cart" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getCart, addItem, updateItemQuantity, deleteItem };