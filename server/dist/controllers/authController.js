"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.registerUser = exports.authUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const Team_1 = __importDefault(require("../models/Team"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: (0, generateToken_1.default)(user._id.toString()),
        });
    }
    else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};
exports.authUser = authUser;
// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    const user = await User_1.default.create({
        name,
        email,
        password,
    });
    if (user) {
        // Add user to "Everyone" team
        const everyoneTeam = await Team_1.default.findOne({ name: 'Everyone' });
        if (everyoneTeam) {
            everyoneTeam.members.push(user._id);
            await everyoneTeam.save();
        }
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: (0, generateToken_1.default)(user._id.toString()),
        });
    }
    else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};
exports.registerUser = registerUser;
// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
    const user = req.user;
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    else {
        res.status(404).json({ message: 'User not found' });
    }
};
exports.getUserProfile = getUserProfile;
