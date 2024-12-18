"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ViagemController_1 = require("../controllers/ViagemController");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.post('/process', (0, asyncHandler_1.asyncHandler)(ViagemController_1.ViagemController.processApis));
router.get('/fetch/:id', (0, asyncHandler_1.asyncHandler)(ViagemController_1.ViagemController.fetchById));
router.get('/fetch', (0, asyncHandler_1.asyncHandler)(ViagemController_1.ViagemController.fetchAll));
exports.default = router;
