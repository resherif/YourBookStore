const pool = require('./db');

const CartModel = {
    // 1. إضافة كتاب للسلة (أو زيادة الكمية إذا كان موجوداً بالفعل)
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

    // 2. جلب جميع عناصر السلة الخاصة بمستخدم معين (مع تفاصيل الكتب)
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

    // 3. تعديل كمية كتاب معين في السلة
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

    // 4. حذف كتاب من السلة
    removeFromCart: async (user_id, book_id) => {
        const query = `
            DELETE FROM cart_items 
            WHERE user_id = $1 AND book_id = $2
            RETURNING *;
        `;
        const result = await pool.query(query, [user_id, book_id]);
        return result.rows[0];
    },

    // 5. تفريغ السلة بالكامل (مهم جداً بعد إتمام عملية الشراء)
    clearCart: async (user_id) => {
        await pool.query('DELETE FROM cart_items WHERE user_id = $1', [user_id]);
    }
};

module.exports = CartModel;