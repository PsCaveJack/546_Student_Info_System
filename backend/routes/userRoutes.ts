// routes/userRoutes.ts
import express, { RequestHandler } from 'express';
import User, { IUser } from '../models/User';

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

// POST /api/users/login - User login
const loginHandler: RequestHandler = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, password, role });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // strip out password before sending back
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ message: 'Login successful', user: userWithoutPassword });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
router.post('/login', loginHandler);

// DELETE /api/users/:id - Delete user by id
const deleteUser: RequestHandler = async (req, res) => {
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
};
router.delete('/:id', deleteUser);

// PUT /api/users/:id/role - Update roles
const updateRole: RequestHandler = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
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
};
router.put('/:id/role', updateRole);

// PUT /api/users/:id/reset-password - Resets password to default "default123"
const resetPassword: RequestHandler = async (req, res) => {
  try {
    const newPassword = req.body.password || 'default123';
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
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
};
router.put('/:id/reset-password', resetPassword);

export default router;
