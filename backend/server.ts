import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';



// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || '', {})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Backend is working!');
});

// Routes
import userRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoutes';
import sectionRoutes from './routes/sectionRoutes';
import registrationRoutes from './routes/registrationRoutes';
import majorRoutes from './routes/majorRoutes';
import graduationRoutes from "./routes/graduationRoutes";

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/majors', majorRoutes);
app.use("/api/graduation-check", graduationRoutes);


// Start the server
const PORT = process.argv[2] || process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
