"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDefaults = void 0;
const User_1 = __importDefault(require("../models/User"));
const Team_1 = __importDefault(require("../models/Team"));
const Board_1 = __importDefault(require("../models/Board"));
const crypto_1 = __importDefault(require("crypto"));
const initDefaults = async () => {
    try {
        // 1. Ensure a System Admin user exists to own default entities
        let systemUser = await User_1.default.findOne({ email: 'system@kinetic.com' });
        if (!systemUser) {
            systemUser = await User_1.default.create({
                name: 'System Admin',
                email: 'system@kinetic.com',
                password: crypto_1.default.randomBytes(32).toString('hex'), // Random password for security
            });
            console.log('System Admin user created.');
        }
        // 2. Ensure "Everyone" team exists
        let everyoneTeam = await Team_1.default.findOne({ name: 'Everyone' });
        if (!everyoneTeam) {
            everyoneTeam = await Team_1.default.create({
                name: 'Everyone',
                description: 'Default team for all users.',
                owners: [systemUser._id],
                members: []
            });
            console.log('"Everyone" team created.');
        }
        // 3. Ensure "General" board exists and is assigned to "Everyone" team
        let generalBoard = await Board_1.default.findOne({ title: 'General' });
        if (!generalBoard) {
            await Board_1.default.create({
                title: 'General',
                description: 'Main board for everyone.',
                owner: systemUser._id,
                team: everyoneTeam._id,
                members: [systemUser._id],
                columns: {
                    'todo': { id: 'todo', title: 'TO DO', taskIds: [] },
                    'in-progress': { id: 'in-progress', title: 'IN PROGRESS', taskIds: [] },
                    'done': { id: 'done', title: 'DONE', taskIds: [] }
                },
                columnOrder: ['todo', 'in-progress', 'done']
            });
            console.log('"General" board created.');
        }
    }
    catch (error) {
        console.error('Error initializing defaults:', error);
    }
};
exports.initDefaults = initDefaults;
