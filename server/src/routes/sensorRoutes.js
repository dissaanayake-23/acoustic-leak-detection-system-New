import { Router } from 'express';
import { getLatestSensor, ingestReading, getDeviceStatus, updateThreshold } from '../controllers/sensorController.js';

const router = Router();

router.get('/latest', getLatestSensor);
router.post('/reading', ingestReading);
router.get('/device', getDeviceStatus);
router.post('/threshold', updateThreshold);

export default router;
