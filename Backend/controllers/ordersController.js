const pool = require('../model/db');
const CartModel = require('../model/CartModel');

const checkoutOrder = async (req, res) => {
    const userId = req.user.id;
    const { address } = req.body; // نأخذ العنوان من العميل

    if (!address) {
        return res.status(400).json({ success: false, message: "Delivery address is required" });
    }

    // سنبدأ TRANSACTION في PostgreSQL لضمان نجاح كل الخطوات معاً أو تراجعها في حال حدوث أي خطأ (All or Nothing)
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. جلب عناصر سلة العميل الحالية
        const cartItems = await CartModel.getCart(userId);
        if (cartItems.length === 0) {
            return res.status(400).json({ success: false, message: "Your cart is empty!" });
        }

        let totalPrice = 0;

        // 2. التحقق من المخزن (Stock Check) لكل كتاب في السلة
        for (const item of cartItems) {
            if (item.stock < item.quantity) {
                throw new Error(`Insufficient stock for book: ${item.title}. Only ${item.stock} left.`);
            }
            totalPrice += Number(item.price) * item.quantity;
        }

        // 3. إنشاء الطلب الرئيسي في جدول orders
        const orderQuery = `
            INSERT INTO orders (user_id, total_price, address, shipping_status)
            VALUES ($1, $2, $3, 'PENDING')
            RETURNING *;
        `;
        const orderResult = await client.query(orderQuery, [userId, totalPrice, address]);
        const newOrder = orderResult.rows[0];

        // 4. نقل المنتجات وتحديث المخزن لكل كتاب
        for (const item of cartItems) {
            // أ. إدخال في order_items وتثبيت سعر الشراء الحالي
            const orderItemQuery = `
                INSERT INTO order_items (order_id, book_id, price_at_purchase, quantity)
                VALUES ($1, $2, $3, $4);
            `;
            await client.query(orderItemQuery, [newOrder.id, item.book_id, item.price, item.quantity]);

            // ب. تحديث المخزن (خصم الكمية المشتراة)
            const updateStockQuery = `
                UPDATE books 
                SET stock = stock - $1 
                WHERE id = $2;
            `;
            await client.query(updateStockQuery, [item.quantity, item.book_id]);
        }

        // 5. تفريغ السلة بعد نجاح حفظ الفاتورة
        await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        // إتمام العملية بنجاح كامل وحفظ البيانات في الـ Database
        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order: newOrder
        });

    } catch (err) {
        // في حال فشل أي خطوة (مثلاً كتاب نفذ مخزونه)، نقوم بإلغاء كل ما حدث لضمان سلامة البيانات
        await client.query('ROLLBACK');
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    } finally {
        client.release();
    }
};
const updateShippingStatus = async (req, res) => {
    const { id } = req.params; // ID الطلب
    const { status } = req.body; // الحالة الجديدة (SHIPPED, DELIVERED, CANCELLED)

    const validStatuses = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid shipping status" });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // جلب حالة الطلب الحالية قبل التعديل
        const checkOrder = await client.query('SELECT shipping_status FROM orders WHERE id = $1', [id]);
        if (checkOrder.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const currentStatus = checkOrder.rows[0].shipping_status;

        // إذا تم إلغاء الطلب، يجب إعادة الكمية إلى المخزن
        if (status === 'CANCELLED' && currentStatus !== 'CANCELLED') {
            const items = await client.query('SELECT book_id, quantity FROM order_items WHERE order_id = $1', [id]);
            for (const item of items.rows) {
                await client.query('UPDATE books SET stock = stock + $1 WHERE id = $2', [item.quantity, item.book_id]);
            }
        }

        // تحديث الحالة
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