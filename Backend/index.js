const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cookieParser = require('cookie-parser');
const cors = require('cors');
const HomeRoute = require('./routes/HomeRoute');
const specificBook = require('./routes/specificBookId');
const cartOrdersRoute = require('./routes/cartOrdersRoute');
const authRoutes = require('./routes/authRoutes');
const { ensureUserAuthColumns } = require('./model/db');
const app = express();

app.use(cors({
  origin: ['http://localhost:5173'||
    'http://127.0.0.1:5173'||
    process.env.CLIENT_URL],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', HomeRoute);
app.use('/api', specificBook);
app.use('/api', cartOrdersRoute);

const PORT = process.env.PORT || 5000;
ensureUserAuthColumns().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
});
module.exports = app;