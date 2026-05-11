"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const columnSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    taskIds: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Task' }]
});
const boardSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    color: {
        type: String,
        default: 'indigo',
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    team: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    members: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        }],
    columns: {
        type: Map,
        of: columnSchema,
        default: {
            'todo': { id: 'todo', title: 'TO DO', taskIds: [] },
            'in-progress': { id: 'in-progress', title: 'IN PROGRESS', taskIds: [] },
            'done': { id: 'done', title: 'DONE', taskIds: [] }
        }
    },
    columnOrder: {
        type: [String],
        default: ['todo', 'in-progress', 'done'],
    },
}, {
    timestamps: true,
});
const Board = mongoose_1.default.model('Board', boardSchema);
exports.default = Board;
