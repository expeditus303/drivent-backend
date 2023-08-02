import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getDays } from '@/controllers/activity-controller';

const activityRouter = Router();

activityRouter.all('/*', authenticateToken).get('/days', getDays);

export { activityRouter };
