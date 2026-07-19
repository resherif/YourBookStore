const pool = require('../model/db');
const CartModel = require('../model/CartModel');

const checkoutOrder = async (req, res) => {
    const userId = req.user.id;
    const { address } = req.body; 
    if (!address) {
        return res.status(400).json({ success: false, message: "Delivery address is required" });
    }

    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        
        const cartItems = await CartModel.getCart(userId);
        if (cartItems.length === 0) {
            return res.status(400).json({ success: false, message: "Your cart is empty!" });
        }

        let totalPrice = 0;

        
        for (const item of cartItems) {
            if (item.stock < item.quantity) {
                throw new Error(`Insufficient stock for book: ${item.title}. Only ${item.stock} left.`);
            }
            totalPrice += Number(item.price) * item.quantity;
        }

        
        const orderQuery = `
            INSERT INTO orders (user_id, total_price, address, shipping_status)
            VALUES ($1, $2, $3, 'PENDING')
            RETURNING *;
        `;
        const orderResult = await client.query(orderQuery, [userId, totalPrice, address]);
        const newOrder = orderResult.rows[0];

        
        for (const item of cartItems) {
            
            const orderItemQuery = `
                INSERT INTO order_items (order_id, book_id, price_at_purchase, quantity)
                VALUES ($1, $2, $3, $4);
            `;
            await client.query(orderItemQuery, [newOrder.id, item.book_id, item.price, item.quantity]);

    
            const updateStockQuery = `
                UPDATE books 
                SET stock = stock - $1 
                WHERE id = $2;
            `;
            await client.query(updateStockQuery, [item.quantity, item.book_id]);
        }

        
        await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        
        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order: newOrder
        });

    } catch (err) {
        
        await client.query('ROLLBACK');
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    } finally {
        client.release();
    }
};
const updateShippingStatus = async (req, res) => {
    const { id } = req.params; 
    const { status } = req.body; 

    const validStatuses = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid shipping status" });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        
        const checkOrder = await client.query('SELECT shipping_status FROM orders WHERE id = $1', [id]);
        if (checkOrder.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const currentStatus = checkOrder.rows[0].shipping_status;

        
        if (status === 'CANCELLED' && currentStatus !== 'CANCELLED') {
            const items = await client.query('SELECT book_id, quantity FROM order_items WHERE order_id = $1', [id]);
            for (const item of items.rows) {
                await client.query('UPDATE books SET stock = stock + $1 WHERE id = $2', [item.quantity, item.book_id]);
            }
        }

        
        const updateQuery = `
            UPDATE orders 
            SET shipping_status = $1 
            WHERE id = $2 
            RETURNING *;
        `;
        const result = await client.query(updateQuery, [status, id]);

        await client.query('COMMIT');
        res.json({ success: true, message: `Order status updated to ${status}`, data: result.rows[0] });

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ success: false, error: err.message });
    } finally {
        client.release();
    }
};

module.exports = { checkoutOrder, updateShippingStatus };