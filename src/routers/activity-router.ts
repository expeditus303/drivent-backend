import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getActivities, getDays, getLocations } from '@/controllers/activity-controller';

const activityRouter = Router();

activityRouter
  .all('/*', authenticateToken)
  .get('/days', getDays)
  .get('/locations', getLocations)
  .get('/', getActivities);

export { activityRouter };
