const pool = require('./db');

const CartModel = {
    
    addToCart: async (user_id, book_id, quantity = 1) => {
        const query = `
            INSERT INTO cart_items (user_id, book_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, book_id) 
            DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
            RETURNING *;
        `;
        const result = await pool.query(query, [user_id, book_id, quantity]);
        return result.rows[0];
    },

    
    getCart: async (user_id) => {
        const query = `
            SELECT ci.id AS cart_item_id, ci.quantity, b.id AS book_id, b.title, b.price, b.stock
            FROM cart_items ci
            JOIN books b ON ci.book_id = b.id
            WHERE ci.user_id = $1;
        `;
        const result = await pool.query(query, [user_id]);
        return result.rows;
    },

    
    updateQuantity: async (user_id, book_id, quantity) => {
        const query = `
            UPDATE cart_items 
            SET quantity = $3 
            WHERE user_id = $1 AND book_id = $2
            RETURNING *;
        `;
        const result = await pool.query(query, [user_id, book_id, quantity]);
        return result.rows[0];
    },


    removeFromCart: async (user_id, book_id) => {
        const query = `
            DELETE FROM cart_items 
            WHERE user_id = $1 AND book_id = $2
            RETURNING *;
        `;
        const result = await pool.query(query, [user_id, book_id]);
        return result.rows[0];
    },

    
    clearCart: async (user_id) => {
        await pool.query('DELETE FROM cart_items WHERE user_id = $1', [user_id]);
    }
};

module.exports = CartModel;