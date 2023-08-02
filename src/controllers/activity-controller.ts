import { AuthenticatedRequest } from '@/middlewares';
import { Response } from 'express';
import httpStatus from 'http-status';
import activityService from '@/services/activities-service';

export async function getDays(req: AuthenticatedRequest, res: Response) {
  try {
    const days = await activityService.getDays();
    return res.status(httpStatus.OK).send(days);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
