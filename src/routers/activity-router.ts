import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getActivities, getDays, getLocations, postSubscription } from '@/controllers/activity-controller';

const activityRouter = Router();

activityRouter
  .all('/*', authenticateToken)
  .get('/days', getDays)
  .get('/locations', getLocations)
  .get('/', getActivities)
  .post('/subscriptions', postSubscription);

export { activityRouter };
