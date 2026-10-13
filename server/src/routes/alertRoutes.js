import { Router } from 'express';
import { getAlerts, resolveAlert, createAlert } from '../controllers/alertController.js';

const router = Router();

router.get('/', getAlerts);
router.post('/', createAlert);
router.patch('/:id/resolve', resolveAlert);

export default router;
