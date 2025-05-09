// routes/userRoutes.ts
import express, { Request, RequestHandler, Response } from 'express';
import User, { IUser } from '../models/User';
import CourseHistory, { ICourseHistory } from '../models/CourseHistory';
const router = express.Router();

// GET /api/users - Get all users
const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users: IUser[] = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
router.get('/', getAllUsers);

// POST /api/users - Create new user
const createUser: RequestHandler = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
router.post('/', createUser);

// GET /api/users/login - User login
const loginHandler: RequestHandler = async (req, res): Promise<void> => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    res.status(400).json({ error: 'Email, password, and role are required' });
    return;
  }

  try {
    const user = await User.findOne({ email, password, role });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
    return; // <-- explicitly return to avoid ambiguity
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    return; // <-- also explicitly return here
  }
};

router.post('/login', loginHandler);
// backend/routes/courseHistoryRoutes.ts
// Get course history for a user (you can adjust this based on your requirements)
interface Params {
  userId: string;
}

router.get('/course-history', async (req, res) => {
  try {
    const courses = await CourseHistory.find(); // Modify query if needed
    res.status(200).json(courses);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Failed to load course history', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
});

// DELETE /api/users/:id - Delete user by id
router.delete('/:id', async (req, res): Promise<void> => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
// PUT /api/users/:id/role - Update roles
router.put('/:id/role', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const newRole = req.body.role;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(updatedUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:id/reset-password - Resets password to plain text"default123"
router.put('/:id/reset-password', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const newPassword = req.body.password || 'default123';

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'Password reset', user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;