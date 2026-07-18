const express = require('express');
const cookieParser = require('cookie-parser');
const HomeRoute = require('./routes/HomeRoute');
const specificBook = require('./routes/specificBookId');
const cartOrdersRoute = require('./routes/cartOrdersRoute');
const authRoutes = require('./routes/authRoutes');
const { ensureUserAuthColumns } = require('./model/db');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', HomeRoute);
app.use('/api', specificBook);
app.use('/api', cartOrdersRoute);

ensureUserAuthColumns().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});