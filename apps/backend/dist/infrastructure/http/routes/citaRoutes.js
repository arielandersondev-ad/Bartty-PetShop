"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CitaController_1 = require("../controllers/CitaController");
const router = (0, express_1.Router)();
const citaController = new CitaController_1.CitaController();
router.get('/', citaController.getAll.bind(citaController));
exports.default = router;
