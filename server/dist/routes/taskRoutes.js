"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .post(authMiddleware_1.protect, taskController_1.createTask);
router.route('/:id')
    .put(authMiddleware_1.protect, taskController_1.updateTask)
    .delete(authMiddleware_1.protect, taskController_1.deleteTask);
router.route('/:id/move')
    .put(authMiddleware_1.protect, taskController_1.moveTask);
exports.default = router;
