import express from 'express';
import { 
  getTeams, 
  createTeam, 
  addMemberToTeam, 
  removeMemberFromTeam,
  getAllUsers,
  toggleAdminStatus
} from '../controllers/teamController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getTeams)
  .post(protect, createTeam);

router.get('/users', protect, getAllUsers);

router.post('/:id/members', protect, addMemberToTeam);
router.delete('/:id/members/:userId', protect, removeMemberFromTeam);
router.put('/:id/members/:userId/admin', protect, toggleAdminStatus);

export default router;
