require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Simple test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// ✅ Hook in your API route
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);

const sectionRoutes = require('./routes/sectionRoutes');
app.use('/api/sections', sectionRoutes);

const registrationRoutes = require('./routes/registrationRoutes');
app.use('/api/registrations', registrationRoutes);

const majorRoutes = require('./routes/majorRoutes');
app.use('/api/majors', majorRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

