"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.toggleAdminStatus = exports.removeMemberFromTeam = exports.addMemberToTeam = exports.createTeam = exports.getTeams = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const User_1 = __importDefault(require("../models/User"));
// @desc    Get all teams for user
// @route   GET /api/teams
// @access  Private
const getTeams = async (req, res) => {
    const userId = req.user._id;
    try {
        const teams = await Team_1.default.find({
            $or: [
                { owners: userId },
                { members: userId }
            ]
        }).populate('members', 'name email').populate('owners', 'name email');
        res.json(teams);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTeams = getTeams;
// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user._id;
    try {
        const team = await Team_1.default.create({
            name,
            description,
            owners: [userId],
            members: [userId]
        });
        const populatedTeam = await team.populate('members', 'name email');
        res.status(201).json(populatedTeam);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createTeam = createTeam;
// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private
const addMemberToTeam = async (req, res) => {
    const { userId } = req.body;
    const teamId = req.params.id;
    const currentUserId = req.user._id;
    try {
        const team = await Team_1.default.findById(teamId);
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
        const updatedTeam = await Team_1.default.findById(teamId).populate('members', 'name email').populate('owners', 'name email');
        res.json(updatedTeam);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addMemberToTeam = addMemberToTeam;
// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private
const removeMemberFromTeam = async (req, res) => {
    const { userId } = req.params;
    const teamId = req.params.id;
    const currentUserId = req.user._id;
    try {
        const team = await Team_1.default.findById(teamId);
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
        team.owners = team.owners.filter((id) => id.toString() !== userId);
        await team.save();
        const updatedTeam = await Team_1.default.findById(teamId).populate('members', 'name email').populate('owners', 'name email');
        res.json(updatedTeam);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.removeMemberFromTeam = removeMemberFromTeam;
// @desc    Toggle admin status for a member
// @route   PUT /api/teams/:id/members/:userId/admin
// @access  Private
const toggleAdminStatus = async (req, res) => {
    const { userId } = req.params;
    const teamId = req.params.id;
    const currentUserId = req.user._id;
    try {
        const team = await Team_1.default.findById(teamId);
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
            team.owners = team.owners.filter(id => id.toString() !== userId);
        }
        else {
            team.owners.push(userId);
        }
        await team.save();
        const updatedTeam = await Team_1.default.findById(teamId).populate('members', 'name email').populate('owners', 'name email');
        res.json(updatedTeam);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.toggleAdminStatus = toggleAdminStatus;
// @desc    Get all users (for adding to teams)
// @route   GET /api/teams/users
// @access  Private
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.default.find({}).select('name email');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllUsers = getAllUsers;
