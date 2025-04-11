import express, { Request, Response } from 'express';
import User, { IUser } from '../models/User';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users - Create new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/users/:id - Delete user by id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
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
router.put('/:id/role', async (req: Request, res: Response): Promise<void> => {
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
