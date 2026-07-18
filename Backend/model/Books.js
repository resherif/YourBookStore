const pool = require('./db'); 
const BookModel = {
  getAllBooks: async () => {
    const result = await pool.query('SELECT * FROM books');
    return result.rows;
    },
  
  getBookById: async (id) => {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    return result.rows[0];
    },
    getByCategory: async (category) => {
        const result = await pool.query('SELECT * FROM books WHERE category_id=$1', [category]);
        return result.rows;
     }
  ,
  createBook: async (title, price, category_id) => {
    const result = await pool.query(
      'INSERT INTO books (title, price, category_id) VALUES ($1, $2, $3) RETURNING *',
      [title, price, category_id]
    );
    return result.rows[0];
    },
  deletBook: async (id) => { 
      const result = await pool.query('DELETE FROM books WHERE id= $1 RETURNING *', [id])
    return result.rows[0];
    },
    EditBook: async (id, title, price, category_id, stock, description) => { 
    const result = await pool.query(
      'UPDATE books SET title = $1, price = $2, category_id = $3, stock = $4, description = $5 WHERE id = $6 RETURNING *',
      [title, price, category_id, stock, description, id]
    );
    return result.rows[0];
  }
};

module.exports = BookModel;