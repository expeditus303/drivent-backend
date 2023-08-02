import { AuthenticatedRequest } from '@/middlewares';
import { Response } from 'express';
import httpStatus from 'http-status';
import activityService from '@/services/activities-service';

export async function getDays(_req: AuthenticatedRequest, res: Response) {
  try {
    const days = await activityService.getDays();
    return res.status(httpStatus.OK).send(days);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getLocations(_req: AuthenticatedRequest, res: Response) {
  try {
    const locations = await activityService.getLocations();
    return res.status(httpStatus.OK).send(locations);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  try {
    const activities = await activityService.getActivities();
    return res.send(activities);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
