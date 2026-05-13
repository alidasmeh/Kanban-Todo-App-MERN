"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.toggleAdmin = exports.removeMember = exports.addMember = exports.createTeam = exports.getTeams = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
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
        }).populate('owners members', 'name email');
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
            members: []
        });
        const populatedTeam = await Team_1.default.findById(team._id).populate('owners members', 'name email');
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
const addMember = async (req, res) => {
    const { userId } = req.body;
    const teamId = req.params.id;
    const currentUserId = req.user._id;
    try {
        const team = await Team_1.default.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        // Only owners can add members
        if (!team.owners.includes(currentUserId)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (team.members.includes(userId) || team.owners.includes(userId)) {
            return res.status(400).json({ message: 'User already in team' });
        }
        team.members.push(userId);
        await team.save();
        const populatedTeam = await Team_1.default.findById(team._id).populate('owners members', 'name email');
        res.json(populatedTeam);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addMember = addMember;
// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private
const removeMember = async (req, res) => {
    const { userId } = req.params;
    const teamId = req.params.id;
    const currentUserId = req.user._id;
    try {
        const team = await Team_1.default.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        // Only owners can remove members
        if (!team.owners.includes(currentUserId)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        team.members = team.members.filter((id) => id.toString() !== userId);
        team.owners = team.owners.filter((id) => id.toString() !== userId);
        await team.save();
        const populatedTeam = await Team_1.default.findById(team._id).populate('owners members', 'name email');
        res.json(populatedTeam);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.removeMember = removeMember;
// @desc    Toggle admin status
// @route   PUT /api/teams/:id/members/:userId/admin
// @access  Private
const toggleAdmin = async (req, res) => {
    const { userId } = req.params;
    const teamId = req.params.id;
    const currentUserId = req.user._id;
    try {
        const team = await Team_1.default.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        // Only owners can toggle admin status
        if (!team.owners.includes(currentUserId)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const isOwner = team.owners.includes(new mongoose_1.default.Types.ObjectId(userId));
        if (isOwner) {
            // Don't remove last owner
            if (team.owners.length === 1) {
                return res.status(400).json({ message: 'Cannot remove last owner' });
            }
            team.owners = team.owners.filter(id => id.toString() !== userId);
            team.members.push(new mongoose_1.default.Types.ObjectId(userId));
        }
        else {
            team.members = team.members.filter(id => id.toString() !== userId);
            team.owners.push(new mongoose_1.default.Types.ObjectId(userId));
        }
        await team.save();
        const populatedTeam = await Team_1.default.findById(team._id).populate('owners members', 'name email');
        res.json(populatedTeam);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.toggleAdmin = toggleAdmin;
// @desc    Get all users
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
