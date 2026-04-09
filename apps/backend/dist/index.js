"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const citaRoutes_1 = __importDefault(require("./infrastructure/http/routes/citaRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/citas', citaRoutes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});
app.listen(port, () => {
    console.log(`[Backend] Server is running on port ${port}`);
});
