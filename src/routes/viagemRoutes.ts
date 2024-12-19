import { Router } from 'express';
import { ViagemController } from '../controllers/ViagemController';
import { asyncHandler } from '../utils/asyncHandler';


const router = Router();

router.post('/process', asyncHandler(ViagemController.processApis));
router.get('/fetch/:id', asyncHandler(ViagemController.fetchById));
router.get('/fetch', asyncHandler(ViagemController.fetchAll));

export default router;
