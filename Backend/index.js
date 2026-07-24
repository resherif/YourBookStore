const express = require('express');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const cors = require('cors'); 
const HomeRoute = require('./routes/HomeRoute');
const specificBook = require('./routes/specificBookId');
const cartOrdersRoute = require('./routes/cartOrdersRoute');
const authRoutes = require('./routes/authRoutes');
const { ensureUserAuthColumns } = require('./model/db');
const app = express();
const cors = require("cors");
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', HomeRoute);
app.use('/api', specificBook);
app.use('/api', cartOrdersRoute);
const PORT = process.env.PORT;
ensureUserAuthColumns().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
  });
});