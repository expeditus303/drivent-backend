import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import {
  deleteSubscription,
  getActivities,
  getDays,
  getLocations,
  postSubscription,
} from '@/controllers/activity-controller';

const activityRouter = Router();

activityRouter
  .all('/*', authenticateToken)
  .get('/days', getDays)
  .get('/locations', getLocations)
  .get('/', getActivities)
  .post('/subscriptions', postSubscription)
  .delete('/subscriptions', deleteSubscription);

export { activityRouter };
