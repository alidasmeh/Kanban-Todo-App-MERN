"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const initDefaults_1 = require("./utils/initDefaults");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const boardRoutes_1 = __importDefault(require("./routes/boardRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
dotenv_1.default.config();
// Connect to database
(0, db_1.default)().then(() => {
    (0, initDefaults_1.initDefaults)();
});
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/boards', boardRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
app.use('/api/teams', teamRoutes_1.default);
app.get('/', (req, res) => {
    res.send('API is running...');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
