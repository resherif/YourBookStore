const express = require('express');
const HomeRoute = require('./routes/HomeRoute');
const specificBook = require('./routes/specificBookId');
const app = express();
app.use(express.json());
app.use('/api', HomeRoute);
app.use('/api',specificBook)
app.listen(3000, () => {
  console.log(` Server is running on port 3000`);
});