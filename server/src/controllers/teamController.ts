import { Request, Response } from 'express';
import Team from '../models/Team';
import User from '../models/User';

// @desc    Get all teams for user
// @route   GET /api/teams
// @access  Private
export const getTeams = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;

  try {
    const teams = await Team.find({
      $or: [
        { owners: userId },
        { members: userId }
      ]
    }).populate('members', 'name email').populate('owners', 'name email');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
export const createTeam = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const userId = (req as any).user._id;

  try {
    const team = await Team.create({
      name,
      description,
      owners: [userId],
      members: [userId]
    });

    const populatedTeam = await team.populate('members', 'name email');
    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private
export const addMemberToTeam = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const teamId = req.params.id;
  const currentUserId = (req as any).user._id;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.owners.some(id => id.toString() === currentUserId.toString())) {
      return res.status(403).json({ message: 'Only team owners can add members' });
    }

    if (team.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    team.members.push(userId);
    await team.save();

    const updatedTeam = await Team.findById(teamId).populate('members', 'name email').populate('owners', 'name email');
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private
export const removeMemberFromTeam = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const teamId = req.params.id;
  const currentUserId = (req as any).user._id;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const isOwner = team.owners.some(id => id.toString() === currentUserId.toString());
    const isTargetSelf = userId === currentUserId.toString();

    if (!isOwner && !isTargetSelf) {
      return res.status(403).json({ message: 'Unauthorized to remove member' });
    }

    // Cannot remove the last owner
    if (team.owners.some(id => id.toString() === userId) && team.owners.length === 1) {
      return res.status(400).json({ message: 'Cannot remove the last team owner' });
    }

    team.members = team.members.filter((id) => id.toString() !== userId);
    team.owners = team.owners.filter((id) => id.toString() !== userId) as any;
    await team.save();

    const updatedTeam = await Team.findById(teamId).populate('members', 'name email').populate('owners', 'name email');
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Toggle admin status for a member
// @route   PUT /api/teams/:id/members/:userId/admin
// @access  Private
export const toggleAdminStatus = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const teamId = req.params.id;
  const currentUserId = (req as any).user._id;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.owners.some(id => id.toString() === currentUserId.toString())) {
      return res.status(403).json({ message: 'Only team owners can toggle admin status' });
    }

    if (!team.members.some(id => id.toString() === userId)) {
      return res.status(400).json({ message: 'User is not a member of this team' });
    }

    const isAlreadyOwner = team.owners.some(id => id.toString() === userId);

    if (isAlreadyOwner) {
      if (team.owners.length === 1) {
        return res.status(400).json({ message: 'Cannot revoke admin status from the last owner' });
      }
      team.owners = team.owners.filter(id => id.toString() !== userId) as any;
    } else {
      team.owners.push(userId as any);
    }

    await team.save();

    const updatedTeam = await Team.findById(teamId).populate('members', 'name email').populate('owners', 'name email');
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Get all users (for adding to teams)
// @route   GET /api/teams/users
// @access  Private
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('name email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
