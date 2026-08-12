const express = require('express');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const HomeRoute = require('./routes/HomeRoute');
const specificBook = require('./routes/specificBookId');
const cartOrdersRoute = require('./routes/cartOrdersRoute');
const authRoutes = require('./routes/authRoutes');
const { ensureUserAuthColumns } = require('./model/db');

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(new Error('CORS Error: Origin not allowed'));
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
  res.json({ message: 'Bookstore Backend API is running smoothly on Vercel!' });
});
app.use('/api', authRoutes);
app.use('/api', HomeRoute);
app.use('/api', specificBook);
app.use('/api', cartOrdersRoute);
ensureUserAuthColumns();
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
}

module.exports = app;