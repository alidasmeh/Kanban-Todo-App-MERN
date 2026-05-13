import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Team from '../models/Team';
import User from '../models/User';
import { AuthRequest } from '../types';

// @desc    Get all teams for user
// @route   GET /api/teams
// @access  Private
export const getTeams = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user._id;

  try {
    const teams = await Team.find({
      $or: [
        { owners: userId },
        { members: userId }
      ]
    }).populate('owners members', 'name email');

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
  const userId = (req as AuthRequest).user._id;

  try {
    const team = await Team.create({
      name,
      description,
      owners: [userId],
      members: []
    });

    const populatedTeam = await Team.findById(team._id).populate('owners members', 'name email');
    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private
export const addMember = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const teamId = req.params.id;
  const currentUserId = (req as AuthRequest).user._id;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Only owners can add members
    if (!team.owners.some(id => id.equals(currentUserId as mongoose.Types.ObjectId))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId as string);

    if (team.members.some(id => id.equals(userIdObj)) || team.owners.some(id => id.equals(userIdObj))) {
      return res.status(400).json({ message: 'User already in team' });
    }

    team.members.push(userIdObj);
    await team.save();

    const populatedTeam = await Team.findById(team._id).populate('owners members', 'name email');
    res.json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private
export const removeMember = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const teamId = req.params.id;
  const currentUserId = (req as AuthRequest).user._id;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Only owners can remove members
    if (!team.owners.some(id => id.equals(currentUserId as mongoose.Types.ObjectId))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    team.members = team.members.filter((id) => id.toString() !== userId);
    team.owners = team.owners.filter((id) => id.toString() !== userId);
    
    await team.save();

    const populatedTeam = await Team.findById(team._id).populate('owners members', 'name email');
    res.json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Toggle admin status
// @route   PUT /api/teams/:id/members/:userId/admin
// @access  Private
export const toggleAdmin = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const teamId = req.params.id;
  const currentUserId = (req as AuthRequest).user._id;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Only owners can toggle admin status
    if (!team.owners.includes(currentUserId as mongoose.Types.ObjectId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const isOwner = team.owners.includes(new mongoose.Types.ObjectId(userId as string));

    if (isOwner) {
      // Don't remove last owner
      if (team.owners.length === 1) {
        return res.status(400).json({ message: 'Cannot remove last owner' });
      }
      team.owners = team.owners.filter(id => id.toString() !== userId);
      team.members.push(new mongoose.Types.ObjectId(userId as string));
    } else {
      team.members = team.members.filter(id => id.toString() !== userId);
      team.owners.push(new mongoose.Types.ObjectId(userId as string));
    }

    await team.save();

    const populatedTeam = await Team.findById(team._id).populate('owners members', 'name email');
    res.json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Get all users
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
