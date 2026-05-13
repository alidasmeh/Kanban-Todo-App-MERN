"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .get(authMiddleware_1.protect, teamController_1.getTeams)
    .post(authMiddleware_1.protect, teamController_1.createTeam);
router.get('/users', authMiddleware_1.protect, teamController_1.getAllUsers);
router.post('/:id/members', authMiddleware_1.protect, teamController_1.addMember);
router.delete('/:id/members/:userId', authMiddleware_1.protect, teamController_1.removeMember);
router.put('/:id/members/:userId/admin', authMiddleware_1.protect, teamController_1.toggleAdmin);
exports.default = router;
