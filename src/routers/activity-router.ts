import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getDays, getLocations } from '@/controllers/activity-controller';

const activityRouter = Router();

activityRouter.all('/*', authenticateToken).get('/days', getDays).get('/locations', getLocations);

export { activityRouter };
