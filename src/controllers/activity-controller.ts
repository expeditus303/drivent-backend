import { AuthenticatedRequest } from '@/middlewares';
import { Response } from 'express';
import httpStatus from 'http-status';
import activityService from '@/services/activities-service';

export async function getDays(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const days = await activityService.getDays(userId);
    return res.status(httpStatus.OK).send(days);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'cannotListActivitiesError') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getLocations(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const locations = await activityService.getLocations(userId);
    return res.status(httpStatus.OK).send(locations);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const activities = await activityService.getActivities(userId);
    return res.send(activities);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
