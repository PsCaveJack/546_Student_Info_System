// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (update the connection string in .env)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Sample route
app.get('/', (req, res) => {
  res.send('Hello from CPSC546 MERN backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
