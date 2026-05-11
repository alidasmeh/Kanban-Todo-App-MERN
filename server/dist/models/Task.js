"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
        default: 'TODO',
    },
    assignee: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    boardId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    columnId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Task = mongoose_1.default.model('Task', taskSchema);
exports.default = Task;
