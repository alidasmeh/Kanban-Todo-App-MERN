import express from 'express';
import { 
  getTeams, 
  createTeam, 
  addMember, 
  removeMember,
  getAllUsers,
  toggleAdmin
} from '../controllers/teamController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getTeams)
  .post(protect, createTeam);

router.get('/users', protect, getAllUsers);

router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);
router.put('/:id/members/:userId/admin', protect, toggleAdmin);

export default router;
